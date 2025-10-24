# Gau Microservices Documentation

Trang tài liệu đầy đủ cho hệ thống microservices Gau, được xây dựng với Next.js 15, TypeScript, TailwindCSS v3 và shadcn/ui.

## 🚀 Features

- **Tổng quan hệ thống**: Giới thiệu về kiến trúc microservices
- **Kiến trúc chi tiết**: Các tầng kiến trúc, patterns và communication
- **Công nghệ**: Tech stack, frameworks, databases
- **Services**: Chi tiết về từng microservice
- **Hạ tầng**: Kubernetes, Docker, CI/CD
- **Luồng hoạt động**: User flows, authentication, file upload
- **API Reference**: Tài liệu API đầy đủ cho tất cả services

## 📋 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v3
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 🛠️ Installation

```bash
# Clone repository
cd gau-documentation

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
gau-documentation/
├── app/
│   ├── layout.tsx              # Root layout với sidebar
│   ├── page.tsx                # Trang chủ - Tổng quan
│   ├── architecture/
│   │   └── page.tsx           # Trang kiến trúc
│   ├── technology/
│   │   └── page.tsx           # Trang công nghệ
│   ├── services/
│   │   └── page.tsx           # Trang services
│   ├── infrastructure/
│   │   └── page.tsx           # Trang hạ tầng
│   ├── flows/
│   │   └── page.tsx           # Trang luồng hoạt động
│   └── api/
│       └── page.tsx           # Trang API reference
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── skeleton.tsx
│   └── sidebar.tsx            # Navigation sidebar
├── lib/
│   ├── utils.ts               # Utility functions
│   └── data.ts                # Static data (services, tech stack)
└── public/                    # Static assets

```

## 🎨 Features Highlights

### Navigation
- Sidebar navigation với icons
- Active state highlighting
- Responsive design

### Content Sections
1. **Tổng quan**: Quick stats, services overview, getting started
2. **Kiến trúc**: Layers, patterns, service discovery
3. **Công nghệ**: Languages, frameworks, databases, DevOps tools
4. **Services**: Chi tiết từng service với tech stack và API endpoints
5. **Hạ tầng**: Kubernetes setup, databases, monitoring, CI/CD
6. **Flows**: User registration, login, token refresh, file upload flows
7. **API**: Complete API documentation với request/response examples

## 🔧 Customization

### Adding New Service

Edit `lib/data.ts`:

```typescript
export const services: Service[] = [
  // ...existing services
  {
    name: "new-service",
    displayName: "New Service",
    description: "Service description",
    port: 8090,
    tech: ["Go", "PostgreSQL"],
    status: "active",
    repository: "https://github.com/..."
  }
];
```

### Adding New API Endpoints

Edit the service page in `app/api/page.tsx` to add new endpoints.

## 📝 Notes

- Tất cả dữ liệu về services được quản lý trong `lib/data.ts`
- Components sử dụng shadcn/ui convention
- Styling sử dụng TailwindCSS với custom theme
- Dark mode support built-in

## 🚀 Deployment

```bash
# Build
npm run build

# Deploy to Vercel (recommended)
vercel deploy

# Or deploy to any Node.js hosting
npm start
```

## 📄 License

MIT

## 👥 Contributors

Gau Team

