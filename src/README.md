# Bano's Sweet Delights - Static Website

A beautiful, fully functional static website for Bano's South Asian dessert brand built with React and TypeScript.

## 🌟 Features

### Customer Features
- **Product Catalog**: Browse authentic South Asian desserts with detailed descriptions
- **Shopping Cart**: Add items to cart with quantity management
- **Checkout Process**: Complete order placement with delivery information
- **User Authentication**: Mock login/signup system using localStorage
- **Order Tracking**: View order history and status
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Admin Features
- **Content Management System (CMS)**: Full admin panel accessible via navigation
- **Product Management**: Add, edit, and delete dessert items
- **Order Management**: View and update order statuses
- **Content Editing**: Manage hero section, about content, and serving ideas
- **Testimonials Management**: Add and manage customer reviews
- **Payment Settings**: Configure payment gateway information
- **Site Settings**: Update business information and contact details

## 🛠 Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4.0 with custom design system
- **UI Components**: Shadcn/ui component library
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Data Storage**: localStorage for full persistence
- **Build Type**: Static site (no backend required)

## 🎨 Design Features

- **Brand Colors**: Warm greens and yellows reflecting South Asian aesthetics
- **Typography**: Parisienne font for headings, system fonts for body text
- **Animations**: Smooth page transitions and micro-interactions
- **Responsive**: Mobile-first design approach
- **Logo**: Custom SVG with Islamic-inspired patterns and dessert motifs

## 📦 Data Management

All data is stored locally using browser localStorage:

- **Products**: `/cms-content` - Product catalog and content
- **Orders**: `/customer-orders` - Customer order history
- **Users**: `/mock-users` and `/current-user` - Authentication data
- **Images**: `/uploaded-images` - Base64 encoded uploaded images
- **Payment**: `/payment-gateways` - Payment gateway configurations

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Build for production: `npm run build`

## 📱 Usage

### Customer Flow
1. Browse desserts on the homepage
2. Add items to cart
3. Create account or login
4. Complete checkout with delivery details
5. Track orders in "My Orders" section

### Admin Flow
1. Access admin panel via "Admin" in navigation
2. Manage products, content, and orders
3. Update business settings and payment information
4. View dashboard analytics

## 🔧 Customization

### Adding New Products
1. Go to Admin → Desserts Management
2. Click "Add New Dessert"
3. Fill in details and upload images
4. Products appear immediately on the site

### Updating Content
1. Use the admin panel to edit:
   - Hero section content
   - About section details
   - Serving ideas
   - Testimonials
   - Site settings

### Styling
- Colors defined in `/styles/globals.css`
- Custom utilities for dessert-themed styling
- Responsive breakpoints follow Tailwind defaults

## 📄 File Structure

```
├── App.tsx                     # Main application component
├── components/
│   ├── ui/                     # Shadcn UI components
│   ├── admin/                  # Admin panel components
│   ├── figma/                  # Figma-specific components
│   ├── AuthContext.tsx         # Authentication context
│   ├── CartContext.tsx         # Shopping cart context
│   ├── ContentContext.tsx      # Content management context
│   └── [other components]      # Page and section components
├── styles/
│   └── globals.css             # Global styles and design tokens
└── utils/
    └── supabase/
        └── info.tsx            # Legacy file (deprecated)
```

## 🎯 Key Components

- **App.tsx**: Main application with routing and state management
- **ContentContext**: Centralized content management for CMS
- **AuthContext**: Mock authentication system
- **CartContext**: Shopping cart functionality
- **Admin Components**: Full CMS functionality

## 🔒 Security Notes

This is a demo application using localStorage for data persistence. In a production environment, you would want to:

- Implement proper authentication
- Use a secure backend for data storage
- Add input validation and sanitization
- Implement proper session management

## 🎨 Brand Identity

**Bano's Sweet Delights** represents authentic South Asian dessert craftsmanship with:
- Traditional recipes passed down through generations
- Premium quality ingredients
- Certified food handling standards
- Personal touch from Chef Bano Ahmad

## 📞 Contact

For questions about this codebase or customization:
- Email: hello@banossweets.com
- Phone: (555) 123-4567

---

*Built with ❤️ for authentic South Asian dessert lovers*