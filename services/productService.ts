
import { Product } from '../types.ts';
import { INITIAL_PRODUCTS } from './mockData.ts';

export class ProductService {
  private static STORAGE_KEY = 'mvs_aqua_products_v1';
  // Note: To use Google Sheets, replace this ID and publish your sheet as CSV.
  private static SHEET_ID = '1-YOUR-SHEET-ID-HERE'; 
  private static SHEET_URL = `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/export?format=csv`;

  static async getProducts(): Promise<Product[]> {
    const localData = localStorage.getItem(this.STORAGE_KEY);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse local products", e);
      }
    }

    return INITIAL_PRODUCTS;
  }

  static async syncWithGoogleSheet(): Promise<Product[]> {
    // Basic placeholder for sheet sync logic
    return this.getProducts();
  }

  static saveProducts(products: Product[]) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      window.dispatchEvent(new Event('product-catalog-updated'));
    } catch (e) {
      console.error("Failed to save products", e);
    }
  }
}
