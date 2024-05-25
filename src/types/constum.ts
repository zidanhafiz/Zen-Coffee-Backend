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
  productId?: string;
};

export type Variant = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role?: 'ADMIN' | 'USER';
};

export type UserUpdate = {
  fullName?: string;
  email?: string;
};

export type Bank = {
  bank: string;
  name: string;
  account: string;
  userId: string;
};
