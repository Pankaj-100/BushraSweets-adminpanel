import React, { useState, useEffect } from 'react';
import { 
  Settings, Package, ShoppingBag, Users, FileText, Plus, Edit, 
  ArrowLeft, LayoutDashboard, Quote, CreditCard, BarChart3,
  Calendar, TrendingUp, UserCheck, Bell, Search, LogOut, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';

// Import admin components
import { AdminDessertsManager } from './components/admin/AdminDessertsManager';
import { AdminHeroManager } from './components/admin/AdminHeroManager';
import { AdminAboutManager } from './components/admin/AdminAboutManager';
import { AdminServingIdeasManager } from './components/admin/AdminServingIdeasManager';
import { AdminOrdersManager } from './components/admin/AdminOrdersManager';
import { AdminSiteSettings } from './components/admin/AdminSiteSettings';
import { AdminTestimonialsManager } from './components/admin/AdminTestimonialsManager';
import { AdminPaymentSettings } from './components/admin/AdminPaymentSettings';

// Import UI components
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { useContent } from './components/ContentContext';

type AdminSectionType = 'dashboard' | 'desserts' | 'hero' | 'about' | 'serving-ideas' | 'testimonials' | 'orders' | 'settings' | 'payments';

interface AdminDashboardProps {
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { content, isLoading } = useContent();
  const navigate = useNavigate();
  const location = useLocation();
  
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
    return 'dashboard';
  };

  const [currentSection, setCurrentSection] = useState<AdminSectionType>(getCurrentSectionFromPath());
  const [dashboardData, setDashboardData] = useState({
    totalDesserts: 0,
    activeOrders: 0,
    totalTestimonials: 0,
    configuredGateways: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order received', time: '2 minutes ago', read: false },
    { id: 2, message: 'Payment gateway updated', time: '1 hour ago', read: false },
    { id: 3, message: 'New testimonial submitted', time: '3 hours ago', read: true }
  ]);

  // Update current section when URL changes
  useEffect(() => {
    setCurrentSection(getCurrentSectionFromPath());
  }, [location.pathname]);

  useEffect(() => {
    if (isLoading || !content) return;

    const updateDashboardData = () => {
      const orders = JSON.parse(localStorage.getItem('customer-orders') || '[]');
      const activeOrders = orders.filter((order: any) => 
        ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
      ).length;
      
      const pendingOrders = orders.filter((order: any) => 
        order.status === 'pending'
      ).length;
      
      const completedOrders = orders.filter((order: any) => 
        order.status === 'completed'
      ).length;

      const gateways = JSON.parse(localStorage.getItem('payment-gateways') || '[]');
      const configuredGateways = gateways.filter((gateway: any) => gateway.enabled).length;

      setDashboardData({
        totalDesserts: content.desserts?.length || 0,
        activeOrders,
        totalTestimonials: content.testimonials?.length || 0,
        configuredGateways,
        pendingOrders,
        completedOrders
      });
    };

    updateDashboardData();
    
    const interval = setInterval(updateDashboardData, 30000);
    return () => clearInterval(interval);
  }, [content, isLoading]);

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
      'dashboard': 'Dashboard Overview'
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
      'dashboard': ''
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
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-4  lg:grid-cols-4 gap-6 ">
           
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 mb-1">Total Desserts</p>
                      <p className="text-2xl font-bold text-blue-800">{dashboardData.totalDesserts}</p>
                      <p className="text-xs text-blue-500 mt-1">
                      </p>
                    </div>
                    <div className="bg-blue-600 text-white p-3 rounded-xl">
                      <Package className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 mb-1">Active Orders</p>
                      <p className="text-2xl font-bold text-green-800">{dashboardData.activeOrders}</p>
                      <p className="text-xs text-green-500 mt-1">
                      </p>
                    </div>
                    <div className="bg-green-600 text-white p-3 rounded-xl">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-pink-600 mb-1">Testimonials</p>
                      <p className="text-2xl font-bold text-pink-800">{dashboardData.totalTestimonials}</p>
                      <p className="text-xs text-pink-500 mt-1">
                      </p>
                    </div>
                    <div className="bg-pink-600 text-white p-3 rounded-xl">
                      <Quote className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 mb-1">Payment Gateways</p>
                      <p className="text-2xl font-bold text-purple-800">{dashboardData.configuredGateways}</p>
                      <p className="text-xs text-purple-500 mt-1">
                      </p>
                    </div>
                    <div className="bg-purple-600 text-white p-3 rounded-xl">
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
                    <span className="text-xs">Add Dessert</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 border-dashed"
                    onClick={() => handleSectionChange('testimonials')}
                  >
                    <Quote className="h-5 w-5" />
                    <span className="text-xs">Add Testimonial</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 border-dashed"
                    onClick={() => handleSectionChange('payments')}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">Setup Payments</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 border-dashed"
                    onClick={() => handleSectionChange('orders')}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span className="text-xs">View Orders</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* Charts and Activity */}
            <div className="grid grid-cols-4 lg:grid-cols-4 gap-6 center">
              <div></div>
           <Card>
                <CardHeader>
                  <CardTitle>System status</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Website Status</span>
                      <span className="font-medium text-green-600">Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Orders Processing</span>
                      <span className="font-medium text-green-600">0
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Payment gateway</span>
                      <span className="font-medium text-purple-600">
                      0
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Content status</span>
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
                      <span className="text-sm">Active Desserts</span>
                      <span className="font-medium text-blue-600">
                        3
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Featured Items</span>
                      <span className="font-medium text-green-600">
                       2
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Serving Ideas</span>
                      <span className="font-medium text-purple-600">
                  5
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Customer Reviews</span>
                      <span className="font-medium text-pink-600">
                       20
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
                    Desserts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    Manage your dessert catalog with pricing, images, and descriptions.
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('desserts')}>
                    Manage Desserts
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingBag className="h-5 w-5" />
                    Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    View and manage customer orders, update statuses, and track deliveries.
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('orders')}>
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
                  <p className="text-muted-foreground text-sm mb-4">
                    Manage customer testimonials and reviews to build trust and credibility.
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('testimonials')}>
                    Manage Testimonials
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5" />
                    Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    Configure payment gateways like PayPal and Stripe for online transactions.
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('payments')}>
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
                  <p className="text-muted-foreground text-sm mb-4">
                    Customize your homepage hero section with images, titles, and CTAs.
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('hero')}>
                    Edit Hero
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    Configure business settings, contact info, and social media links.
                  </p>
                  <Button className="w-full" onClick={() => handleSectionChange('settings')}>
                    Site Settings
                  </Button>
                </CardContent>
              </Card>
                  <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5" />
                    About Section
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
Edit Chef Bano's story, certifications, and about page content and detail.                </p>
                  <Button className="w-full" onClick={() => handleSectionChange('about')}>
                    Edit Hero
                  </Button>
                </CardContent>
              </Card>

                 <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5" />
                   Serving ideas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
Manage occasion-based serving suggestions and celebration ideas.              </p>
                  <Button className="w-full" onClick={() => handleSectionChange('serving-ideas')}>
                    Manage Ideas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: dashboardData.activeOrders },
    { id: 'desserts', label: 'Desserts', icon: Package },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'hero', label: 'Hero Section', icon: Edit },
    { id: 'about', label: 'About Section', icon: Users },
    { id: 'serving-ideas', label: 'Serving Ideas', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
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
    <div className="min-h-screen bg-gray-50 flex ">
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="bg-primary rounded-lg p-2">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
               
                <p className="text-lg text-gray-500">Admin Panel</p>
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
        <div className="sticky top-0 z-40 lg:relative bg-white shadow-sm lg:shadow-none border-b lg:border-none">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-2"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">{getSectionTitle()}</h1>
                <p className="text-sm text-gray-500">{getSectionDescription()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
          
              
       
              
              <div className="hidden md:flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                  P
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium">Admin User</p>
              
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