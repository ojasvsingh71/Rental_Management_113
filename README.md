📦 AI-Powered Sustainable Rental Platform
A next-generation role-based rental management system designed to streamline operations, detect rental damages using AI, and promote eco-friendly usage through sustainability dashboards.
Built for Customers, End Users, and Admins, it addresses industry challenges like fraud prevention, inventory management, dynamic pricing, and seasonal demand control—critical issues in tourist-heavy and high-traffic rental markets.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Redis (for OTP functionality)
- Python 3.8+ (for AI damage detection)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rental-management-system
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database and other configurations
   
   # Frontend
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your API URLs
   ```

4. **Setup database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   # Optional: seed database
   npm run seed
   ```

5. **Start all services**
   ```bash
   npm run dev
   ```

This will start:
- Backend API server on http://localhost:5000
- Frontend React app on http://localhost:5173
- AI Chat service on http://localhost:2003
- AI Damage Detection on http://localhost:8000 (if Python dependencies are installed)

### Individual Service Commands

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend

# AI Chat only
npm run dev:ai-chat
```

## 📱 Application Structure

### Backend (`/backend`)
- **Framework**: Express.js with Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT with Redis for OTP
- **API**: RESTful API with role-based access control

### Frontend (`/frontend`)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks
- **Routing**: React Router v6
- **UI Components**: Custom responsive components

### AI Services
- **Chat Bot** (`/SewaSaathi`): OpenAI-powered rental assistant
- **Damage Detection** (`/AI`): YOLO-based image analysis for damage detection

## 🔐 Authentication & Roles

The system supports multiple user roles:

1. **ADMIN**: Full system access, manage all resources
2. **CUSTOMER**: Browse products, create rentals, manage bookings
3. **END_USER**: Access to active rentals, usage guidelines, support
4. **STAFF**: Manage deliveries, pickups, and returns

## 📊 Key Features Implemented

### ✅ Completed Features
- [x] Multi-role authentication system
- [x] Responsive design for all screen sizes
- [x] Product management with categories and pricing
- [x] Rental booking and management system
- [x] Real-time dashboard with statistics
- [x] AI-powered chatbot integration
- [x] Damage detection using computer vision
- [x] Payment tracking and invoicing
- [x] Notification system
- [x] Calendar integration for scheduling
- [x] Sustainability tracking and reporting

### 🚧 In Progress
- [ ] Email notifications and OTP verification
- [ ] Advanced reporting and analytics
- [ ] Mobile app development
- [ ] Integration with payment gateways
- [ ] Advanced AI damage assessment

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/generate-otp` - Generate OTP for verification
- `POST /api/auth/verify-otp` - Verify OTP

### Products
- `GET /api/product` - Get all products
- `POST /api/product` - Create product (Admin)
- `PUT /api/product/:id` - Update product (Admin)
- `DELETE /api/product/:id` - Delete product (Admin)

### Rentals
- `GET /api/rental` - Get all rentals (Admin)
- `GET /api/rental/my` - Get user's rentals
- `POST /api/rental` - Create rental
- `PUT /api/rental/:id/status` - Update rental status

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach with breakpoints for all screen sizes
- Collapsible sidebar navigation for mobile devices
- Adaptive layouts for tables and cards
- Touch-friendly interface elements

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatible
- High contrast color schemes
- Loading states and error handling

### User Experience
- Smooth animations and transitions
- Real-time data updates
- Intuitive navigation patterns
- Consistent design language
- Progressive loading with skeletons

## 🔧 Development

### Code Structure
```
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middlewares/    # Authentication & validation
│   │   └── validate/       # Zod validation schemas
│   └── prisma/             # Database schema & migrations
├── frontend/               # React TypeScript app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API integration
│   │   └── contexts/       # React contexts
├── SewaSaathi/            # AI Chat service
└── AI/                    # Damage detection service
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

🚀 Feature Overview by Role
1. Customer Portal (Person Renting the Product)
🔍 Smart Product Discovery
Browse products with HD images, pricing tiers, and eco-scores.

Advanced filters: category, availability, duration, and price range.

Sustainability insights: “You saved X kg CO₂ by renting instead of buying.”

📄 Rich Product Details
Transparent pricing by hour/day/week/month.

Real-time availability calendar.

Product-specific eco-score display.

🛒 Seamless Booking Flow
Customizable rental duration (start/end date & time).

Delivery and pickup preferences.

Live cost calculation with deposits, discounts, and promotions.

💳 Secure Payments
Multi-gateway support: PayPal, Stripe, Razorpay.

Flexible payments: full or partial deposit.

📑 Quotations & Orders
Instant rental quotations.

Convert quotation to confirmed rental order.

Digital rental contract & invoice download.

📷 AI-Powered Condition Scans
Pre-rental upload: AI detects and documents existing damages.

Post-rental upload: AI compares with pre-rental scans to highlight new damage.

Automated pre/post rental condition reports stored for compliance.

🔔 Intelligent Notifications
Pickup/return reminders.

Late return alerts with penalty estimation.

🌱 Sustainability Dashboard (Customer View)
Cumulative CO₂ savings.

Per-rental environmental impact breakdown.

👤 Profile & Preferences
Manage profile, addresses, and payment methods.

2. End User Portal (Person Using the Product)
🚚 Delivery & Return Scheduling
Real-time delivery/pickup date & time tracking.

📖 Usage Guidelines
Digital manuals, safety precautions, and best practices.

🔔 Reminders
Return alerts sent N days in advance.

📷 Damage Reporting
Optional AI-assisted damage reporting.

🌱 Eco Tips
Sustainable usage suggestions to reduce environmental footprint.

3. Admin / Back-Office Portal (Business Owner / Staff)
📦 Inventory & Product Management
Add, edit, or remove products.

Set eco-scores and pricing tiers by duration.

Mark availability for maintenance or downtime.

📅 Availability & Order Management
Visual availability calendar.

Create/manage rental orders and contracts.

🚚 Logistics & Delivery Tracking
Manage reservations from pickup → return.

Assign staff and track vehicle routes.

🤖 AI Damage Detection
View AI-generated pre/post rental reports.

Highlight damaged areas visually.

Approve or adjust automated repair cost estimates.

Trigger deposit deduction workflows.

💰 Billing & Payments
Generate full/partial invoices.

Auto-apply late return penalties.

📊 Analytics & Insights
Track top rented items, revenue, and customer rankings.

Export reports in PDF, Excel, CSV.

🌱 Sustainability Dashboard (Admin View)
Total CO₂ savings across all rentals.

Category-wise eco-impact.

Branded sustainability reports for marketing use.

🌟 AI & Sustainability Innovations
AI Condition Analysis
Pre-Rental: Document and timestamp product condition.

Post-Rental: Automated comparison detects new damage.

Seamless damage fee calculation and deposit adjustments.

Eco Impact Tracking
Individual customer and global company CO₂ savings metrics.

Product-level sustainability scoring to influence rental decisions.

🎯 Business Value Proposition
Fraud Prevention: AI detects and records damage with photographic proof.

Sustainability Differentiator: Eco-score marketing boosts brand image.

Revenue Optimization: Dynamic pricing for seasonal demand control.

Operational Efficiency: Unified platform for booking, billing, and logistics.
