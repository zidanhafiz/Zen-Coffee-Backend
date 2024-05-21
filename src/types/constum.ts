export type Product = {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
};

export type productImg = {
  id?: string;
  url: string;
};

export type Variant = {
  id: string;
  name: string;
};
