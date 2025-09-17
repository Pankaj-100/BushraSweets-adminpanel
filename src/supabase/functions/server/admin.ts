import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Enable CORS
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Utility function to generate IDs
function generateId(): string {
  return crypto.randomUUID();
}

// Products Routes
app.get('/admin/products', async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    return c.json(products.map(p => p.value));
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

app.post('/admin/products', async (c) => {
  try {
    const productData = await c.req.json();
    const id = generateId();
    const product = {
      id,
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`product:${id}`, product);
    return c.json(product, 201);
  } catch (error) {
    console.error('Error creating product:', error);
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

app.put('/admin/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const productData = await c.req.json();
    
    const existingProduct = await kv.get(`product:${id}`);
    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    const updatedProduct = {
      ...existingProduct.value,
      ...productData,
      id,
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`product:${id}`, updatedProduct);
    return c.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

app.delete('/admin/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`product:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// Serving Ideas Routes
app.get('/admin/serving-ideas', async (c) => {
  try {
    const servingIdeas = await kv.getByPrefix('serving_idea:');
    return c.json(servingIdeas.map(s => s.value));
  } catch (error) {
    console.error('Error fetching serving ideas:', error);
    return c.json({ error: 'Failed to fetch serving ideas' }, 500);
  }
});

app.post('/admin/serving-ideas', async (c) => {
  try {
    const servingIdeaData = await c.req.json();
    const id = generateId();
    const servingIdea = {
      id,
      ...servingIdeaData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`serving_idea:${id}`, servingIdea);
    return c.json(servingIdea, 201);
  } catch (error) {
    console.error('Error creating serving idea:', error);
    return c.json({ error: 'Failed to create serving idea' }, 500);
  }
});

app.put('/admin/serving-ideas/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const servingIdeaData = await c.req.json();
    
    const existingServingIdea = await kv.get(`serving_idea:${id}`);
    if (!existingServingIdea) {
      return c.json({ error: 'Serving idea not found' }, 404);
    }
    
    const updatedServingIdea = {
      ...existingServingIdea.value,
      ...servingIdeaData,
      id,
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`serving_idea:${id}`, updatedServingIdea);
    return c.json(updatedServingIdea);
  } catch (error) {
    console.error('Error updating serving idea:', error);
    return c.json({ error: 'Failed to update serving idea' }, 500);
  }
});

app.delete('/admin/serving-ideas/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`serving_idea:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting serving idea:', error);
    return c.json({ error: 'Failed to delete serving idea' }, 500);
  }
});

// Orders Routes
app.get('/admin/orders', async (c) => {
  try {
    const orders = await kv.getByPrefix('order:');
    // Sort orders by created_at descending
    const sortedOrders = orders
      .map(o => o.value)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return c.json(sortedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

app.put('/admin/orders/:id/status', async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    
    const existingOrder = await kv.get(`order:${id}`);
    if (!existingOrder) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    const updatedOrder = {
      ...existingOrder.value,
      status,
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`order:${id}`, updatedOrder);
    return c.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return c.json({ error: 'Failed to update order status' }, 500);
  }
});

// Create a new order (for frontend checkout)
app.post('/admin/orders', async (c) => {
  try {
    const orderData = await c.req.json();
    const id = generateId();
    const order = {
      id,
      ...orderData,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await kv.set(`order:${id}`, order);
    return c.json(order, 201);
  } catch (error) {
    console.error('Error creating order:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Site Settings Routes
app.get('/admin/settings', async (c) => {
  try {
    const settings = await kv.get('site_settings');
    
    if (!settings) {
      // Return default settings if none exist
      const defaultSettings = {
        id: 'default',
        site_name: "Bushra's Sweets",
        phone: '(555) 123-SWEETS',
        whatsapp: '(555) 123-4567',
        email: 'orders@bushrasweets.com',
        delivery_area: 'San Francisco Bay Area',
        delivery_radius: '15 miles',
        min_order_free_delivery: 50,
        advance_notice_hours: 48,
        business_hours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '19:00' },
          saturday: { open: '10:00', close: '18:00' },
          sunday: { open: '12:00', close: '17:00' }
        },
        hero_title: 'Authentic South Asian Desserts',
        hero_subtitle: 'Made with love using traditional family recipes',
        hero_image: 'https://images.pexels.com/photos/31109623/pexels-photo-31109623.jpeg?auto=compress&cs=tinysrgb&w=1200',
        about_title: "Chef Bushra's Story",
        about_description: 'Bringing authentic South Asian desserts to your celebrations',
        about_image: 'https://images.pexels.com/photos/6707628/pexels-photo-6707628.jpeg?auto=compress&cs=tinysrgb&w=800',
        updated_at: new Date().toISOString()
      };
      
      await kv.set('site_settings', defaultSettings);
      return c.json(defaultSettings);
    }
    
    return c.json(settings.value);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return c.json({ error: 'Failed to fetch site settings' }, 500);
  }
});

app.put('/admin/settings', async (c) => {
  try {
    const settingsData = await c.req.json();
    
    const existingSettings = await kv.get('site_settings');
    const updatedSettings = {
      ...(existingSettings?.value || {}),
      ...settingsData,
      updated_at: new Date().toISOString()
    };
    
    await kv.set('site_settings', updatedSettings);
    return c.json(updatedSettings);
  } catch (error) {
    console.error('Error updating site settings:', error);
    return c.json({ error: 'Failed to update site settings' }, 500);
  }
});

// Content Routes (for frontend to fetch CMS content)
app.get('/content/products', async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    const activeProducts = products
      .map(p => p.value)
      .filter(p => p.is_active !== false);
    
    return c.json(activeProducts);
  } catch (error) {
    console.error('Error fetching public products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

app.get('/content/serving-ideas', async (c) => {
  try {
    const servingIdeas = await kv.getByPrefix('serving_idea:');
    const activeServingIdeas = servingIdeas
      .map(s => s.value)
      .filter(s => s.is_active !== false);
    
    return c.json(activeServingIdeas);
  } catch (error) {
    console.error('Error fetching public serving ideas:', error);
    return c.json({ error: 'Failed to fetch serving ideas' }, 500);
  }
});

app.get('/content/settings', async (c) => {
  try {
    const settings = await kv.get('site_settings');
    return c.json(settings?.value || {});
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

// Initialize default data
app.post('/admin/initialize', async (c) => {
  try {
    // Check if data already exists
    const existingProducts = await kv.getByPrefix('product:');
    if (existingProducts.length > 0) {
      return c.json({ message: 'Data already initialized' });
    }

    // Initialize default products
    const defaultProducts = [
      {
        id: generateId(),
        name: 'Traditional Kheer',
        description: 'Creamy rice pudding slow-cooked with milk, aromatic cardamom, and topped with pistachios and almonds. Made with basmati rice and pure desi ghee.',
        price: 12.99,
        image: 'https://images.pexels.com/photos/31109623/pexels-photo-31109623.jpeg?auto=compress&cs=tinysrgb&w=800',
        prep_time: '24 hours',
        serves: '4-6 people',
        category: 'traditional',
        is_popular: true,
        rating: 4.8,
        review_count: 89,
        allergens: ['Dairy', 'Nuts'],
        ingredients: ['Basmati Rice', 'Whole Milk', 'Sugar', 'Cardamom', 'Pistachios', 'Almonds', 'Ghee'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'Festive Sheer-Khorma',
        description: 'Rich vermicelli pudding with dates, nuts, and aromatic spices - perfect for Eid celebrations. A traditional recipe passed down through generations.',
        price: 15.99,
        image: 'https://media.istockphoto.com/id/2211236735/photo/title-sheer-khurma-or-sheer-khorma.jpg?s=612x612&w=0&k=20&c=KmFG6cHk1L2qYvL4YGPg4c2YYVr8zJGGfJ4kJ8TbTxY=',
        prep_time: '48 hours',
        serves: '6-8 people',
        category: 'seasonal',
        is_popular: true,
        rating: 4.9,
        review_count: 67,
        allergens: ['Dairy', 'Nuts'],
        ingredients: ['Vermicelli', 'Whole Milk', 'Dates', 'Almonds', 'Pistachios', 'Cardamom', 'Rose Water'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'Rose Kulfi',
        description: 'Traditional frozen dessert infused with rose water and cardamom, garnished with pistachios. A refreshing treat for warm days.',
        price: 8.99,
        image: 'https://i.pinimg.com/564x/12/8b/ef/128bef8f7b3d5a4f8e3c2b6a4d1e7c9b.jpg',
        prep_time: '12 hours',
        serves: '2-3 people',
        category: 'frozen',
        is_popular: false,
        rating: 4.7,
        review_count: 45,
        allergens: ['Dairy', 'Nuts'],
        ingredients: ['Whole Milk', 'Heavy Cream', 'Sugar', 'Rose Water', 'Cardamom', 'Pistachios'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Save default products
    for (const product of defaultProducts) {
      await kv.set(`product:${product.id}`, product);
    }

    // Initialize default serving ideas
    const defaultServingIdeas = [
      {
        id: generateId(),
        title: 'Festival Celebrations',
        subtitle: 'Traditional festivities made sweeter',
        description: 'Perfect for Eid, Diwali, and other cultural celebrations where sweets symbolize joy and prosperity.',
        image: 'https://images.pexels.com/photos/6210745/pexels-photo-6210745.jpeg?auto=compress&cs=tinysrgb&w=800',
        occasions: ['Eid ul-Fitr', 'Eid ul-Adha', 'Diwali', 'Holi', 'Cultural Events'],
        icon: '🎆',
        color: 'from-orange-400 to-red-500',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateId(),
        title: 'Wedding Ceremonies',
        subtitle: 'Sweet beginnings for new chapters',
        description: 'Elegant desserts that add traditional charm to wedding receptions, mehndi, and nikah ceremonies.',
        image: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=800',
        occasions: ['Wedding Reception', 'Mehndi Ceremony', 'Nikah', 'Engagement', 'Anniversary'],
        icon: '💒',
        color: 'from-pink-400 to-rose-500',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Save default serving ideas
    for (const servingIdea of defaultServingIdeas) {
      await kv.set(`serving_idea:${servingIdea.id}`, servingIdea);
    }

    return c.json({ message: 'Default data initialized successfully' });
  } catch (error) {
    console.error('Error initializing data:', error);
    return c.json({ error: 'Failed to initialize data' }, 500);
  }
});

export default app;