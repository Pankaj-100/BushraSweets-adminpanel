import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DessertItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
  prepTime?: string;
  serves?: string;
  category?: 'traditional' | 'seasonal' | 'frozen' | 'custom';
  isPopular?: boolean;
  rating?: number;
  reviewCount?: number;
  allergens?: string[];
  ingredients?: string[];
  isActive?: boolean;
}

// Keep the old interface for backward compatibility
export interface Dessert extends DessertItem {}

export interface ServingIdea {
  id: string;
  title: string;
  description: string;
  image: string;
  occasion: string;
}

export interface Testimonial {
  id: string;
  name: string;
  review: string;
  rating: number;
  occasion?: string;
  image?: string;
}

interface ContentType {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    backgroundImage: string;
  };
  about: {
    title: string;
    description: string;
    chefName: string;
    chefImage: string;
    experience: string;
    certification: string;
    specialties: string[];
  };
  siteSettings: {
    businessName: string;
    phone: string;
    email: string;
    address: string;
    deliveryInfo: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      whatsapp: string;
    };
  };
  desserts: DessertItem[];
  servingIdeas: ServingIdea[];
  testimonials: Testimonial[];
}

interface ContentContextType {
  content: ContentType | null;
  updateContent: (section: keyof ContentType, data: any) => void;
  updateDesserts: (desserts: DessertItem[]) => void;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const defaultContent: ContentType = {
  hero: {
    title: "Authentic South Asian Desserts",
    subtitle: "Experience the rich flavors of traditional sweets crafted with love and passed down through generations",
    ctaText: "Explore Our Desserts",
    backgroundImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&h=800&fit=crop"
  },
  about: {
    title: "Meet Chef Bano",
    description: "With over 15 years of experience in traditional South Asian cuisine, Chef Bano brings authentic flavors and time-honored techniques to every dessert. Trained in classical cooking methods and certified in food safety, she ensures each sweet treat meets the highest standards of quality and taste.",
    chefName: "Chef Bano Ahmad",
    chefImage: "https://images.unsplash.com/photo-1559847844-5315695abf42?w=400&h=400&fit=crop",
    experience: "15+ Years",
    certification: "Certified Food Handler",
    specialties: ["Traditional Kheer", "Sheer Khorma", "Kulfi", "Gulab Jamun", "Ras Malai"]
  },
  siteSettings: {
    businessName: "Bano's Sweet Delights",
    phone: "(555) 123-4567",
    email: "hello@banossweets.com",
    address: "123 Sweet Lane, Flavor Town, ST 12345",
    deliveryInfo: "Free delivery on orders over $50",
    socialMedia: {
      facebook: "https://facebook.com/banossweets",
      instagram: "https://instagram.com/banossweets",
      whatsapp: "https://wa.me/15551234567"
    }
  },
  desserts: [
    {
      id: "1",
      name: "Traditional Kheer",
      description: "Creamy rice pudding slowly cooked with milk, cardamom, and garnished with almonds and pistachios",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop",
      featured: true
    },
    {
      id: "2", 
      name: "Sheer Khorma",
      description: "Rich vermicelli pudding with dates, milk, and mixed nuts - perfect for special occasions",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=400&fit=crop",
      featured: true
    },
    {
      id: "3",
      name: "Kulfi",
      description: "Dense, creamy frozen dessert flavored with cardamom, rose water, and crushed pistachios",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&h=400&fit=crop",
      featured: true
    }
  ],
  servingIdeas: [
    {
      id: "1",
      title: "Wedding Celebrations",
      description: "Make your special day even sweeter with our traditional dessert platters",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=400&fit=crop",
      occasion: "Wedding"
    },
    {
      id: "2",
      title: "Eid Festivities", 
      description: "Celebrate with authentic sweets that bring families together",
      image: "https://images.unsplash.com/photo-1574483924811-a5a4c7ac6db0?w=500&h=400&fit=crop",
      occasion: "Religious"
    },
    {
      id: "3",
      title: "Family Gatherings",
      description: "Create lasting memories with desserts that everyone will love",
      image: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=500&h=400&fit=crop",
      occasion: "Family"
    },
    {
      id: "4",
      title: "Corporate Events",
      description: "Impress clients and colleagues with unique, authentic desserts",
      image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=500&h=400&fit=crop",
      occasion: "Corporate"
    }
  ],
  testimonials: [
    {
      id: "1",
      name: "Sarah Ahmed",
      review: "The kheer was absolutely divine! It reminded me of my grandmother's recipe. Chef Bano truly captures the authentic flavors.",
      rating: 5,
      occasion: "Family dinner",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b692?w=80&h=80&fit=crop"
    },
    {
      id: "2", 
      name: "Mohammad Khan",
      review: "Ordered desserts for our Eid celebration. Everything was fresh, beautifully presented, and tasted incredible. Highly recommend!",
      rating: 5,
      occasion: "Eid celebration"
    },
    {
      id: "3",
      name: "Priya Sharma",
      review: "The kulfi was the perfect end to our dinner party. Guests couldn't stop asking where we got such amazing desserts!",
      rating: 5,
      occasion: "Dinner party",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop"
    },
    {
      id: "4",
      name: "Ahmed Hassan", 
      review: "Professional service and exceptional quality. The sheer khorma was exactly what we needed for our wedding reception.",
      rating: 5,
      occasion: "Wedding reception"
    },
    {
      id: "5",
      name: "Fatima Ali",
      review: "Chef Bano's attention to detail is remarkable. Every dessert is made with love and it shows in the taste!",
      rating: 5,
      occasion: "Birthday celebration",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop"
    }
  ]
};

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize content from localStorage or default
    try {
      const saved = localStorage.getItem('cms-content');
      const initialContent = saved ? JSON.parse(saved) : defaultContent;
      setContent(initialContent);
    } catch (error) {
      console.error('Error loading content:', error);
      setContent(defaultContent);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever content changes
  useEffect(() => {
    if (content && !isLoading) {
      try {
        localStorage.setItem('cms-content', JSON.stringify(content));
      } catch (error) {
        console.error('Error saving content:', error);
      }
    }
  }, [content, isLoading]);

  const updateContent = (section: keyof ContentType, data: any) => {
    setContent(prev => prev ? ({
      ...prev,
      [section]: data
    }) : null);
  };

  const updateDesserts = (desserts: DessertItem[]) => {
    setContent(prev => prev ? ({
      ...prev,
      desserts
    }) : null);
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, updateDesserts, isLoading }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}