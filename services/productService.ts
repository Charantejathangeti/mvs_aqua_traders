
import { Product } from '../types';
import { INITIAL_PRODUCTS } from './mockData';

export class ProductService {
  private static STORAGE_KEY = 'mvs_aqua_products_v1';
  // Replace this ID with your actual Google Sheet ID after publishing as CSV
  private static SHEET_ID = '1-YOUR-SHEET-ID-HERE'; 
  private static SHEET_URL = `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/export?format=csv`;

  /**
   * Fetches products. Priority: 
   * 1. Live Google Sheet (if configured)
   * 2. Local Storage (cached)
   * 3. Default Mock Data
   */
  static async getProducts(): Promise<Product[]> {
    // Attempt to fetch from Google Sheets if a real ID is provided
    if (!this.SHEET_ID.includes('YOUR-SHEET-ID')) {
      try {
        const response = await fetch(this.SHEET_URL);
        if (response.ok) {
          const csvText = await response.text();
          const products = this.parseCSV(csvText);
          if (products.length > 0) {
            this.saveProducts(products);
            return products;
          }
        }
      } catch (e) {
        console.warn("ProductService: Google Sheet fetch failed, falling back to cache.", e);
      }
    }

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

  /**
   * Simple CSV parser for Google Sheets output
   */
  private static parseCSV(csv: string): Product[] {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const entry: any = {};
      headers.forEach((header, i) => {
        const val = values[i];
        if (['price', 'stockcount', 'weightgrams'].includes(header)) {
          entry[header === 'stockcount' ? 'stockCount' : header === 'weightgrams' ? 'weightGrams' : header] = Number(val) || 0;
        } else {
          entry[header] = val;
        }
      });
      return entry as Product;
    }).filter(p => p.name && p.id);
  }

  static async syncWithGoogleSheet(): Promise<Product[]> {
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
