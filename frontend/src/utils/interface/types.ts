/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
    name: string;
    email: string;
    password: string;
    phoneNumber: string; 
    otpValue?:string
}

export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
}
export interface Category {
    _id: string;
    name: string;
    subcategories: string[];
}

export interface SubCategory {
    _id: string;
    name: string;
}
export interface Product {
    productId: any;
    quantity: number;
    originalPrice: number;
    currentPrice:number;
    _id: string; 
    name: string;
    price: number;
    description: string;
    stock: number;
    rating: number;
    images: { url: string; alt: string }[];
    category: Category; 
    subCategory: SubCategory;
    numOfReviews: number;
    reviews:Review[];
}

export interface ProductWithRating extends Product {
  rating: number;
  numOfReviews: number;
}