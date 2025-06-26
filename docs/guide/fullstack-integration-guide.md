# フルスタック統合ガイド

このガイドは、Claude Codeがフロントエンド（React Router v7）とバックエンド（Node.js + Express）を統合したフルスタックアプリケーションを構築するための完全な手順を提供します。

## 🎯 統合アーキテクチャ概要

### 技術スタック
- **フロントエンド**: React Router v7 + shadcn-ui + Tailwind CSS
- **バックエンド**: Node.js + Express + Prisma + PostgreSQL
- **共通**: TypeScript + Result型 + Repository Pattern

### プロジェクト構造

**推奨構造（デプロイ対応・実用的）**:
```
my-fullstack-app/
├── frontend/              # React Router v7アプリ（独立デプロイ可能）
│   ├── package.json
│   ├── src/
│   │   ├── types/         # フロントエンド用型定義
│   │   └── ...
│   └── ...
├── backend/               # Express APIサーバー（独立デプロイ可能）
│   ├── package.json
│   ├── src/
│   │   ├── types/         # バックエンド用型定義
│   │   └── ...
│   └── ...
├── docs/
│   └── api-spec.md        # API仕様書（型定義同期用）
├── package.json           # ワークスペース管理のみ
└── docker-compose.yml     # 開発環境
```

**この構造の利点**:
- ✅ frontend/backendが完全独立（デプロイ時に依存関係なし）
- ✅ 各アプリが独自のpackage.jsonを持つ
- ✅ Vercel、Railway等へのデプロイが簡単
- ✅ CI/CDパイプラインが複雑にならない
- ✅ 型定義の同期は文書化されたAPI仕様で管理

## 🚀 Phase 1: プロジェクト初期化

### Step 1: ワークスペース作成

Claude Codeは以下の手順で実行してください：

```bash
# 1. プロジェクトルート作成
mkdir my-fullstack-app && cd my-fullstack-app

# 2. ワークスペース package.json 作成
npm init -y

# 3. ワークスペース設定
npm pkg set workspaces[]="frontend"
npm pkg set workspaces[]="backend"
npm pkg set type=module

# 4. 開発用ディレクトリ作成
mkdir -p docs

# 5. 開発ブランチ作成
git init
git checkout -b feature/fullstack-setup
```

### Step 2: バックエンド初期化

```bash
# 1. バックエンドディレクトリ作成
mkdir backend && cd backend

# 2. バックエンド設定適用
# @docs/guide/backend/node-typescript-setup.md の手順を実行
npm init -y
npm pkg set type=module

# 3. TypeScript + Express依存関係
npm install express cors dotenv
npm install -D typescript @types/node @types/express @types/cors tsx nodemon

# 4. 基本ディレクトリ構造作成
mkdir -p src/types src/routes src/services

# プロジェクトルートに戻る
cd ..
```

### Step 3: フロントエンド初期化

```bash
# 1. フロントエンドディレクトリ作成  
mkdir frontend && cd frontend

# 2. フロントエンド設定適用
# @docs/guide/frontend/react-router-v7-setup.md の手順を実行
npm create react-router@latest . --template basic

# 3. 型定義ディレクトリ作成
mkdir -p src/types

# プロジェクトルートに戻る
cd ..
```

### Step 4: API仕様書の初期化

```bash
# API仕様書テンプレート作成
cat > docs/api-spec.md << 'EOF'
# API仕様書

## User API

### GET /api/users
ユーザー一覧取得

### POST /api/users  
ユーザー作成

## 型定義

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### CreateUserRequest
```typescript
interface CreateUserRequest {
  name: string;
  email: string;
  role: 'admin' | 'user';
}
```
EOF
```

## 📦 Phase 2: 型定義とAPI契約

### 型定義戦略

**重要**: 各アプリ（frontend/backend）で独自に型定義を管理し、API仕様書で同期を保ちます。

### バックエンド型定義

```typescript
// backend/src/types/api-types.ts

// =============================================================================
// 基本型
// =============================================================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// =============================================================================
// エンティティ定義
// =============================================================================

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

export interface Post extends BaseEntity {
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  tags: string[];
}

// =============================================================================
// API Request/Response型
// =============================================================================

// User API
export interface CreateUserRequest {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

// Post API
export interface CreatePostRequest {
  title: string;
  content: string;
  authorId: string;
  tags: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  published?: boolean;
  tags?: string[];
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}
```

### フロントエンド型定義

```typescript
// frontend/src/types/api-types.ts

// 注意: バックエンドの型定義と手動で同期する必要があります
// docs/api-spec.md を参照してください

// =============================================================================
// 基本型  
// =============================================================================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// =============================================================================
// エンティティ定義（バックエンドと同じ構造）
// =============================================================================

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

export interface Post extends BaseEntity {
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  tags: string[];
}

// =============================================================================
// API Request/Response型（バックエンドと同じ構造）
// =============================================================================

export interface CreateUserRequest {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

// =============================================================================
// フロントエンド専用型
// =============================================================================

export interface ApiClient {
  getUsers(page?: number, limit?: number): Promise<ApiResponse<UserListResponse>>;
  getUser(id: string): Promise<ApiResponse<User>>;
  createUser(data: CreateUserRequest): Promise<ApiResponse<User>>;
  updateUser(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>>;
  deleteUser(id: string): Promise<ApiResponse<void>>;
}
```

### 型定義同期のベストプラクティス

#### 1. API仕様書を活用した同期

```markdown
<!-- docs/api-spec.md -->
# API仕様書

## 型同期チェックリスト

バックエンドで型を変更した場合：
- [ ] `docs/api-spec.md` を更新
- [ ] フロントエンドの型定義を更新
- [ ] 両方のアプリでTypeScriptエラーが0個を確認

## User API

### User型
```typescript
interface User {
  id: string;           // UUID
  name: string;         // 1-100文字
  email: string;        // メールアドレス形式
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}
```
```

#### 2. バックエンドユーティリティ

```typescript
// backend/src/utils/api-utils.ts

import { Response } from 'express';
import { ApiResponse, ApiError } from '../types/api-types';

/**
 * Express Response用ユーティリティ
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200
) => {
  res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  } as ApiResponse<T>);
};

export const sendError = (
  res: Response,
  error: ApiError,
  statusCode?: number
) => {
  const httpStatus = statusCode || getHttpStatusFromError(error);
  res.status(httpStatus).json({
    success: false,
    error,
    timestamp: new Date().toISOString(),
  } as ApiResponse<never>);
};

const getHttpStatusFromError = (error: ApiError): number => {
  switch (error.code) {
    case 'NOT_FOUND': return 404;
    case 'VALIDATION_ERROR': return 400;
    case 'AUTHENTICATION_ERROR': return 401;
    case 'AUTHORIZATION_ERROR': return 403;
    default: return 500;
  }
};
```

#### 3. フロントエンドユーティリティ

```typescript
// frontend/src/utils/api-utils.ts

import { ApiResponse, ApiError } from '../types/api-types';

/**
 * fetch用ユーティリティ
 */
export const fetchJson = async <T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const json: ApiResponse<T> = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error?.message || `HTTP ${response.status}`);
    }

    return json;
  } catch (error) {
    // エラーレスポンスを統一形式で返す
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
      },
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * APIエラーハンドリング
 */
export const handleApiError = (error: ApiError): string => {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      return `入力エラー: ${error.message}`;
    case 'NOT_FOUND':
      return 'データが見つかりません';
    case 'AUTHENTICATION_ERROR':
      return 'ログインが必要です';
    case 'AUTHORIZATION_ERROR':
      return '権限がありません';
    default:
      return 'エラーが発生しました';
  }
};
```

## 🔄 Phase 3: バックエンドAPI実装

### Express サーバー設定

```typescript
// backend/src/app.ts

import express from 'express';
import cors from 'cors';
import { createUserRouter } from './routes/users';
import { createPostRouter } from './routes/posts';

const app = express();

// ミドルウェア
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ルーター設定
app.use('/api/users', createUserRouter());
app.use('/api/posts', createPostRouter());

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// エラーハンドリングミドルウェア
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
```

### User API実装例

```typescript
// backend/src/routes/users.ts

import { Router } from 'express';
import { sendSuccess, sendError } from '../utils/api-utils';
import { CreateUserRequest, UpdateUserRequest, User, UserListResponse } from '../types/api-types';
import { userService } from '../services/user-service';

export const createUserRouter = () => {
  const router = Router();

  // GET /api/users
  router.get('/', async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const users = await userService.getAllUsers({ page, limit });
      const total = await userService.getUserCount();

      const response: UserListResponse = {
        users,
        total,
        page,
        limit,
      };

      sendSuccess(res, response);
    } catch (error) {
      sendError(res, {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch users',
      });
    }
  });

  // GET /api/users/:id
  router.get('/:id', async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      
      if (!user) {
        return sendError(res, {
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      sendSuccess(res, user);
    } catch (error) {
      sendError(res, {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch user',
      });
    }
  });

  // POST /api/users
  router.post('/', async (req, res) => {
    try {
      const data: CreateUserRequest = req.body;
      
      // バリデーション
      if (!data.name || !data.email) {
        return sendError(res, {
          code: 'VALIDATION_ERROR',
          message: 'Name and email are required',
        }, 400);
      }

      // メールアドレス重複チェック
      const existingUser = await userService.getUserByEmail(data.email);
      if (existingUser) {
        return sendError(res, {
          code: 'VALIDATION_ERROR',
          message: 'Email already exists',
        }, 400);
      }

      const user = await userService.createUser({
        ...data,
        isActive: true,
      });
      
      sendSuccess(res, user, 201);
    } catch (error) {
      sendError(res, {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create user',
      });
    }
  });

  // PUT /api/users/:id
  router.put('/:id', async (req, res) => {
    try {
      const data: UpdateUserRequest = req.body;
      const user = await userService.updateUser(req.params.id, data);
      
      if (!user) {
        return sendError(res, {
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      sendSuccess(res, user);
    } catch (error) {
      sendError(res, {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update user',
      });
    }
  });

  // DELETE /api/users/:id
  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await userService.deleteUser(req.params.id);
      
      if (!deleted) {
        return sendError(res, {
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      res.status(204).send();
    } catch (error) {
      sendError(res, {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete user',
      });
    }
  });

  return router;
};
```

### User Service実装例

```typescript
// backend/src/services/user-service.ts

import { User, CreateUserRequest, UpdateUserRequest } from '../types/api-types';

// 注意: 実際の実装では、Prisma、Drizzle、またはその他のORMを使用してください
// ここでは簡単な例として、メモリストレージを使用しています

class UserService {
  private users: User[] = [];
  private nextId = 1;

  async getAllUsers(options: { page: number; limit: number }): Promise<User[]> {
    const { page, limit } = options;
    const start = (page - 1) * limit;
    const end = start + limit;
    return this.users.slice(start, end);
  }

  async getUserCount(): Promise<number> {
    return this.users.length;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async createUser(data: CreateUserRequest & { isActive: boolean }): Promise<User> {
    const now = new Date().toISOString();
    const user: User = {
      id: String(this.nextId++),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    
    this.users.push(user);
    return user;
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User | null> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;

    const updatedUser: User = {
      ...this.users[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.users[index] = updatedUser;
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }
}

export const userService = new UserService();
```

## 🎨 Phase 4: フロントエンド統合

### API Client実装

```typescript
// frontend/src/lib/api-client.ts

import { fetchJson } from '../utils/api-utils';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest,
  UserListResponse,
  ApiClient 
} from '../types/api-types';

class ApiClientImpl implements ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  async getUsers(page = 1, limit = 10) {
    return fetchJson<UserListResponse>(`${this.baseUrl}/users?page=${page}&limit=${limit}`);
  }

  async getUser(id: string) {
    return fetchJson<User>(`${this.baseUrl}/users/${id}`);
  }

  async createUser(data: CreateUserRequest) {
    return fetchJson<User>(`${this.baseUrl}/users`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: UpdateUserRequest) {
    return fetchJson<User>(`${this.baseUrl}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return fetchJson<void>(`${this.baseUrl}/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClientImpl();

// 環境変数による設定
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export const api = new ApiClientImpl(API_BASE_URL);
```

### React Hook統合

```typescript
// frontend/src/hooks/use-api.ts

import { useState, useEffect } from 'react';
import { ApiError, ApiResponse } from '../types/api-types';
import { handleApiError } from '../utils/api-utils';

export const useApi = <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: unknown[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall();

        if (!isCancelled) {
          if (response.success && response.data) {
            setData(response.data);
            setError(null);
          } else if (response.error) {
            setData(null);
            setError(handleApiError(response.error));
          }
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setData(null);
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, dependencies);

  const refetch = () => {
    setLoading(true);
    setError(null);
    // 依存関係を変更して再実行をトリガー
  };

  return { data, error, loading, refetch };
};

// カスタムフック: User一覧取得
export const useUsers = (page = 1, limit = 10) => {
  const { data, error, loading, refetch } = useApi(
    () => api.getUsers(page, limit),
    [page, limit]
  );

  return {
    users: data?.users || [],
    total: data?.total || 0,
    error,
    loading,
    refetch,
  };
};

// カスタムフック: User詳細取得
export const useUser = (id: string) => {
  return useApi(
    () => api.getUser(id),
    [id]
  );
};
```

### User管理画面例

```typescript
// frontend/src/routes/users._index.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsers } from '../hooks/use-api';
import { User } from '../types/api-types';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { users, total, error, loading, refetch } = useUsers(page, 10);

  if (loading) return <div className="p-8 text-center">読み込み中...</div>;
  if (error) return (
    <div className="p-8 text-center text-red-600">
      エラー: {error}
      <Button onClick={refetch} className="ml-4">再試行</Button>
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ユーザー管理</h1>
        <div className="flex gap-2">
          <Button onClick={refetch} variant="outline">更新</Button>
          <Button>新規ユーザー</Button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          ユーザーが見つかりません
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {users.map((user: User) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {user.name}
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isActive ? '有効' : '無効'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>メール:</strong> {user.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>ロール:</strong> 
                      <span className={`ml-1 px-2 py-1 text-xs rounded ${
                        user.role === 'admin' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>作成日:</strong> {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">編集</Button>
                      <Button variant="destructive" size="sm">削除</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <Button 
              variant="outline" 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              前へ
            </Button>
            <span className="text-sm text-gray-600">
              {page} / {Math.ceil(total / 10)} ページ（全 {total} 件）
            </span>
            <Button 
              variant="outline"
              disabled={page * 10 >= total}
              onClick={() => setPage(page + 1)}
            >
              次へ
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
```

### 環境変数設定

```typescript
// frontend/.env.development
VITE_API_URL=http://localhost:3001/api

// frontend/.env.production  
VITE_API_URL=https://api.yourdomain.com/api
```

## 🐳 Phase 5: 開発環境セットアップ

### Docker Compose設定

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: app_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev -d app_dev"]
      interval: 30s
      timeout: 10s
      retries: 3

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://dev:password@postgres:5432/app_dev
      NODE_ENV: development
      FRONTEND_URL: http://localhost:5173
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:3001/api
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  postgres_data:
```

### 開発用Dockerfile

```dockerfile
# backend/Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# 依存関係のコピーとインストール
COPY package*.json ./
RUN npm ci

# ソースコードをコピー
COPY . .

# ポート公開
EXPOSE 3001

# 開発モードで起動
CMD ["npm", "run", "dev"]
```

```dockerfile
# frontend/Dockerfile.dev  
FROM node:18-alpine

WORKDIR /app

# 依存関係のコピーとインストール
COPY package*.json ./
RUN npm ci

# ソースコードをコピー
COPY . .

# ポート公開
EXPOSE 5173

# 開発モードで起動
CMD ["npm", "run", "dev", "--", "--host"]
```

### 開発スクリプト（改善版）

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:docker": "docker-compose up --build",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build", 
    "build:frontend": "cd frontend && npm run build",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd backend && npm test",
    "test:frontend": "cd frontend && npm test",
    "typecheck": "npm run typecheck:backend && npm run typecheck:frontend",
    "typecheck:backend": "cd backend && npm run typecheck",
    "typecheck:frontend": "cd frontend && npm run typecheck",
    "clean": "rm -rf backend/dist frontend/dist backend/node_modules frontend/node_modules",
    "setup": "npm install && cd backend && npm install && cd ../frontend && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

## 🚀 デプロイ対応

### バックエンドデプロイ（Railway/Render等）

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm ci --only=production

# ソースコードのコピー
COPY . .

# TypeScriptビルド
RUN npm run build

# ポート公開
EXPOSE 3001

# 本番モードで起動
CMD ["npm", "start"]
```

### フロントエンドデプロイ（Vercel/Netlify等）

```json
// frontend/package.json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

```javascript
// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 5173,
    host: true, // Docker対応
  },
});
```

### CI/CD設定例（GitHub Actions）

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: cd backend && npm ci
        
      - name: Run tests
        run: cd backend && npm test
        
      - name: TypeScript check
        run: cd backend && npm run typecheck
        
      - name: Deploy to Railway
        run: # Railway CLI deployment
        
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js  
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: cd frontend && npm ci
        
      - name: Run tests
        run: cd frontend && npm test
        
      - name: TypeScript check
        run: cd frontend && npm run typecheck
        
      - name: Build
        run: cd frontend && npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          working-directory: ./frontend
```

## 📋 Claude Code実行チェックリスト

### 初期設定完了確認
- [ ] ワークスペース構造（frontend/, backend/）が正しく作成されている
- [ ] 各アプリが独自のpackage.jsonを持っている
- [ ] バックエンドサーバーが起動する（http://localhost:3001/health）
- [ ] フロントエンドが起動する（http://localhost:5173）
- [ ] docs/api-spec.mdが作成されている

### API統合確認
- [ ] バックエンドAPIエンドポイントが動作する
- [ ] フロントエンドからAPIを呼び出せる
- [ ] APIレスポンスが統一された形式（ApiResponse型）
- [ ] エラーハンドリングが適切に機能している
- [ ] 型定義がフロントエンド・バックエンドで同期されている

### デプロイ準備確認
- [ ] frontend/が独立してビルド・デプロイできる
- [ ] backend/が独立してビルド・デプロイできる
- [ ] 環境変数が適切に設定されている
- [ ] Docker設定が動作する（任意）

### 品質確認
- [ ] バックエンドで`npm run typecheck`がエラー0個
- [ ] フロントエンドで`npm run typecheck`がエラー0個
- [ ] 全体で`npm run build`が成功する
- [ ] 型定義がdocs/api-spec.mdと一致している

### 型同期確認
- [ ] API仕様書（docs/api-spec.md）が最新である
- [ ] バックエンドの型定義が正確である
- [ ] フロントエンドの型定義がバックエンドと一致している
- [ ] 新しい型を追加した場合、両方のアプリに反映されている

## 🔗 関連ガイド

- [共通実践ガイド](./shared/README.md): 基盤アーキテクチャと型安全性
- [フロントエンド設定ガイド](./frontend/react-router-v7-setup.md): React Router v7詳細設定
- [バックエンド設定ガイド](./backend/node-typescript-setup.md): Express + TypeScript詳細設定
- [実践的TDD実装ガイド](./practical-tdd-implementation.md): t-wada流TDD実践方法

## 🎯 デプロイ戦略

### 推奨デプロイプラットフォーム

- **フロントエンド**: Vercel、Netlify、Cloudflare Pages
- **バックエンド**: Railway、Render、Fly.io、AWS App Runner
- **データベース**: Supabase、PlanetScale、Neon

### 型定義同期の維持方法

1. **手動同期** (現在の方法)
   - API仕様書を必ず更新
   - 両アプリの型定義を手動で同期
   - TypeScriptエラーでチェック

2. **将来の発展方向**
   - OpenAPI/Swagger導入
   - tRPC導入検討
   - Code Generation tools導入

---

**重要**: この現実的な構造により、デプロイが簡単で保守性の高いフルスタックアプリケーションが構築できます。Claude Codeは型定義の同期を常に意識し、品質チェックを実行してください。