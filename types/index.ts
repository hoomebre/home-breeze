export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

export interface ProductImage {
  image_url: string;
  is_primary: boolean;
}

export interface ProductSpecification {
  spec_name: string;
  spec_value: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price: number | null;
  sku: string;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  rating: number;
  review_count: number;
  images: ProductImage[];
  specifications: ProductSpecification[];
}
