export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}
