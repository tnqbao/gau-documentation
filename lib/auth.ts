import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getAdminByUsername, createAdmin, adminExists } from './db';

// Tạo admin mặc định nếu chưa có
async function ensureDefaultAdmin() {
  try {
    if (!adminExists()) {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const hash = await bcrypt.hash(defaultPassword, 10);
      createAdmin('admin', hash);
      console.log('Default admin created. Username: admin');
    }
  } catch (error) {
    // Ignore if admin already exists
  }
}

// Gọi khi module được load
ensureDefaultAdmin();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const admin = getAdminByUsername(credentials.username);
        if (!admin) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, admin.password_hash);
        if (!isValid) {
          return null;
        }

        return {
          id: String(admin.id),
          name: admin.username,
          email: admin.username
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  pages: {
    signIn: '/admin/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
};
