export type CategoryPlace = 
  | 'Coffee Shop' 
  | 'Roastery' 
  | 'Rooftop Cafe' 
  | 'Working Space' 
  | 'Cozy Vintage' 
  | 'Outdoor Garden'
  | 'Kafe'
  | 'Kedai';

export type MenuCategory = 
  | 'Espresso Based' 
  | 'Signature Coffee' 
  | 'Manual Brew' 
  | 'Non-Coffee' 
  | 'Makanan Berat' 
  | 'Snacks & Bites' 
  | 'Pastry & Cake';

export interface Place {
  id: string;
  name: string;
  slug?: string;
  category: CategoryPlace | string;
  address: string;
  city: string;
  open_hours: string;
  price_range: string;
  facilities: string[];
  rating: number;
  review_count: number;
  image_url: string;
  phone?: string;
  instagram?: string;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  place_id: string;
  place_name?: string;
  name: string;
  category: MenuCategory | string;
  price: number;
  description: string;
  image_url: string;
  is_available: boolean;
  is_popular?: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  menu_id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'Menunggu' | 'Diproses' | 'Selesai' | 'Dibatalkan';
export type PaymentStatus = 'Belum Bayar' | 'Lunas';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  table_number: string;
  order_type: 'Dine In' | 'Take Away' | 'Reservasi';
  place_id: string;
  place_name?: string;
  items: OrderItem[];
  total_amount: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  notes?: string;
  created_at: string;
}

export interface Review {
  id: string;
  place_id: string;
  place_name?: string;
  customer_name: string;
  rating: number;
  comment: string;
  admin_reply?: string;
  is_approved: boolean;
  created_at: string;
}

export type UserRole = 'admin' | 'merchant' | 'cashier' | 'customer';
export type UserStatus = 'active' | 'inactive';

export interface Profile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string | null;
  role: UserRole | string;
  store_id?: string | null;
  store_name?: string | null;
  avatar_url?: string | null;
  status: UserStatus | string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}
