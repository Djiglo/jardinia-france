// ================================================
// JARDINIA FRANCE - Types TypeScript
// ================================================

export type UserRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";
export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";
export type CouponType = "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";

// ========================
// USER
// ========================
export interface User {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  image: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

// ========================
// PRODUCT
// ========================
export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price: number | null;
  stock: number;
  sku: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  sortOrder: number;
  children?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

export interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  images: string[];
  isVerified: boolean;
  status: ReviewStatus;
  createdAt: string;
  user: Pick<User, "id" | "name" | "image">;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string | null;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  taxRate: number;
  metaTitle: string | null;
  metaDescription: string | null;
  tags: string[];
  createdAt: string;
  category: Category;
  brand: Brand | null;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  reviews?: Review[];
  avgRating?: number;
  averageRating?: number | null;
  reviewCount?: number;
}

// ========================
// CART
// ========================
export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product: Product;
  variant: ProductVariant | null;
}

export interface CartState {
  items: CartItem[];
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  couponCode: string | null;
  isLoading: boolean;
}

// ========================
// ORDER
// ========================
export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  image: string | null;
  quantity: number;
  price: number;
  total: number;
  variant: string | null;
  product: Pick<Product, "id" | "slug">;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  total: number;
  trackingNumber: string | null;
  shippingMethod: string | null;
  shippingAddress: ShippingAddress | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// ========================
// FILTERS
// ========================
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  hasPromo?: boolean;
  minRating?: number;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular" | "rating";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ========================
// CHECKOUT
// ========================
export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  shippingMethod: "standard" | "express";
  paymentMethod: "card" | "paypal";
  couponCode?: string;
  notes?: string;
  saveAddress?: boolean;
}

// ========================
// ADMIN
// ========================
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  ordersToday: number;
  revenueToday: number;
  pendingOrders: number;
  lowStockProducts: number;
}
