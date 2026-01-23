# Document CMS

Web Document CMS đơn giản cho phép một admin duy nhất chỉnh sửa, cập nhật và xuất bản nội dung trang web.

## Tính năng

- ✅ Tạo, chỉnh sửa và xuất bản documents
- ✅ Markdown + HTML editor với toolbar
- ✅ Render nội dung tối ưu SEO
- ✅ SQLite database (không cần server riêng)
- ✅ Admin authentication
- ✅ Docker deployment ready

## Công nghệ

- **Frontend & Backend**: Next.js 15 (App Router)
- **Database**: SQLite (better-sqlite3)
- **Editor**: MDX Editor
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS

## Cài đặt

### Development

```bash
# Cài đặt dependencies
npm install

# Tạo file .env.local
cp .env.example .env.local

# Chạy development server
npm run dev
```

### Production (Docker)

```bash
# Build và chạy với Docker Compose
docker-compose up -d
```

## Cấu hình

Tạo file `.env.local` với các biến sau:

```env
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=http://localhost:3000
ADMIN_PASSWORD=your-admin-password
```

## Sử dụng

### Trang Public
- `/` - Trang chủ hiển thị danh sách documents
- `/docs/[slug]` - Xem document theo slug

### Trang Admin
- `/admin/login` - Đăng nhập admin
- `/admin` - Dashboard quản lý documents
- `/admin/documents/new` - Tạo document mới
- `/admin/documents/[id]/edit` - Chỉnh sửa document

### Tài khoản mặc định
- **Username**: admin
- **Password**: admin123 (hoặc giá trị ADMIN_PASSWORD trong .env)

## Database Schema

```sql
documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content_md TEXT NOT NULL,
  created_at DATETIME,
  updated_at DATETIME
)
```

## Kiến trúc

```
[ User ] ---> [ Next.js Web App ]
                    |
                    | Server Actions / API Routes
                    v
              [ SQLite Database ]
                    |
               Docker Volume
```

## Bảo mật

- Admin auth với NextAuth.js
- HTML sanitization (chặn script, inline JS)
- Chỉ cho phép các tag an toàn (img, a, pre, code, table, etc.)

## License

MIT

