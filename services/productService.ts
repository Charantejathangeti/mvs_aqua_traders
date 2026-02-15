
import { Product } from '../types';
import { INITIAL_PRODUCTS } from './mockData';

export class ProductService {
  private static STORAGE_KEY = 'mvs_aqua_products_v1';

  /**
   * Fetches the latest products from local storage, falling back to 
   * default mock data if none exists.
   */
  static async getProducts(): Promise<Product[]> {
    const localData = localStorage.getItem(this.STORAGE_KEY);
    
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse local products, resetting to defaults", e);
      }
    }

    // Default Fallback
    const defaults = INITIAL_PRODUCTS.map(p => ({
      ...p,
      category: p.category || 'Livestock',
      difficulty: p.difficulty || 'Beginner'
    }));
    
    // Save defaults immediately so they are "persistent" from the start
    this.saveProducts(defaults);
    return defaults;
  }

  /**
   * Simulates a sync with an external source like Google Sheets.
   * In a real app, this would perform a fetch() request.
   */
  static async syncWithGoogleSheet(): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Here we just re-load the initial set as a "reset" or "sync"
        const products = INITIAL_PRODUCTS;
        this.saveProducts(products);
        resolve(products);
      }, 1200);
    });
  }

  /**
   * Saves the product list to localStorage.
   */
  static saveProducts(products: Product[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      // Dispatch a custom event so other components can react if they need to
      window.dispatchEvent(new Event('product-catalog-updated'));
    } catch (e) {
      console.error("Failed to save products to localStorage", e);
    }
  }
}
