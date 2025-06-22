# Node.js + TypeScript バックエンド設定ガイド

このガイドは、Express + Prismaを使用したバックエンドプロジェクトの初期設定を提供します。関数型TypeScriptアプローチとResult型を活用した高品質なAPIサーバーを構築できます。

## 🚀 プロジェクト初期化

### Node.js + TypeScript + Express

Claude Codeは以下の手順で**必ず**プロジェクトを初期化してください：

```bash
# 1. プロジェクト作成
mkdir my-backend-api
cd my-backend-api

# 2. package.json初期化
npm init -y

# 3. TypeScript環境構築
npm install -D typescript @types/node ts-node nodemon
npm install -D @types/express

# 4. Express本体のインストール
npm install express

# 5. TypeScript設定ファイル作成
npx tsc --init
```

### 追加依存関係のインストール

```bash
# 6. Prisma ORM
npm install prisma @prisma/client
npm install -D prisma

# 7. セキュリティ・ミドルウェア
npm install helmet cors dotenv
npm install -D @types/cors

# 8. バリデーション
npm install zod

# 9. テスト環境
npm install -D vitest supertest @types/supertest
npm install -D @testing-library/jest-dom

# 10. コード品質ツール
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D eslint-plugin-unused-imports eslint-plugin-import

# 11. 開発ユーティリティ
npm install -D @types/bcrypt bcrypt
npm install jsonwebtoken @types/jsonwebtoken
```

## 📁 推奨ディレクトリ構造

Express + Prisma構成では以下の構造を推奨します：

```
my-backend-api/
├── src/
│   ├── features/
│   │   └── [feature-name]/
│   │       ├── controllers/       # HTTP request handlers
│   │       │   ├── __tests__/
│   │       │   └── [feature]-controller.ts
│   │       ├── services/          # Business logic layer
│   │       │   ├── __tests__/
│   │       │   └── functional-[feature]-service.ts
│   │       ├── repositories/      # Data access layer
│   │       │   ├── __tests__/
│   │       │   ├── [feature]-repository.ts
│   │       │   └── prisma-[feature]-repository.ts
│   │       ├── lib/               # Pure functions & utilities
│   │       │   ├── __tests__/
│   │       │   ├── business-logic.ts
│   │       │   ├── validation.ts
│   │       │   └── index.ts
│   │       ├── routes/            # Express route definitions
│   │       │   ├── __tests__/
│   │       │   └── [feature]-routes.ts
│   │       └── types.ts           # Feature-specific types
│   ├── shared/
│   │   ├── middleware/            # Express middleware
│   │   │   ├── error-handler.ts
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── result.ts         # Result<T, E> type
│   │   │   ├── errors.ts         # Error types
│   │   │   ├── api.ts            # API response types
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── result-helpers.ts # Result operation helpers
│   │   │   ├── password.ts       # Password hashing utilities
│   │   │   ├── jwt.ts            # JWT utilities
│   │   │   └── index.ts
│   │   └── config/
│   │       ├── database.ts       # Database configuration
│   │       ├── env.ts            # Environment variables
│   │       └── index.ts
│   ├── app.ts                     # Express app configuration
│   └── server.ts                  # Server entry point
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Database seeding
├── tests/
│   ├── setup.ts                  # Test setup
│   └── helpers/                  # Test utilities
├── package.json
├── tsconfig.json
├── vitest.config.ts              # Test configuration
├── eslint.config.js              # ESLint configuration
├── prettier.config.js            # Prettier configuration
├── .env.example                  # Environment variables template
└── .env                          # Environment variables (gitignored)
```

## 📄 必須設定ファイル

### package.json

```json
{
  "name": "my-backend-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon --exec ts-node --esm src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:coverage": "vitest --coverage",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:reset": "prisma migrate reset",
    "db:seed": "ts-node --esm prisma/seed.ts"
  },
  "dependencies": {
    "express": "^4.18.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "zod": "^3.22.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "@types/cors": "^2.8.0",
    "@types/bcrypt": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0",
    "vitest": "^1.0.0",
    "supertest": "^6.3.0",
    "@types/supertest": "^6.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.55.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "eslint-plugin-unused-imports": "^3.0.0",
    "eslint-plugin-import": "^2.29.0",
    "prettier": "^3.1.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*", "tests/**/*", "prisma/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### prisma/schema.prisma

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model BucketItem {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("bucket_items")
}
```

### .env.example

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:5173"
```

## 🧩 必須コンポーネントテンプレート

### Result型定義

```typescript
// src/shared/types/result.ts
export type Result<T, E = Error> = Success<T> | Failure<E>;

export interface Success<T> {
  readonly success: true;
  readonly data: T;
}

export interface Failure<E> {
  readonly success: false;
  readonly error: E;
}

// Type Guards
export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> =>
  result.success === true;

export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> =>
  result.success === false;

// Constructors
export const success = <T>(data: T): Success<T> => ({
  success: true,
  data,
});

export const failure = <E>(error: E): Failure<E> => ({
  success: false,
  error,
});
```

### API エラー型定義

```typescript
// src/shared/types/errors.ts
export interface ApiError {
  readonly type: string;
  readonly message: string;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;
}

export interface ValidationError extends ApiError {
  readonly type: 'ValidationError';
  readonly statusCode: 400;
  readonly field?: string;
}

export interface NotFoundError extends ApiError {
  readonly type: 'NotFoundError';
  readonly statusCode: 404;
  readonly resource: string;
  readonly id: string;
}

export interface UnauthorizedError extends ApiError {
  readonly type: 'UnauthorizedError';
  readonly statusCode: 401;
}

export interface DatabaseError extends ApiError {
  readonly type: 'DatabaseError';
  readonly statusCode: 500;
  readonly operation: string;
}

// Error Constructors
export const validationError = (
  message: string,
  field?: string,
  details?: Record<string, unknown>
): ValidationError => ({
  type: 'ValidationError',
  message,
  statusCode: 400,
  field,
  details,
});

export const notFoundError = (
  resource: string,
  id: string,
  message?: string
): NotFoundError => ({
  type: 'NotFoundError',
  statusCode: 404,
  resource,
  id,
  message: message || `${resource} with id ${id} not found`,
});

export const unauthorizedError = (message = 'Unauthorized'): UnauthorizedError => ({
  type: 'UnauthorizedError',
  message,
  statusCode: 401,
});

export const databaseError = (
  operation: string,
  message: string,
  details?: Record<string, unknown>
): DatabaseError => ({
  type: 'DatabaseError',
  operation,
  message,
  statusCode: 500,
  details,
});
```

### Express エラーハンドラー

```typescript
// src/shared/middleware/error-handler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/errors.js';

export const errorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ApiError型の場合
  if ('statusCode' in error) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        type: error.type,
        message: error.message,
        ...(error.details && { details: error.details }),
      },
    });
  }

  // 一般的なError型の場合
  console.error('Unexpected error:', error);
  return res.status(500).json({
    success: false,
    error: {
      type: 'InternalServerError',
      message: 'An unexpected error occurred',
    },
  });
};
```

### Repository Pattern実装

```typescript
// src/features/users/repositories/user-repository.ts
import { Result } from '../../../shared/types/result.js';
import { ApiError } from '../../../shared/types/errors.js';
import { User, UserCreate, UserUpdate } from '../types.js';

export interface UserRepository {
  findAll(): Promise<Result<User[], ApiError>>;
  findById(id: string): Promise<Result<User, ApiError>>;
  findByEmail(email: string): Promise<Result<User, ApiError>>;
  create(user: UserCreate): Promise<Result<User, ApiError>>;
  update(id: string, user: UserUpdate): Promise<Result<User, ApiError>>;
  delete(id: string): Promise<Result<void, ApiError>>;
}
```

```typescript
// src/features/users/repositories/prisma-user-repository.ts
import { PrismaClient } from '@prisma/client';
import { UserRepository } from './user-repository.js';
import { success, failure } from '../../../shared/types/result.js';
import { databaseError, notFoundError } from '../../../shared/types/errors.js';

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return success(users);
    } catch (error) {
      return failure(databaseError('findAll', String(error)));
    }
  }

  async findById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return failure(notFoundError('User', id));
      }

      return success(user);
    } catch (error) {
      return failure(databaseError('findById', String(error)));
    }
  }

  // 他のメソッドも同様にResult型を返すよう実装
}
```

### 関数型Service Layer

```typescript
// src/features/users/services/functional-user-service.ts
import { UserRepository } from '../repositories/user-repository.js';
import { Result, success, failure } from '../../../shared/types/result.js';
import { ApiError } from '../../../shared/types/errors.js';
import { User, UserCreate, UserUpdate } from '../types.js';
import { validateUserCreate } from '../lib/validation.js';

// 高階関数：Repository依存のService関数を生成
export const createUser = (repository: UserRepository) => 
  async (data: Partial<UserCreate>): Promise<Result<User, ApiError>> => {
    // バリデーション
    const validationResult = validateUserCreate(data);
    if (!validationResult.success) {
      return failure(validationResult.error);
    }

    // リポジトリ操作
    return await repository.create(validationResult.data);
  };

export const getUserById = (repository: UserRepository) =>
  async (id: string): Promise<Result<User, ApiError>> => {
    return await repository.findById(id);
  };

export const getAllUsers = (repository: UserRepository) =>
  async (): Promise<Result<User[], ApiError>> => {
    return await repository.findAll();
  };

// Service Factory：依存関係を注入したService関数群を返す
export const createUserService = (repository: UserRepository) => ({
  createUser: createUser(repository),
  getUserById: getUserById(repository),
  getAllUsers: getAllUsers(repository),
});
```

### Express Controller

```typescript
// src/features/users/controllers/user-controller.ts
import { Request, Response, NextFunction } from 'express';
import { createUserService } from '../services/functional-user-service.js';
import { PrismaUserRepository } from '../repositories/prisma-user-repository.js';
import { prisma } from '../../../shared/config/database.js';

const userRepository = new PrismaUserRepository(prisma);
const userService = createUserService(userRepository);

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getAllUsers();

    if (!result.success) {
      return next(result.error);
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await userService.getUserById(id);

    if (!result.success) {
      return next(result.error);
    }

    res.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};
```

## 🔄 初期化後の必須実行手順

### Step 1: データベース設定

```bash
# Prisma初期化
npx prisma init

# データベース作成・マイグレーション
npx prisma migrate dev --name init

# Prismaクライアント生成
npx prisma generate
```

### Step 2: 品質チェック

```bash
# TypeScript型チェック
npm run typecheck

# ESLint実行
npm run lint

# テスト実行
npm test
```

### Step 3: 開発サーバー起動

```bash
# 開発サーバー起動
npm run dev

# APIエンドポイント確認
curl http://localhost:3000/api/health
```

### Step 4: ビルド確認

```bash
# 本番ビルド
npm run build

# ビルド結果確認
ls -la dist/
```

## 🧪 API テスト例

```typescript
// src/features/users/controllers/__tests__/user-controller.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../../../app.js';

describe('User Controller', () => {
  beforeEach(async () => {
    // テスト前のデータベースリセット
    await prisma.user.deleteMany();
  });

  it('ユーザー一覧取得：正常系', async () => {
    // テストデータ作成
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
      },
    });

    const response = await request(app)
      .get('/api/users')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].email).toBe('test@example.com');
  });

  it('ユーザー取得：存在しないIDの場合、NotFoundErrorが返されること', async () => {
    const response = await request(app)
      .get('/api/users/non-existent-id')
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error.type).toBe('NotFoundError');
  });
});
```

## 📚 関連ガイド

### 必須の共通実践
- [開発ワークフローガイド](../shared/development-workflow.md): Git戦略、TDDサイクル
- [関数型TypeScriptアーキテクチャガイド](../shared/functional-typescript-architecture.md): Result型、Repository Pattern
- [テスト駆動開発ガイド](../shared/test-driven-development.md): TDD実践、日本語テストケース

### バックエンド全体
- [バックエンド開発ガイド](./README.md): バックエンド開発の全体像

---

**重要**: Express + Prismaの組み合わせは、型安全で保守性の高いAPIサーバーを構築するための実証済みアプローチです。Result型とRepository Patternを活用することで、エラーハンドリングが明確で、テストしやすいコードベースを実現できます。