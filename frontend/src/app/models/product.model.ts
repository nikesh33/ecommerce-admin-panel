export interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  images: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}