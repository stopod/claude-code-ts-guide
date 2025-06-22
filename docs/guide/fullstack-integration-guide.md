# フルスタック統合ガイド

このガイドは、Claude Codeがフロントエンド（React Router v7）とバックエンド（Node.js + Express）を統合したフルスタックアプリケーションを構築するための完全な手順を提供します。

## 🎯 統合アーキテクチャ概要

### 技術スタック
- **フロントエンド**: React Router v7 + shadcn-ui + Tailwind CSS
- **バックエンド**: Node.js + Express + Prisma + PostgreSQL
- **共通**: TypeScript + Result型 + Repository Pattern

### プロジェクト構造
```
my-fullstack-app/
├── packages/
│   ├── frontend/          # React Router v7アプリ
│   ├── backend/           # Express APIサーバー
│   └── shared/            # 共通型定義・ユーティリティ
├── package.json           # ワークスペース設定
└── docker-compose.yml     # 開発環境
```

## 🚀 Phase 1: プロジェクト初期化

### Step 1: ワークスペース作成

Claude Codeは以下の手順で実行してください：

```bash
# 1. プロジェクトルート作成
mkdir my-fullstack-app && cd my-fullstack-app

# 2. ワークスペース package.json 作成
npm init -y

# 3. ワークスペース設定
npm pkg set workspaces[]=packages/*
npm pkg set type=module

# 4. 開発ブランチ作成
git init
git checkout -b feature/fullstack-setup
```

### Step 2: 共通パッケージ作成

```bash
# 1. 共通パッケージディレクトリ作成
mkdir -p packages/shared/src

# 2. 共通パッケージ初期化
cd packages/shared
npm init -y
npm pkg set name=@app/shared
npm pkg set type=module
npm pkg set main=dist/index.js
npm pkg set types=dist/index.d.ts

# 3. 共通TypeScript設定
cp @docs/guide/shared/templates/config/tsconfig.json ./
cp @docs/guide/shared/templates/config/package.json ./package-template.json

# 4. 共通実装ファイルをコピー
cp @docs/guide/shared/templates/implementations/result.ts src/
cp @docs/guide/shared/templates/implementations/repository-pattern.ts src/

# プロジェクトルートに戻る
cd ../..
```

### Step 3: バックエンド初期化

```bash
# 1. バックエンドディレクトリ作成
mkdir -p packages/backend

# 2. バックエンド設定適用
cd packages/backend
# @docs/guide/backend/node-typescript-setup.md の手順を実行

# 3. 共通パッケージへの依存追加
npm install @app/shared

cd ../..
```

### Step 4: フロントエンド初期化

```bash
# 1. フロントエンドディレクトリ作成
mkdir -p packages/frontend

# 2. フロントエンド設定適用
cd packages/frontend
# @docs/guide/frontend/react-router-v7-setup.md の手順を実行

# 3. 共通パッケージへの依存追加
npm install @app/shared

cd ../..
```

## 📦 Phase 2: 共通型定義とAPI契約

### API契約定義

```typescript
// packages/shared/src/api-types.ts

import { Result, BaseEntity } from './result';

// =============================================================================
// 共通レスポンス型
// =============================================================================

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

// =============================================================================
// API Client型
// =============================================================================

export interface ApiClient {
  // User endpoints
  getUsers(page?: number, limit?: number): Promise<Result<UserListResponse, ApiError>>;
  getUser(id: string): Promise<Result<User, ApiError>>;
  createUser(data: CreateUserRequest): Promise<Result<User, ApiError>>;
  updateUser(id: string, data: UpdateUserRequest): Promise<Result<User, ApiError>>;
  deleteUser(id: string): Promise<Result<void, ApiError>>;

  // Post endpoints
  getPosts(page?: number, limit?: number): Promise<Result<PostListResponse, ApiError>>;
  getPost(id: string): Promise<Result<Post, ApiError>>;
  createPost(data: CreatePostRequest): Promise<Result<Post, ApiError>>;
  updatePost(id: string, data: UpdatePostRequest): Promise<Result<Post, ApiError>>;
  deletePost(id: string): Promise<Result<void, ApiError>>;
}
```

### 共通ユーティリティ

```typescript
// packages/shared/src/api-utils.ts

import { Result, success, failure } from './result';
import { ApiResponse, ApiError } from './api-types';

/**
 * fetch用Result変換ユーティリティ
 */
export const fetchJson = async <T>(
  url: string,
  options?: RequestInit
): Promise<Result<T, ApiError>> => {
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
      return failure(json.error || {
        code: 'HTTP_ERROR',
        message: `HTTP ${response.status}: ${response.statusText}`,
      });
    }

    return success(json.data!);
  } catch (error) {
    return failure({
      code: 'NETWORK_ERROR',
      message: error instanceof Error ? error.message : 'Network error',
    });
  }
};

/**
 * Express Response用Result変換ユーティリティ
 */
export const sendResult = <T>(
  res: any, // Express Response
  result: Result<T, ApiError>,
  statusCode: number = 200
) => {
  if (result.success) {
    res.status(statusCode).json({
      success: true,
      data: result.data,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>);
  } else {
    const httpStatus = getHttpStatusFromError(result.error);
    res.status(httpStatus).json({
      success: false,
      error: result.error,
      timestamp: new Date().toISOString(),
    } as ApiResponse<never>);
  }
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

## 🔄 Phase 3: バックエンドAPI実装

### Express サーバー設定

```typescript
// packages/backend/src/app.ts

import express from 'express';
import cors from 'cors';
import { RepositoryFactory } from '@app/shared';
import { createUserRouter } from './routes/users';
import { createPostRouter } from './routes/posts';

const app = express();

// ミドルウェア
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Repository設定
RepositoryFactory.configure({
  type: 'prisma', // 本番環境
  connectionString: process.env.DATABASE_URL,
});

// ルーター設定
app.use('/api/users', createUserRouter());
app.use('/api/posts', createPostRouter());

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### User API実装例

```typescript
// packages/backend/src/routes/users.ts

import { Router } from 'express';
import { RepositoryFactory } from '@app/shared';
import { sendResult } from '@app/shared/api-utils';
import { CreateUserRequest, UpdateUserRequest } from '@app/shared/api-types';

export const createUserRouter = () => {
  const router = Router();
  const userRepo = RepositoryFactory.createUserRepository();

  // GET /api/users
  router.get('/', async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const result = await userRepo.findAll({ limit, offset });
    
    if (result.success) {
      const response = {
        users: result.data.items,
        total: result.data.total,
        page,
        limit,
      };
      sendResult(res, { success: true, data: response });
    } else {
      sendResult(res, result);
    }
  });

  // GET /api/users/:id
  router.get('/:id', async (req, res) => {
    const result = await userRepo.findById(req.params.id);
    sendResult(res, result);
  });

  // POST /api/users
  router.post('/', async (req, res) => {
    const data: CreateUserRequest = req.body;
    
    // バリデーション
    if (!data.name || !data.email) {
      return sendResult(res, {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name and email are required',
        },
      }, 400);
    }

    const result = await userRepo.create({
      ...data,
      isActive: true,
    });
    
    sendResult(res, result, 201);
  });

  // PUT /api/users/:id
  router.put('/:id', async (req, res) => {
    const data: UpdateUserRequest = req.body;
    const result = await userRepo.update(req.params.id, data);
    sendResult(res, result);
  });

  // DELETE /api/users/:id
  router.delete('/:id', async (req, res) => {
    const result = await userRepo.delete(req.params.id);
    sendResult(res, result, 204);
  });

  return router;
};
```

## 🎨 Phase 4: フロントエンド統合

### API Client実装

```typescript
// packages/frontend/app/lib/api-client.ts

import { ApiClient, fetchJson } from '@app/shared/api-utils';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest,
  UserListResponse,
  ApiError 
} from '@app/shared/api-types';
import { Result } from '@app/shared';

class ApiClientImpl implements ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  async getUsers(page = 1, limit = 10): Promise<Result<UserListResponse, ApiError>> {
    return fetchJson<UserListResponse>(`${this.baseUrl}/users?page=${page}&limit=${limit}`);
  }

  async getUser(id: string): Promise<Result<User, ApiError>> {
    return fetchJson<User>(`${this.baseUrl}/users/${id}`);
  }

  async createUser(data: CreateUserRequest): Promise<Result<User, ApiError>> {
    return fetchJson<User>(`${this.baseUrl}/users`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<Result<User, ApiError>> {
    return fetchJson<User>(`${this.baseUrl}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<Result<void, ApiError>> {
    return fetchJson<void>(`${this.baseUrl}/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Post endpoints...（同様の実装）
}

export const apiClient = new ApiClientImpl();
```

### React Hook統合

```typescript
// packages/frontend/app/shared/hooks/use-api.ts

import { useState, useEffect } from 'react';
import { Result } from '@app/shared';
import { ApiError } from '@app/shared/api-types';

export const useApi = <T>(
  apiCall: () => Promise<Result<T, ApiError>>,
  dependencies: unknown[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const result = await apiCall();

      if (!isCancelled) {
        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          setData(null);
          setError(result.error);
        }
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, dependencies);

  return { data, error, loading };
};
```

### User管理画面例

```typescript
// packages/frontend/app/routes/users._index.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi } from '@/shared/hooks/use-api';
import { apiClient } from '@/lib/api-client';
import { User } from '@app/shared/api-types';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, error, loading } = useApi(
    () => apiClient.getUsers(page, 10),
    [page]
  );

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error.message}</div>;
  if (!data) return <div>データが見つかりません</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ユーザー管理</h1>
        <Button>新規ユーザー</Button>
      </div>

      <div className="grid gap-4">
        {data.users.map((user: User) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>メール: {user.email}</p>
              <p>ロール: {user.role}</p>
              <p>ステータス: {user.isActive ? '有効' : '無効'}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <Button 
          variant="outline" 
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          前へ
        </Button>
        <span className="flex items-center px-4">
          {page} / {Math.ceil(data.total / 10)}
        </span>
        <Button 
          variant="outline"
          disabled={page * 10 >= data.total}
          onClick={() => setPage(page + 1)}
        >
          次へ
        </Button>
      </div>
    </div>
  );
}
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

  backend:
    build: ./packages/backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://dev:password@postgres:5432/app_dev
      NODE_ENV: development
    depends_on:
      - postgres
    volumes:
      - ./packages/backend:/app
      - /app/node_modules

  frontend:
    build: ./packages/frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:3001/api
    volumes:
      - ./packages/frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

### 開発スクリプト

```json
{
  "scripts": {
    "dev": "docker-compose up -d && npm run dev:frontend & npm run dev:backend",
    "dev:frontend": "cd packages/frontend && npm run dev",
    "dev:backend": "cd packages/backend && npm run dev",
    "build": "npm run build:shared && npm run build:backend && npm run build:frontend",
    "build:shared": "cd packages/shared && npm run build",
    "build:backend": "cd packages/backend && npm run build", 
    "build:frontend": "cd packages/frontend && npm run build",
    "test": "npm run test:shared && npm run test:backend && npm run test:frontend",
    "test:shared": "cd packages/shared && npm test",
    "test:backend": "cd packages/backend && npm test",
    "test:frontend": "cd packages/frontend && npm test",
    "typecheck": "npm run typecheck:shared && npm run typecheck:backend && npm run typecheck:frontend",
    "typecheck:shared": "cd packages/shared && npm run typecheck",
    "typecheck:backend": "cd packages/backend && npm run typecheck",
    "typecheck:frontend": "cd packages/frontend && npm run typecheck"
  }
}
```

## 📋 Claude Code実行チェックリスト

### 初期設定完了確認
- [ ] ワークスペース構造が正しく作成されている
- [ ] 共通パッケージがビルドできる
- [ ] バックエンドサーバーが起動する
- [ ] フロントエンドが起動する
- [ ] PostgreSQLに接続できる

### API統合確認
- [ ] バックエンドAPIエンドポイントが動作する
- [ ] フロントエンドからAPIを呼び出せる
- [ ] Result型でエラーハンドリングされている
- [ ] 型安全性が保たれている

### 品質確認
- [ ] 全パッケージで`npm run typecheck`がエラー0個
- [ ] 全パッケージで`npm run lint`がエラー0個
- [ ] 全パッケージで`npm test`が通る
- [ ] `npm run build`が成功する

## 🔗 関連ガイド

- [共通実践ガイド](./shared/README.md): 基盤アーキテクチャ
- [フロントエンド設定ガイド](./frontend/react-router-v7-setup.md): React Router v7詳細
- [バックエンド設定ガイド](./backend/node-typescript-setup.md): Express + Prisma詳細
- [テスト駆動開発ガイド](./shared/test-driven-development.md): TDD実践方法

---

**重要**: このガイドに従うことで、型安全で保守性の高いフルスタックアプリケーションが構築できます。Claude Codeは各段階で品質チェックを実行し、エラー0個を維持してください。