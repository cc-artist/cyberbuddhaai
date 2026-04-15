import { getServerSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// 确保NEXTAUTH_SECRET存在，否则生成一个默认值（仅用于开发环境）
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'default-secret-for-development-only';

// 这里我们使用简单的密码认证，实际项目中应该从数据库获取管理员信息
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// 定义完整的认证选项
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'admin@example.com'
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '********'
        }
      },
      async authorize(credentials) {
        // 简单的密码验证，实际项目中应该使用数据库查询和密码哈希验证
        if (
          credentials?.email === ADMIN_EMAIL &&
          credentials?.password === ADMIN_PASSWORD
        ) {
          return {
            id: '1',
            email: ADMIN_EMAIL,
            name: 'Admin User'
          };
        }
        
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        // 使用类型断言扩展session.user类型
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  secret: NEXTAUTH_SECRET,
};

// 为App Router专门创建的getSession函数，使用dynamic配置确保兼容性
export const getAppSession = async () => {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// 导出原始getSession函数，供其他组件使用
export const getSession = getAppSession;

// 为API路由提供的getSession函数
export async function getApiSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getAppSession();
  return session?.user;
}

export async function isAdminAuthenticated() {
  const session = await getApiSession();
  return !!session?.user;
}