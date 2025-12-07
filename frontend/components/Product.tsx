// src/types/Product.ts

export interface Product {
  id: string; 
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  brand: string;
  image: string; // Ana görsel URL
  images?: string[]; // Galeri görselleri URL'leri
  features?: string[];
  
  // Mevcut kodunuzdaki buton kontrol objesi için tip tanımı
  buttons?: {
    addToCart: boolean;
    wishlist: boolean;
    compareColor: boolean;
    askQuestion: boolean;
    deliveryReturnInfo: boolean;
    share: boolean;
  };
}