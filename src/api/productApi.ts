import { generateClient } from "@aws-amplify/api";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export const productApi = {
  async listProducts() {
    try {
      const { data, errors } = await client.models.Product.list();
      if (errors) throw new Error(errors[0].message);
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  async getProduct(id: string) {
    try {
      const { data, errors } = await client.models.Product.get({ id });
      if (errors) throw new Error(errors[0].message);
      return data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  },

  async listCategories() {
    try {
      const { data, errors } = await client.models.Category.list();
      if (errors) throw new Error(errors[0].message);
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }
};

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  inventory: number;
  categoryId?: string;
  imageUrl?: string;
}
