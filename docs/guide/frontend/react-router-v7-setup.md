# React Router v7 プロジェクト設定ガイド

このガイドは、React Router v7 Framework Modeを使用したフロントエンドプロジェクトの初期設定を提供します。関数型TypeScriptアプローチとResult型を活用した高品質なReactアプリケーションを構築できます。

## 🚀 プロジェクト初期化

### React Router v7 Framework Mode

Claude Codeは以下のコマンドで**必ず**プロジェクトを初期化してください：

```bash
# 1. React Router v7プロジェクト作成
npx create-react-router@latest my-frontend-app
cd my-frontend-app

# 2. 依存関係のインストール
npm install

# 3. 開発サーバー起動確認
npm run dev
```

### shadcn-ui統合セットアップ

```bash
# 4. shadcn-ui CLI初期化（推奨）
npx shadcn@latest init

# 初期化時の推奨設定:
# - Style: New York
# - Base color: Zinc
# - CSS variables: Yes
```

### 追加依存関係のインストール

#### 必須パッケージ（品質保証）

```bash
# 5. テスト環境（必須）
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D vitest jsdom @vitejs/plugin-react

# 6. TypeScript支援（必須）
npm install -D @types/node

# 7. コード品質ツール（必須）
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

#### 推奨パッケージ（追加機能）

```bash
# 8. 未使用コード検出（推奨）
npm install -D eslint-plugin-unused-imports eslint-plugin-import

# 9. 追加shadcn-ui関連（推奨）
npm install -D prettier-plugin-tailwindcss
```

### shadcn-uiコンポーネントの追加

#### 必須コンポーネント（開発開始時）

```bash
# 基本UIコンポーネント（必須）
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card

# 基本フォーム（必須）
npx shadcn@latest add form
npx shadcn@latest add label
```

#### 推奨コンポーネント（機能拡張時）

```bash
# 拡張UIコンポーネント
npx shadcn@latest add dialog
npx shadcn@latest add toast
npx shadcn@latest add select

# レイアウト関連
npx shadcn@latest add sheet
npx shadcn@latest add dropdown-menu
npx shadcn@latest add navigation-menu
```

## 📁 推奨ディレクトリ構造

React Router v7 + shadcn-ui構成では以下の構造を推奨します：

```
my-frontend-app/
├── app/
│   ├── components/
│   │   └── ui/                    # shadcn-ui components (自動生成)
│   ├── features/[feature-name]/   # 機能別モジュール
│   │   ├── components/            # 機能固有コンポーネント
│   │   ├── services/              # ビジネスロジック
│   │   ├── hooks/                 # カスタムhooks
│   │   └── lib/                   # 純粋関数・ユーティリティ
│   ├── lib/                       # グローバルユーティリティ
│   │   ├── utils.ts              # cn()等のヘルパー
│   │   └── api.ts                # API client
│   ├── routes/                    # React Router v7 routes
│   │   ├── _layout.tsx           # レイアウト
│   │   └── _index.tsx            # ホーム
│   ├── shared/                    # 共通モジュール
│   │   ├── types/result.ts       # Result<T, E> type
│   │   ├── hooks/                # 共通hooks
│   │   └── utils/                # 共通ユーティリティ
│   └── root.tsx                   # Root component
├── components.json                # shadcn-ui設定
├── tailwind.config.js            # Tailwind + shadcn-ui設定
└── (その他設定ファイル)
```

<details>
<summary>📂 詳細なディレクトリ構造（クリックして展開）</summary>

```
my-frontend-app/
├── app/
│   ├── components/
│   │   └── ui/                    # shadcn-ui components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       └── index.ts
│   ├── features/
│   │   └── [feature-name]/
│   │       ├── components/        # Feature-specific components
│   │       │   ├── __tests__/
│   │       │   └── index.ts
│   │       ├── services/          # Business logic layer
│   │       │   ├── __tests__/
│   │       │   └── functional-[feature]-service.ts
│   │       ├── lib/               # Pure functions & utilities
│   │       │   ├── __tests__/
│   │       │   ├── business-logic.ts
│   │       │   ├── schemas.ts
│   │       │   └── index.ts
│   │       ├── hooks/             # Custom React hooks
│   │       │   ├── __tests__/
│   │       │   └── index.ts
│   │       └── types.ts           # Feature-specific types
│   ├── lib/                       # Global utilities
│   │   ├── utils.ts              # Utility functions
│   │   └── cn.ts                 # Class name utility
│   ├── routes/                    # React Router v7 routes
│   │   ├── _layout.tsx           # Root layout
│   │   ├── _index.tsx            # Home page
│   │   └── [feature]/
│   │       ├── index.tsx
│   │       └── [id].tsx
│   ├── shared/                    # Shared modules
│   │   ├── hooks/
│   │   │   ├── __tests__/
│   │   │   ├── use-async-operation.ts
│   │   │   ├── use-result-operation.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   ├── result.ts         # Result<T, E> type
│   │   │   ├── errors.ts         # Error types
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── result-helpers.ts # Result operation helpers
│   │       └── index.ts
│   ├── root.tsx                   # Root component
│   └── routes.ts                  # Route configuration
├── public/                        # Static assets
├── components.json                # shadcn-ui configuration
├── package.json
├── tsconfig.json
├── vite.config.ts                # Vite configuration
├── vitest.config.ts              # Test configuration
├── eslint.config.js              # ESLint configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── prettier.config.js            # Prettier configuration
└── test-setup.ts                 # Test setup file
```
</details>

## 📄 必須設定ファイル

### package.json

```json
{
  "name": "my-frontend-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build",
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router": "^7.6.2",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.462.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@types/node": "^22.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@react-router/dev": "^7.6.2",
    "eslint": "^9.0.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.2.0",
    "eslint-plugin-unused-imports": "^4.0.0",
    "eslint-plugin-import": "^2.30.0",
    "prettier": "^3.3.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "vitest": "^2.0.0",
    "jsdom": "^25.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/user-event": "^14.5.0"
  }
}
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test-setup.ts',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        'build/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
      '~': path.resolve(__dirname, './app'),
    },
  },
})
```

### test-setup.ts

```typescript
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// テスト終了後のクリーンアップ
afterEach(() => {
  cleanup()
})

// カスタムマッチャーの追加
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received != null
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
      pass,
    }
  },
})
```

## 🧩 必須コンポーネントテンプレート

### Result型定義

```typescript
// app/shared/types/result.ts
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

### Result対応React Hook

```typescript
// app/shared/hooks/use-result-operation.ts
import { useState, useCallback } from 'react';
import { Result, isSuccess, isFailure } from '../types/result';

export interface UseResultOperationState<T, E> {
  data: T | null;
  error: E | null;
  loading: boolean;
}

export const useResultOperation = <T, E>() => {
  const [state, setState] = useState<UseResultOperationState<T, E>>({
    data: null,
    error: null,
    loading: false,
  });

  const execute = useCallback(
    async (operation: () => Promise<Result<T, E>>) => {
      setState({ data: null, error: null, loading: true });

      try {
        const result = await operation();

        if (isSuccess(result)) {
          setState({ data: result.data, error: null, loading: false });
          return result.data;
        } else {
          setState({ data: null, error: result.error, loading: false });
          throw result.error;
        }
      } catch (error) {
        const errorValue = error as E;
        setState({ data: null, error: errorValue, loading: false });
        throw error;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false });
  }, []);

  return {
    ...state,
    execute,
    reset,
    isLoading: state.loading,
    hasError: state.error !== null,
    hasData: state.data !== null,
  };
};
```

### Button Component (shadcn-ui style)

```typescript
// app/components/ui/button.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

## 🔄 初期化後の必須実行手順

Claude Codeは以下の手順を**必ず順番に**実行してください：

### Step 1: 依存関係確認

```bash
# 1. インストール確認
npm install

# 2. バージョン確認
node --version  # v18以上推奨
npm --version   # v9以上推奨
```

### Step 2: 品質チェック（必須）

```bash
# 3. TypeScript型チェック（エラー0個必須）
npm run typecheck

# 4. ESLint実行（エラー0個必須）
npm run lint

# 5. 自動修正可能なものを修正
npm run lint:fix

# 6. Prettierフォーマット確認
npm run format:check

# 7. 自動フォーマット実行
npm run format
```

### Step 3: テスト実行（必須）

```bash
# 8. テスト実行（すべてパス必須）
npm test

# 9. テストカバレッジ確認
npm run test:coverage
```

### Step 4: 開発サーバー起動

```bash
# 10. 開発サーバー起動
npm run dev

# 11. ブラウザで http://localhost:5173 にアクセス
# React Router v7の初期画面が表示されることを確認
```

### Step 5: ビルド確認（必須）

```bash
# 12. 本番ビルド（成功必須）
npm run build

# 13. ビルド結果確認
ls -la build/
```

**重要**: すべてのステップでエラーが0個であることを確認してから次に進んでください。

## 🎯 React Router v7 特化の開発フロー

### 1. ルーティング設計

```typescript
// app/routes.ts
import type { RouteConfig } from "@react-router/dev/routes";

export default [
  {
    path: "/",
    file: "routes/_layout.tsx",
    children: [
      { index: true, file: "routes/_index.tsx" },
      { path: "about", file: "routes/about.tsx" },
      {
        path: "users",
        children: [
          { index: true, file: "routes/users/index.tsx" },
          { path: ":id", file: "routes/users/[id].tsx" },
        ],
      },
    ],
  },
] satisfies RouteConfig;
```

### 2. データローディング (Loader)

```typescript
// app/routes/users/index.tsx
import { data } from "react-router";
import type { Route } from "./+types";

export async function loader({ request }: Route.LoaderArgs) {
  // Result型でのデータ取得
  const usersResult = await getUsersService.getAll();
  
  if (!usersResult.success) {
    throw data(
      { message: "Failed to load users" },
      { status: 500 }
    );
  }

  return { users: usersResult.data };
}

export default function UsersPage({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Users</h1>
      {loaderData.users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### 3. フォームアクション

```typescript
// app/routes/users/create.tsx
import { redirect, data } from "react-router";
import type { Route } from "./+types";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  
  const createResult = await userService.create({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
  });

  if (!createResult.success) {
    return data(
      { error: createResult.error.message },
      { status: 400 }
    );
  }

  return redirect("/users");
}
```

## 📚 関連ガイド

### 必須の共通実践
- [開発ワークフローガイド](../shared/development-workflow.md): Git戦略、TDDサイクル
- [関数型TypeScriptアーキテクチャガイド](../shared/functional-typescript-architecture.md): Result型、Repository Pattern
- [テスト駆動開発ガイド](../shared/test-driven-development.md): TDD実践、日本語テストケース

### フロントエンド全体
- [フロントエンド開発ガイド](./README.md): フロントエンド開発の全体像

---

**重要**: React Router v7 Framework Modeは、従来のVite + Reactセットアップよりも統合された開発体験を提供します。SSR、データローディング、最適化が組み込まれているため、このガイドに従って設定することで、高性能なReactアプリケーションを構築できます。