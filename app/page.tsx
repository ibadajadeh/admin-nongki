'use client';

import React, { useState, useEffect } from 'react';
import Sidebar, { NavTab } from '@/components/Sidebar';
import Header from '@/components/Header';
import DashboardView from '@/components/DashboardView';
import ProfilesView from '@/components/ProfilesView';
import PlacesView from '@/components/PlacesView';
import MenuView from '@/components/MenuView';
import OrdersView from '@/components/OrdersView';
import ReviewsView from '@/components/ReviewsView';
import LoginCard from '@/components/LoginCard';
import DatabaseSyncModal from '@/components/DatabaseSyncModal';
import { 
  fetchProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  fetchPlaces, 
  createPlace, 
  updatePlace, 
  deletePlace,
  fetchMenus, 
  createMenu, 
  updateMenu, 
  deleteMenu,
  fetchOrders, 
  createOrder, 
  updateOrderStatus, 
  deleteOrder,
  fetchReviews, 
  updateReview, 
  deleteReview,
  checkSupabaseConnection
} from '@/lib/db';
import { getCurrentAdmin, logoutAdmin, DEFAULT_ADMIN } from '@/lib/auth';
import { Place, MenuItem, Order, Review, Profile, AdminUser, OrderStatus } from '@/lib/types';
import { Coffee } from 'lucide-react';

export default function Home() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);

  // Core Data States
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Selected Order for detail view modal
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  // Check initial authentication and load data
  useEffect(() => {
    const user = getCurrentAdmin();
    setAdminUser(user);
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [profilesData, placesData, menusData, ordersData, reviewsData] = await Promise.all([
        fetchProfiles(),
        fetchPlaces(),
        fetchMenus(),
        fetchOrders(),
        fetchReviews(),
      ]);

      setProfiles(profilesData);
      setPlaces(placesData);
      setMenus(menusData);
      setOrders(ordersData);
      setReviews(reviewsData);

      const health = await checkSupabaseConnection();
      setDbConnected(health.connected);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setAdminUser(null);
  };

  // Profile CRUD handlers
  const handleAddProfile = async (profile: Omit<Profile, 'id' | 'created_at'>) => {
    const created = await createProfile(profile);
    setProfiles([created, ...profiles]);
  };

  const handleUpdateProfile = async (id: string, updates: Partial<Profile>) => {
    const updated = await updateProfile(id, updates);
    if (updated) {
      setProfiles(profiles.map((p) => (p.id === id ? updated : p)));
    }
  };

  const handleDeleteProfile = async (id: string) => {
    await deleteProfile(id);
    setProfiles(profiles.filter((p) => p.id !== id));
  };

  // Place CRUD handlers
  const handleAddPlace = async (place: Omit<Place, 'id' | 'created_at' | 'review_count'>) => {
    const created = await createPlace(place);
    setPlaces([created, ...places]);
  };

  const handleUpdatePlace = async (id: string, updates: Partial<Place>) => {
    const updated = await updatePlace(id, updates);
    if (updated) {
      setPlaces(places.map((p) => (p.id === id ? updated : p)));
    }
  };

  const handleDeletePlace = async (id: string) => {
    await deletePlace(id);
    setPlaces(places.filter((p) => p.id !== id));
  };

  // Menu CRUD handlers
  const handleAddMenu = async (item: Omit<MenuItem, 'id' | 'created_at'>) => {
    const created = await createMenu(item);
    setMenus([created, ...menus]);
  };

  const handleUpdateMenu = async (id: string, updates: Partial<MenuItem>) => {
    const updated = await updateMenu(id, updates);
    if (updated) {
      setMenus(menus.map((m) => (m.id === id ? updated : m)));
    }
  };

  const handleDeleteMenu = async (id: string) => {
    await deleteMenu(id);
    setMenus(menus.filter((m) => m.id !== id));
  };

  // Order CRUD handlers
  const handleAddOrder = async (order: Omit<Order, 'id' | 'order_number' | 'created_at'>) => {
    const created = await createOrder(order);
    setOrders([created, ...orders]);
  };

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    const updated = await updateOrderStatus(id, status);
    if (updated) {
      setOrders(orders.map((o) => (o.id === id ? updated : o)));
      if (selectedOrderForDetail?.id === id) {
        setSelectedOrderForDetail(updated);
      }
    }
  };

  const handleDeleteOrder = async (id: string) => {
    await deleteOrder(id);
    setOrders(orders.filter((o) => o.id !== id));
    if (selectedOrderForDetail?.id === id) {
      setSelectedOrderForDetail(null);
    }
  };

  // Review CRUD handlers
  const handleUpdateReview = async (id: string, updates: Partial<Review>) => {
    const updated = await updateReview(id, updates);
    if (updated) {
      setReviews(reviews.map((r) => (r.id === id ? updated : r)));
    }
  };

  const handleDeleteReview = async (id: string) => {
    await deleteReview(id);
    setReviews(reviews.filter((r) => r.id !== id));
  };

  // If not logged in, render Login Card (Image 2 aesthetic)
  if (!adminUser) {
    return <LoginCard onLoginSuccess={(user) => setAdminUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-row font-sans text-coffee-950 selection:bg-caramel-200">
      {/* Sidebar (Coffee tone with Cream/Caramel/Brownies accents) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'database') {
            setIsSyncModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        adminUser={adminUser}
        onLogout={handleLogout}
        ordersCount={orders.filter((o) => o.order_status === 'Diproses').length}
        profilesCount={profiles.length}
        openSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <Header
          adminUser={adminUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAddUser={() => setActiveTab('profiles')}
          onOpenAddPlace={() => setActiveTab('places')}
          onOpenAddMenu={() => setActiveTab('menus')}
          onOpenAddOrder={() => setActiveTab('orders')}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          dbConnected={dbConnected}
        />

        {/* View Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center text-brownies-500">
              <div className="w-12 h-12 rounded-2xl bg-caramel-100 text-caramel-600 flex items-center justify-center animate-bounce mb-3">
                <Coffee className="w-6 h-6" />
              </div>
              <p className="font-serif font-bold text-coffee-900">Memuat Data Nongki...</p>
              <p className="text-xs text-brownies-400 mt-1">Menghubungkan ke Supabase Cloud</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  places={places}
                  menus={menus}
                  orders={orders}
                  reviews={reviews}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onSelectOrder={(order) => {
                    setSelectedOrderForDetail(order);
                    setActiveTab('orders');
                  }}
                />
              )}

              {activeTab === 'profiles' && (
                <ProfilesView
                  profiles={profiles}
                  places={places}
                  onAddProfile={handleAddProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onDeleteProfile={handleDeleteProfile}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'places' && (
                <PlacesView
                  places={places}
                  onAddPlace={handleAddPlace}
                  onUpdatePlace={handleUpdatePlace}
                  onDeletePlace={handleDeletePlace}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'menus' && (
                <MenuView
                  menus={menus}
                  places={places}
                  onAddMenu={handleAddMenu}
                  onUpdateMenu={handleUpdateMenu}
                  onDeleteMenu={handleDeleteMenu}
                  searchQuery={searchQuery}
                />
              )}

              {activeTab === 'orders' && (
                <OrdersView
                  orders={orders}
                  places={places}
                  menus={menus}
                  onAddOrder={handleAddOrder}
                  onUpdateStatus={handleUpdateOrderStatus}
                  onDeleteOrder={handleDeleteOrder}
                  searchQuery={searchQuery}
                  selectedOrderForDetail={selectedOrderForDetail}
                  setSelectedOrderForDetail={setSelectedOrderForDetail}
                />
              )}

              {activeTab === 'reviews' && (
                <ReviewsView
                  reviews={reviews}
                  places={places}
                  onUpdateReview={handleUpdateReview}
                  onDeleteReview={handleDeleteReview}
                  searchQuery={searchQuery}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Supabase Database Sync & SQL Schema Modal */}
      <DatabaseSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onDataReset={loadAllData}
      />
    </div>
  );
}
