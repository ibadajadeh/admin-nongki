import { supabase } from './supabase';
import { Place, MenuItem, Order, Review, Profile, OrderStatus } from './types';
import { INITIAL_PLACES, INITIAL_MENUS, INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_PROFILES } from './mock-data';

const STORAGE_KEYS = {
  PROFILES: 'nongki_profiles_data',
  PLACES: 'nongki_places_data',
  MENUS: 'nongki_menus_data',
  ORDERS: 'nongki_orders_data',
  REVIEWS: 'nongki_reviews_data',
};

// Helper for local storage fallback
function getLocal<T>(key: string, defaultData: T): T {
  if (typeof window === 'undefined') return defaultData;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultData;
  } catch (err) {
    console.error('LocalStorage read error:', err);
    return defaultData;
  }
}

function setLocal<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

// Check Supabase Health
export async function checkSupabaseConnection(): Promise<{ connected: boolean; tablesFound: boolean; message: string }> {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (!error) {
      return { connected: true, tablesFound: true, message: 'Terkoneksi ke Supabase Cloud (Tabel profiles & places aktif)' };
    }
    return { connected: true, tablesFound: false, message: error.message || 'Koneksi Supabase aktif' };
  } catch (err: any) {
    return { connected: false, tablesFound: false, message: err.message || 'Koneksi database offline' };
  }
}

// ================= PROFILES (USER / PENGGUNA) =================
export async function fetchProfiles(): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      setLocal(STORAGE_KEYS.PROFILES, data);
      return data as Profile[];
    }
  } catch (e) {
    console.warn('Supabase fetchProfiles fallback:', e);
  }
  return getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
}

export async function createProfile(profile: Omit<Profile, 'id' | 'created_at'>): Promise<Profile> {
  const newProfile: Profile = {
    ...profile,
    id: `usr_${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (!error && data) {
      const current = getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
      setLocal(STORAGE_KEYS.PROFILES, [data as Profile, ...current]);
      return data as Profile;
    }
  } catch (e) {
    console.warn('Supabase createProfile fallback:', e);
  }

  const current = getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  const updated = [newProfile, ...current];
  setLocal(STORAGE_KEYS.PROFILES, updated);
  return newProfile;
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      const current = getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
      const updated = current.map((p) => (p.id === id ? (data as Profile) : p));
      setLocal(STORAGE_KEYS.PROFILES, updated);
      return data as Profile;
    }
  } catch (e) {
    console.warn('Supabase updateProfile fallback:', e);
  }

  const current = getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  let updatedProf: Profile | null = null;
  const updated = current.map((p) => {
    if (p.id === id) {
      updatedProf = { ...p, ...updates };
      return updatedProf;
    }
    return p;
  });
  setLocal(STORAGE_KEYS.PROFILES, updated);
  return updatedProf;
}

export async function deleteProfile(id: string): Promise<boolean> {
  try {
    await supabase.from('profiles').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase deleteProfile fallback:', e);
  }
  const current = getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  const filtered = current.filter((p) => p.id !== id);
  setLocal(STORAGE_KEYS.PROFILES, filtered);
  return true;
}

// ================= PLACES (TEMPAT NONGKI) =================
export async function fetchPlaces(): Promise<Place[]> {
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .order('rating', { ascending: false })
      .limit(50);

    if (!error && data && data.length > 0) {
      const mappedPlaces: Place[] = data.map((d: any) => ({
        id: d.id,
        name: d.name,
        slug: d.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: d.category || 'Kafe',
        address: d.address || '',
        city: d.address?.includes('Sidoarjo') ? 'Sidoarjo' : 'Surabaya & Sekitarnya',
        open_hours: d.opening_hours || '09:00 - 22:00 WIB',
        price_range: d.price_min && d.price_max 
          ? `Rp ${d.price_min.toLocaleString('id-ID')} - Rp ${d.price_max.toLocaleString('id-ID')}`
          : 'Rp 15.000 - Rp 45.000',
        facilities: d.facilities || ['Wi-Fi', 'Stopkontak', 'Area AC', 'Parkir'],
        rating: Number(d.rating) || 4.5,
        review_count: d.review_count || 10,
        image_url: d.image_url || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        phone: '0812-9900-1122',
        instagram: '@' + (d.name || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
        is_active: d.is_open !== false,
        created_at: d.created_at || new Date().toISOString(),
      }));

      setLocal(STORAGE_KEYS.PLACES, mappedPlaces);
      return mappedPlaces;
    }
  } catch (e) {
    console.warn('Supabase fetchPlaces failed, using fallback:', e);
  }
  return getLocal<Place[]>(STORAGE_KEYS.PLACES, INITIAL_PLACES);
}

export async function createPlace(place: Omit<Place, 'id' | 'created_at' | 'review_count'>): Promise<Place> {
  const newPlace: Place = {
    ...place,
    id: `plc_${Date.now()}`,
    review_count: 0,
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from('places').insert([{
      id: newPlace.id,
      name: newPlace.name,
      category: newPlace.category,
      address: newPlace.address,
      image_url: newPlace.image_url,
      rating: newPlace.rating,
      opening_hours: newPlace.open_hours,
      is_open: newPlace.is_active,
      facilities: newPlace.facilities,
    }]);
  } catch (e) {
    console.warn('Supabase createPlace fallback:', e);
  }

  const current = getLocal<Place[]>(STORAGE_KEYS.PLACES, INITIAL_PLACES);
  const updated = [newPlace, ...current];
  setLocal(STORAGE_KEYS.PLACES, updated);
  return newPlace;
}

export async function updatePlace(id: string, updates: Partial<Place>): Promise<Place | null> {
  try {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.address !== undefined) payload.address = updates.address;
    if (updates.open_hours !== undefined) payload.opening_hours = updates.open_hours;
    if (updates.is_active !== undefined) payload.is_open = updates.is_active;
    if (updates.rating !== undefined) payload.rating = updates.rating;

    await supabase.from('places').update(payload).eq('id', id);
  } catch (e) {
    console.warn('Supabase updatePlace fallback:', e);
  }

  const current = getLocal<Place[]>(STORAGE_KEYS.PLACES, INITIAL_PLACES);
  let updatedPlace: Place | null = null;
  const updated = current.map((p) => {
    if (p.id === id) {
      updatedPlace = { ...p, ...updates };
      return updatedPlace;
    }
    return p;
  });
  setLocal(STORAGE_KEYS.PLACES, updated);
  return updatedPlace;
}

export async function deletePlace(id: string): Promise<boolean> {
  try {
    await supabase.from('places').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase deletePlace fallback:', e);
  }
  const current = getLocal<Place[]>(STORAGE_KEYS.PLACES, INITIAL_PLACES);
  const filtered = current.filter((p) => p.id !== id);
  setLocal(STORAGE_KEYS.PLACES, filtered);
  return true;
}

// ================= MENUS (MENU & PRODUK) =================
export async function fetchMenus(): Promise<MenuItem[]> {
  return getLocal<MenuItem[]>(STORAGE_KEYS.MENUS, INITIAL_MENUS);
}

export async function createMenu(item: Omit<MenuItem, 'id' | 'created_at'>): Promise<MenuItem> {
  const newItem: MenuItem = {
    ...item,
    id: `m-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const current = getLocal<MenuItem[]>(STORAGE_KEYS.MENUS, INITIAL_MENUS);
  const updated = [newItem, ...current];
  setLocal(STORAGE_KEYS.MENUS, updated);
  return newItem;
}

export async function updateMenu(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
  const current = getLocal<MenuItem[]>(STORAGE_KEYS.MENUS, INITIAL_MENUS);
  let updatedMenu: MenuItem | null = null;
  const updated = current.map((m) => {
    if (m.id === id) {
      updatedMenu = { ...m, ...updates };
      return updatedMenu;
    }
    return m;
  });
  setLocal(STORAGE_KEYS.MENUS, updated);
  return updatedMenu;
}

export async function deleteMenu(id: string): Promise<boolean> {
  const current = getLocal<MenuItem[]>(STORAGE_KEYS.MENUS, INITIAL_MENUS);
  const filtered = current.filter((m) => m.id !== id);
  setLocal(STORAGE_KEYS.MENUS, filtered);
  return true;
}

// ================= ORDERS (PESANAN) =================
export async function fetchOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mappedOrders: Order[] = data.map((o: any) => ({
        id: o.id,
        order_number: o.order_number,
        customer_name: o.user_id || 'Pelanggan Nongki',
        customer_phone: '0812-xxxx-xxxx',
        table_number: o.table_number || (o.dining_option === 'takeaway' ? 'Take Away' : 'Meja 01'),
        order_type: o.dining_option === 'takeaway' ? 'Take Away' : 'Dine In',
        place_id: o.place_id,
        place_name: o.place_name,
        items: o.items || [],
        total_amount: Number(o.total) || 0,
        order_status: o.status === 'completed' ? 'Selesai' : o.status === 'cancelled' ? 'Dibatalkan' : 'Diproses',
        payment_status: o.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar',
        payment_method: o.payment_method?.toUpperCase() || 'QRIS',
        notes: o.notes || '',
        created_at: o.created_at || new Date().toISOString(),
      }));
      setLocal(STORAGE_KEYS.ORDERS, mappedOrders);
      return mappedOrders;
    }
  } catch (e) {
    console.warn('Supabase fetchOrders failed:', e);
  }
  return getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
}

export async function createOrder(order: Omit<Order, 'id' | 'order_number' | 'created_at'>): Promise<Order> {
  const randNum = Math.floor(100 + Math.random() * 900);
  const newOrder: Order = {
    ...order,
    id: `ord-${Date.now()}`,
    order_number: `NKG-2026-${randNum}`,
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from('orders').insert([{
      id: newOrder.id,
      order_number: newOrder.order_number,
      user_id: 'usr_admin_001',
      place_id: newOrder.place_id || 'plc_featured',
      place_name: newOrder.place_name || 'Es Coklat Impian',
      items: newOrder.items,
      subtotal: newOrder.total_amount,
      total: newOrder.total_amount,
      payment_method: newOrder.payment_method.toLowerCase(),
      payment_status: newOrder.payment_status === 'Lunas' ? 'paid' : 'unpaid',
      status: 'processing',
      dining_option: newOrder.order_type === 'Take Away' ? 'takeaway' : 'dine_in',
      table_number: newOrder.table_number,
      notes: newOrder.notes,
    }]);
  } catch (e) {
    console.warn('Supabase createOrder fallback:', e);
  }

  const current = getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  const updated = [newOrder, ...current];
  setLocal(STORAGE_KEYS.ORDERS, updated);
  return newOrder;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  try {
    const supabaseStatus = status === 'Selesai' ? 'completed' : status === 'Dibatalkan' ? 'cancelled' : 'processing';
    await supabase.from('orders').update({ status: supabaseStatus }).eq('id', id);
  } catch (e) {
    console.warn('Supabase updateOrderStatus fallback:', e);
  }

  const current = getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  let updatedOrder: Order | null = null;
  const updated = current.map((o) => {
    if (o.id === id) {
      updatedOrder = { ...o, order_status: status };
      return updatedOrder;
    }
    return o;
  });
  setLocal(STORAGE_KEYS.ORDERS, updated);
  return updatedOrder;
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    await supabase.from('orders').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase deleteOrder fallback:', e);
  }
  const current = getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  const filtered = current.filter((o) => o.id !== id);
  setLocal(STORAGE_KEYS.ORDERS, filtered);
  return true;
}

// ================= REVIEWS (ULASAN) =================
export async function fetchReviews(): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const mappedReviews: Review[] = data.map((r: any) => ({
        id: r.id,
        place_id: r.place_id,
        customer_name: r.user_name || 'Pengguna Nongki',
        rating: r.rating || 5,
        comment: r.comment || '',
        is_approved: true,
        created_at: r.created_at || new Date().toISOString(),
      }));
      setLocal(STORAGE_KEYS.REVIEWS, mappedReviews);
      return mappedReviews;
    }
  } catch (e) {
    console.warn('Supabase fetchReviews failed:', e);
  }
  return getLocal<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
}

export async function updateReview(id: string, updates: Partial<Review>): Promise<Review | null> {
  const current = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  let updatedRev: Review | null = null;
  const updated = current.map((r) => {
    if (r.id === id) {
      updatedRev = { ...r, ...updates };
      return updatedRev;
    }
    return r;
  });
  setLocal(STORAGE_KEYS.REVIEWS, updated);
  return updatedRev;
}

export async function deleteReview(id: string): Promise<boolean> {
  try {
    await supabase.from('reviews').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase deleteReview fallback:', e);
  }
  const current = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  const filtered = current.filter((r) => r.id !== id);
  setLocal(STORAGE_KEYS.REVIEWS, filtered);
  return true;
}

// Reset Mock Data
export function resetMockData(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
  localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(INITIAL_PLACES));
  localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(INITIAL_MENUS));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
}
