import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Package, ShoppingBag, Users, User, FileText, Plus, Edit, 
  ArrowLeft, LayoutDashboard, Quote, CreditCard, BarChart3,
  Calendar, TrendingUp, UserCheck, Bell, Search, LogOut, Menu, X,
  Shield, FileCheck, Receipt, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import {toast} from 'sonner';
// Import admin components
import { AdminDessertsManager } from './components/admin/AdminDessertsManager';
import { AdminHeroManager } from './components/admin/AdminHeroManager';
import { AdminAboutManager } from './components/admin/AdminAboutManager';
import { AdminServingIdeasManager } from './components/admin/AdminServingIdeasManager';
import { AdminOrdersManager } from './components/admin/AdminOrdersManager';
import { AdminSiteSettings } from './components/admin/AdminSiteSettings';
import { AdminTestimonialsManager } from './components/admin/AdminTestimonialsManager';
import { AdminPaymentSettings } from './components/admin/AdminPaymentSettings';
import { AdminPrivacyPolicyManager } from './components/admin/AdminPrivacyPolicy';
import { AdminTermsOfServiceManager } from './components/admin/AdminTermsOfServiceManager';
import { AdminRefundPolicyManager } from './components/admin/AdminRefundPolicyManager';
import { AdminFoodSafetyManager } from './components/admin/AdminFoodSafetyManager';

// Import UI components
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { useContent } from './components/ContentContext';
import { AdminInquiries } from './components/admin/AdminInquiry';

// Import API hooks
import { useGetDashboardCountsQuery, useGetContentStatsQuery } from './store/orderApi';

type AdminSectionType = 'dashboard' | 'desserts' | 'hero' | 'about' | 'serving-ideas' | 'testimonials' | 'orders' | 'settings' | 'payments' | 'inquiries' | 'privacy-policy' | 'terms-of-service' | 'refund-policy' | 'food-safety';

interface AdminDashboardProps {
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { content, isLoading } = useContent();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  // API calls for dashboard data
  const { data: dashboardCounts, isLoading: dashboardLoading } = useGetDashboardCountsQuery();
  const { data: contentStats, isLoading: contentStatsLoading } = useGetContentStatsQuery();

  // Extract section from URL path
  const getCurrentSectionFromPath = (): AdminSectionType => {
    const path = location.pathname;
    if (path.includes('/admin/desserts')) return 'desserts';
    if (path.includes('/admin/hero')) return 'hero';
    if (path.includes('/admin/about')) return 'about';
    if (path.includes('/admin/serving-ideas')) return 'serving-ideas';
    if (path.includes('/admin/testimonials')) return 'testimonials';
    if (path.includes('/admin/orders')) return 'orders';
    if (path.includes('/admin/settings')) return 'settings';
    if (path.includes('/admin/payments')) return 'payments';
    if (path.includes('/admin/inquiries')) return 'inquiries';
    if (path.includes('/admin/privacy-policy')) return 'privacy-policy';
    if (path.includes('/admin/terms-of-service')) return 'terms-of-service';
    if (path.includes('/admin/refund-policy')) return 'refund-policy';
    if (path.includes('/admin/food-safety')) return 'food-safety';
    return 'dashboard';
  };

  const [currentSection, setCurrentSection] = useState<AdminSectionType>(getCurrentSectionFromPath());
  const [dashboardData, setDashboardData] = useState({
    totalDesserts: 0,
    activeOrders: 0,
    totalTestimonials: 0,
    configuredGateways: 1, // Static value as requested
    pendingOrders: 0,
    completedOrders: 0,
    activeDesserts: 0,
    featuredDesserts: 0,
    servingIdeas: 0
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order received', time: '2 minutes ago', read: false },
    { id: 2, message: 'Payment gateway updated', time: '1 hour ago', read: false },
    { id: 3, message: 'New testimonial submitted', time: '3 hours ago', read: true }
  ]);

  // Refs for click outside detection
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLDivElement>(null);

  // Update current section when URL changes
  useEffect(() => {
    setCurrentSection(getCurrentSectionFromPath());
  }, [location.pathname]);
  
  // Handle click outside for mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Handle click outside for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Update dashboard data when API responses are received
  useEffect(() => {
    if (dashboardCounts?.data) {
      setDashboardData(prev => ({
        ...prev,
        totalDesserts: dashboardCounts.data.totalDesserts || 0,
        activeOrders: dashboardCounts.data.activeOrders || 0,
        totalTestimonials: dashboardCounts.data.testimonials || 0
      }));
    }
  }, [dashboardCounts]);

  useEffect(() => {
    if (contentStats?.data) {
      setDashboardData(prev => ({
        ...prev,
        activeDesserts: contentStats.data.activeDesserts || 0,
        featuredDesserts: contentStats.data.featuredDesserts || 0,
        servingIdeas: contentStats.data.servingIdeas || 0
      }));
    }
  }, [contentStats]);

  const handleSectionChange = (section: AdminSectionType) => {
    setCurrentSection(section);
    navigate(`/admin/${section === 'dashboard' ? '' : section}`);
  };

  const getSectionTitle = () => {
    const titles = {
      'desserts': 'Desserts Management',
      'hero': 'Hero Section',
      'about': 'About Section',
      'serving-ideas': 'Serving Ideas',
      'testimonials': 'Testimonials Management',
      'orders': 'Orders Management',
      'settings': 'Site Settings',
      'payments': 'Payment Settings',
      'dashboard': 'Dashboard Overview',
      'inquiries': 'Customer Inquiries',
      'privacy-policy': 'Privacy Policy',
      'terms-of-service': 'Terms of Service',
      'refund-policy': 'Refund Policy',
      'food-safety': 'Food Safety'
    };
    return titles[currentSection] || 'Admin Dashboard';
  };

  const getSectionDescription = () => {
    const descriptions = {
      'desserts': 'Manage your dessert catalog with pricing, images, and descriptions',
      'hero': 'Customize your homepage hero section with images and CTAs',
      'about': 'Edit Chef Bano\'s story, certifications, and about page content',
      'serving-ideas': 'Manage occasion-based serving suggestions and celebration ideas',
      'testimonials': 'Manage customer testimonials and reviews',
      'orders': 'View and manage customer orders, update statuses, and track deliveries',
      'settings': 'Configure business settings, contact info, and social media links',
      'payments': 'Configure payment gateways for online transactions',
      'dashboard': '',
      'inquiries': 'Manage customer inquiries ',
      'privacy-policy': 'Manage and update your website\'s privacy policy content',
      'terms-of-service': 'Manage and update your website\'s terms of service content',
      'refund-policy': 'Manage and update your website\'s refund policy content ',
      'food-safety': 'Manage and update your food safety guidelines content'
    };
    return descriptions[currentSection] || ' ';
  };

  const renderAdminContent = () => {
    switch (currentSection) {
      case 'desserts':
        return <AdminDessertsManager />;
      case 'hero':
        return <AdminHeroManager />;
      case 'about':
        return <AdminAboutManager />;
      case 'serving-ideas':
        return <AdminServingIdeasManager />;
      case 'testimonials':
        return <AdminTestimonialsManager />;
      case 'orders':
        return <AdminOrdersManager />;
      case 'settings':
        return <AdminSiteSettings />;
      case 'payments':
        return <AdminPaymentSettings />;
      case 'inquiries':
        return <AdminInquiries/>
      case 'privacy-policy':
        return <AdminPrivacyPolicyManager />;
      case 'terms-of-service':
        return <AdminTermsOfServiceManager />;
      case 'refund-policy':
        return <AdminRefundPolicyManager />;
      case 'food-safety':
        return <AdminFoodSafetyManager />;  
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between" onClick={() => handleSectionChange('desserts')}>
                    <div>
                      <p className="text-2xl font-medium text-blue-600 mb-1">Total Desserts</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {dashboardLoading ? '...' : dashboardData.totalDesserts}
                      </p>
                  
                    </div>
                    <div className="text-blue-600 bg-blue-100 p-3 rounded-full">
                      <Package className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between" onClick={() => handleSectionChange('orders')}>
                    <div>
                      <p className="text-2xl font-medium text-green-600 mb-1">Active Orders</p>
                      <p className="text-2xl font-bold text-green-800">
                        {dashboardLoading ? '...' : dashboardData.activeOrders}
                      </p>
                   
                    </div>
                    <div className="text-green-600 bg-green-100 p-3 rounded-full">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between" onClick={() => handleSectionChange('testimonials')}>
                    <div>
                      <p className="text-2xl font-medium text-pink-600 mb-1">Testimonials</p>
                      <p className="text-2xl font-bold text-pink-600">
                        {dashboardLoading ? '...' : dashboardData.totalTestimonials}
                      </p>
                    
                    </div>
                    <div className="text-pink-600 p-3 rounded-full bg-pink-100">
                      <Quote className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between" onClick={() => handleSectionChange('payments')}>
                    <div>
                      <p className="text-2xl font-medium text-purple-600 mb-1">Payment Gateways</p>
                      <p className="text-2xl font-bold text-purple-800">
                        {dashboardData.configuredGateways}
                      </p>
                    
                    </div>
                    <div className="text-purple-600 bg-purple-100 p-3 rounded-full">
                      <CreditCard className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 border-dashed"
                    onClick={() => handleSectionChange('desserts')}
                  >
                    <Plus className="h-5 w-5" />
                    <span className="text-lg">Add Dessert</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 border-dashed"
                    onClick={() => handleSectionChange('testimonials')}
                  >
                    <Quote className="h-5 w-5" />
                    <span className="text-lg">Add Testimonial</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 border-dashed"
                    onClick={() => handleSectionChange('payments')}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="text-lg">Setup Payments</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 border-dashed"
                    onClick={() => handleSectionChange('orders')}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span className="text-lg">View Orders</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Charts and Activity */}
            <div className="grid grid-cols-4 lg:grid-cols-4 gap-6 center">
              <div></div>
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl">Website Status</span>
                      <span className="font-medium text-green-600">Online</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl">Orders Processing</span>
                      <span className="font-medium text-green-600">
                        {dashboardLoading ? '...' : dashboardData.activeOrders}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl">Payment Gateway</span>
                      <span className="font-medium text-purple-600">
                        {dashboardData.configuredGateways}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl">Content Status</span>
                      <span className="font-medium text-pink-600">
                        Updated
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Overview</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl">Active Desserts</span>
                      <span className="font-medium text-blue-600">
                        {contentStatsLoading ? '...' : dashboardData.activeDesserts}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl">Featured Items</span>
                      <span className="font-medium text-green-600">
                        {contentStatsLoading ? '...' : dashboardData.featuredDesserts}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl">Serving Ideas</span>
                      <span className="font-medium text-purple-600">
                        {contentStatsLoading ? '...' : dashboardData.servingIdeas}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl">Testimonials</span>
                      <span className="font-medium text-pink-600">
                        {dashboardLoading ? '...' : dashboardData.totalTestimonials}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Management Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5" />
                    Desserts Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg mb-4">
                    Add, edit, and manage your dessert catalog with pricing, images, and descriptions
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('desserts')}>
                    <Package className="h-5 w-5" />  Manage Desserts
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingBag className="h-5 w-5" />
                    Orders Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg mb-4">
                    View and manage customer orders, update statuses, and track deliveries.
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('orders')}>
                    <ShoppingBag className="h-5 w-5" />
                    View Orders
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Quote className="h-5 w-5" />
                    Testimonials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg mb-4">
                    Manage customer testimonials and reviews to build trust and credibility.
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('testimonials')}>
                    <Quote className="h-5 w-5" />
                    Manage Testimonials
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5" />
                    Payments Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg mb-4">
                    Configure payment gateways for online transactions.
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('payments')}>
                    <CreditCard className="h-5 w-5" />
                    Setup Payments
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Edit className="h-5 w-5" />
                    Hero Section
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg mb-4">
                    Customize your homepage hero section with images, titles, and CTAs.
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('hero')}>
                    <Edit className="h-5 w-5" />
                    Edit Hero
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5" />
                    Site Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg mb-4">
                    Configure business settings, contact info, and social media links.
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('settings')}>
                    <Settings className="h-5 w-5" />
                    Site Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5" />
                    About Section
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg mb-4">
                    Edit Chef Bano's story, certifications, and about page content and detail.
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('about')}>
                    <Users className="h-5 w-5" />
                    Edit About
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Serving Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg mb-4">
                    Manage occasion-based serving suggestions and celebration ideas.
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('serving-ideas')}>
                    <FileText className="h-5 w-5" />
                    Manage Ideas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  // Menu items with unique icons
  interface MenuItem {
    id: string;
    label: string;
    icon: React.ForwardRefExoticComponent<any>;
    badge?: number;
  }
  
  const menuItems: MenuItem[] = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'orders', label: 'Orders Management', icon: ShoppingBag },
      { id: 'desserts', label: 'Desserts Management', icon: Package },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'hero', label: 'Hero Section', icon: Edit },
    { id: 'about', label: 'About Section', icon: Users },
    { id: 'serving-ideas', label: 'Serving Ideas', icon: FileText },
    { id: 'payments', label: 'Payments Settings', icon: CreditCard },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'inquiries', label: 'Inquiries', icon: Bell },
    { id: 'privacy-policy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms-of-service', label: 'Terms of Service', icon: FileCheck },
    { id: 'refund-policy', label: 'Refund Policy', icon: Receipt },
    { id: 'food-safety', label: 'Food Safety Guidelines', icon: Heart },
  ];

  if (isLoading || !content) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div ref={sidebarRef} className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-xl font-bold text-gray-500">Admin Panel</p>
              </div>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleSectionChange(item.id as AdminSectionType);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${currentSection === item.id ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <Badge variant={currentSection === item.id ? "secondary" : "default"} className="ml-2">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                toast.success('Logged out successfully!');
                navigate("/login");
              }}
              className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="sticky top-0 z-20 lg:relative bg-white shadow-sm lg:shadow-none border-b lg:border-none">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                ref={mobileMenuButtonRef}
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-2"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="space-y-1">
                <h1 className="text-xl font-bold">{getSectionTitle()}</h1>
                <p className="text-sm text-gray-500">{getSectionDescription()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <div className="relative">
                  {/* Profile icon */}
                  <div
                    ref={profileButtonRef}
                    onClick={() => setOpen(!open)}
                    className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer"
                  >
                    <User size={18} />
                  </div>

                  {/* Dropdown */}
                  {open && (
                    <div 
                      ref={profileDropdownRef}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border p-3 text-sm z-50"
                    >
                      <p className="font-medium">Admin</p>
                      <p className="text-gray-500">admin@gmail.com</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderAdminContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;