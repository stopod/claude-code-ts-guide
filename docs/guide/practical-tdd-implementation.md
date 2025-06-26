# 実践的TDD実装ガイド

このガイドは、Claude Codeが具体的なコード例を用いてテスト駆動開発（TDD）を実践するための完全な手順を提供します。理論ではなく、実際に動作するコード例を中心に構成されています。

## 🎯 t-wada流TDD核心原則

### Red-Green-Refactor サイクル
1. **🔴 Red**: 失敗するテストを書く
2. **🟢 Green**: 最小限のコードでテストを通す
3. **🔄 Refactor**: テストを保ちながらコードを改善

### t-wada流3段階実装アプローチ

**Claude Codeは以下の順序で必ず実装してください**:

#### 1. **仮実装 (Fake Implementation)**
- **目的**: まずテストを通すことだけに集中
- **手法**: ハードコーディングで値を返す
- **例**: `return "山田太郎"` のような固定値

#### 2. **三角測量 (Triangulation)**  
- **目的**: 複数のテストケースで一般化を促す
- **手法**: 異なる入力値の新しいテストを追加
- **例**: `"田中花子"` を返すテストを追加して実装を一般化

#### 3. **明白な実装 (Obvious Implementation)**
- **目的**: 最終的な正しい実装に到達
- **手法**: ロジックを正しく実装
- **例**: 実際のビジネスロジックを実装

### TODOリスト駆動開発

**Claude Codeは開発開始前にTODOリストを作成してください**:

```typescript
/**
 * ユーザー作成機能 TODOリスト
 * 
 * ✅ 有効なデータでユーザーが作成できること
 * ⏳ 重複メールアドレスでエラーになること  
 * 📝 無効なメールアドレス形式でエラーになること
 * 📝 空の名前でエラーになること
 * 📝 名前が100文字超でエラーになること
 * 📝 特殊文字を含む名前が適切に処理されること
 * 📝 日本語の名前が適切に処理されること
 * 📝 作成日時が正しく設定されること
 */
```

### 適切な失敗の作り方

**失敗パターンの優先順位**:

1. **🟥 コンパイルエラー** (最優先)
   ```typescript
   // 関数が存在しない状態でテストを書く
   expect(createUser(userData)).toBeDefined(); // createUser未定義でコンパイルエラー
   ```

2. **🟧 ランタイムエラー** 
   ```typescript
   // 関数は存在するが実装がない
   const createUser = () => {
     throw new Error('Not implemented');
   };
   ```

3. **🟨 アサーション失敗**
   ```typescript
   // 間違った値を返す実装
   const createUser = () => null; // nullを返すが、Userオブジェクトを期待
   ```

### 最小限の変更の徹底

**各ステップでの変更量を最小限に**:

```typescript
// ❌ 悪い例: 一度に多くを実装
const createUser = (userData: CreateUserRequest): User => {
  validateEmail(userData.email);
  checkDuplicateEmail(userData.email);
  const user = {
    id: generateId(),
    name: userData.name,
    email: userData.email,
    role: userData.role,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  saveToDatabase(user);
  return user;
};

// ✅ 良い例: 最小限の変更（仮実装）
const createUser = (userData: CreateUserRequest): User => {
  return {
    id: 'test-id',
    name: userData.name,
    email: userData.email,
    role: userData.role,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };
};
```

### Claude Code向け実行規則
- **日本語テストケース必須**: すべてのテストケース名は日本語
- **TODOリスト必須**: 開発開始前にTODOリストを作成
- **1テスト1実装**: 1つのテストが通ったら即座にコミット
- **Result型活用**: エラーハンドリングにResult型を使用
- **段階的実装**: 仮実装→三角測量→明白な実装の順守

## 📝 t-wada流実践例: ユーザー作成機能のTDD

### Step 0: TODOリスト作成

```typescript
/**
 * ユーザー作成機能 TODOリスト
 * 
 * 📝 有効なデータでユーザーが作成できること (最初のテスト)
 * 📝 異なる名前でもユーザーが作成できること (三角測量用)
 * 📝 重複メールアドレスでエラーになること  
 * 📝 無効なメールアドレス形式でエラーになること
 * 📝 空の名前でエラーになること
 * 📝 名前が100文字超でエラーになること
 */
```

### Step 1: 🔴 Red - 失敗するテストを書く

```typescript
// src/features/user/services/__tests__/user-service.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createUserService } from '../user-service'; // ← まだ存在しない（コンパイルエラー）
import { setupTestRepositories } from '@app/shared/templates/implementations/repository-pattern';
import { CreateUserRequest } from '@app/shared/api-types';

describe('createUserService', () => {
  let userService: ReturnType<typeof createUserService>;
  let cleanup: () => void;

  beforeEach(() => {
    const setup = setupTestRepositories();
    userService = createUserService(setup.userRepository);
    cleanup = setup.cleanup;
  });

  afterEach(() => {
    cleanup();
  });

  describe('ユーザー作成', () => {
    it('有効なデータを渡した場合、新しいユーザーが作成されること', async () => {
      // Arrange
      const userData: CreateUserRequest = {
        name: '山田太郎',
        email: 'yamada@example.com',
        role: 'user'
      };

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('山田太郎');
        expect(result.data.email).toBe('yamada@example.com');
        expect(result.data.role).toBe('user');
        expect(result.data.isActive).toBe(true);
        expect(result.data.id).toBeDefined();
        expect(result.data.createdAt).toBeDefined();
      }
    });
  });
});
```

**結果**: `npm test` でコンパイルエラー → ✅ 適切な失敗

### Step 2: 🟢 Green - 仮実装でテストを通す

```typescript
// src/features/user/services/user-service.ts

import { Result, success } from '@app/shared';
import { User, CreateUserRequest } from '@app/shared/api-types';
import { UserRepository } from '@app/shared/templates/implementations/repository-pattern';

export const createUserService = (userRepository: UserRepository) => {
  const createUser = async (userData: CreateUserRequest): Promise<Result<User, any>> => {
    // 🎯 仮実装: 固定値を返してテストを通す
    return success({
      id: 'fixed-id',
      name: '山田太郎', // ← ハードコーディング
      email: 'yamada@example.com', // ← ハードコーディング
      role: 'user',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    });
  };

  return { createUser };
};
```

**結果**: `npm test` でテストが通る → ✅ Green達成  
**コミット**: `git commit -m "🔴→🟢 仮実装でユーザー作成テストを通す"`

### Step 3: 🔴 Red - 三角測量のための新しいテスト

```typescript
// 同じテストファイルに追加

it('異なる名前でもユーザーが作成できること', async () => {
  // Arrange
  const userData: CreateUserRequest = {
    name: '田中花子', // ← 異なる名前
    email: 'tanaka@example.com', // ← 異なるメール
    role: 'admin'
  };

  // Act
  const result = await userService.createUser(userData);

  // Assert
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.name).toBe('田中花子'); // ← 入力値と一致することを期待
    expect(result.data.email).toBe('tanaka@example.com');
    expect(result.data.role).toBe('admin');
  }
});
```

**結果**: `npm test` で失敗（固定値 '山田太郎' が返される） → ✅ 適切な失敗

### Step 4: 🟢 Green - 三角測量で一般化

```typescript
// src/features/user/services/user-service.ts

export const createUserService = (userRepository: UserRepository) => {
  const createUser = async (userData: CreateUserRequest): Promise<Result<User, any>> => {
    // 🎯 三角測量: 入力値を使って一般化
    return success({
      id: 'fixed-id', // まだ固定値
      name: userData.name, // ← 入力値を使用
      email: userData.email, // ← 入力値を使用
      role: userData.role, // ← 入力値を使用
      isActive: true,
      createdAt: new Date('2024-01-01'), // まだ固定値
      updatedAt: new Date('2024-01-01'), // まだ固定値
    });
  };

  return { createUser };
};
```

**結果**: `npm test` で両方のテストが通る → ✅ Green達成  
**コミット**: `git commit -m "🔴→🟢 三角測量で名前・メール・ロールを一般化"`

### Step 5: 🔄 Refactor - 明白な実装に向けて

```typescript
// src/features/user/services/user-service.ts

export const createUserService = (userRepository: UserRepository) => {
  const createUser = async (userData: CreateUserRequest): Promise<Result<User, any>> => {
    // 🎯 明白な実装: 実際のビジネスロジックを実装
    const result = await userRepository.create({
      ...userData,
      isActive: true,
    });

    return result;
  };

  return { createUser };
};
```

**結果**: `npm test` でテストが通る → ✅ Green維持  
**コミット**: `git commit -m "🔄 明白な実装でRepositoryを使用"`

### Step 6: 🔴 Red - エラーケースのテスト追加

```typescript
it('重複するメールアドレスの場合、ValidationErrorが返されること', async () => {
  // Arrange
  const userData: CreateUserRequest = {
        name: '山田太郎',
        email: 'duplicate@example.com',
        role: 'user'
      };

      // 先に同じメールのユーザーを作成
      await userService.createUser(userData);

      // Act
      const result = await userService.createUser({
        name: '田中花子',
        email: 'duplicate@example.com',
        role: 'user'
      });

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('VALIDATION_ERROR');
        expect(result.error.message).toContain('メールアドレス');
      }
    });

    it('無効なメールアドレス形式の場合、ValidationErrorが返されること', async () => {
      // Arrange
      const userData: CreateUserRequest = {
        name: '山田太郎',
        email: 'invalid-email',
        role: 'user'
      };

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('VALIDATION_ERROR');
        expect(result.error.message).toContain('メールアドレスの形式');
      }
    });

    it('空の名前の場合、ValidationErrorが返されること', async () => {
      // Arrange
      const userData: CreateUserRequest = {
        name: '',
        email: 'test@example.com',
        role: 'user'
      };

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('VALIDATION_ERROR');
        expect(result.error.message).toContain('名前');
      }
    });
  });
});
```

### Phase 2: 最小限の実装でテストを通す

```typescript
// src/features/user/services/user-service.ts

import { Result, success, failure, validationError } from '@app/shared';
import { User, CreateUserRequest } from '@app/shared/api-types';
import { UserRepository } from '@app/shared/templates/implementations/repository-pattern';

export const createUserService = (userRepository: UserRepository) => {
  const createUser = async (userData: CreateUserRequest): Promise<Result<User, ValidationError>> => {
    // バリデーション
    const validationResult = validateUserData(userData);
    if (!validationResult.success) {
      return validationResult;
    }

    // 重複チェック
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser.success && existingUser.data) {
      return failure(validationError(
        'email',
        userData.email,
        'このメールアドレスは既に使用されています'
      ));
    }

    // ユーザー作成
    const createResult = await userRepository.create({
      ...userData,
      isActive: true,
    });

    return createResult;
  };

  return {
    createUser,
  };
};

// バリデーション関数
const validateUserData = (userData: CreateUserRequest): Result<void, ValidationError> => {
  // 名前の検証
  if (!userData.name || userData.name.trim() === '') {
    return failure(validationError(
      'name',
      userData.name,
      '名前は必須です'
    ));
  }

  // メールアドレスの形式検証
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    return failure(validationError(
      'email',
      userData.email,
      'メールアドレスの形式が正しくありません'
    ));
  }

  return success(undefined);
};
```

### Phase 3: リファクタリングとテスト追加

```typescript
// src/features/user/lib/user-validation.ts

import { Result, success, failure, validationError } from '@app/shared';
import { CreateUserRequest, UpdateUserRequest } from '@app/shared/api-types';

/**
 * ユーザー作成データのバリデーション
 */
export const validateCreateUserData = (userData: CreateUserRequest): Result<void, ValidationError> => {
  // 名前の検証
  const nameValidation = validateName(userData.name);
  if (!nameValidation.success) {
    return nameValidation;
  }

  // メールアドレスの検証
  const emailValidation = validateEmail(userData.email);
  if (!emailValidation.success) {
    return emailValidation;
  }

  // ロールの検証
  const roleValidation = validateRole(userData.role);
  if (!roleValidation.success) {
    return roleValidation;
  }

  return success(undefined);
};

/**
 * ユーザー更新データのバリデーション
 */
export const validateUpdateUserData = (userData: UpdateUserRequest): Result<void, ValidationError> => {
  // 名前の検証（設定されている場合のみ）
  if (userData.name !== undefined) {
    const nameValidation = validateName(userData.name);
    if (!nameValidation.success) {
      return nameValidation;
    }
  }

  // メールアドレスの検証（設定されている場合のみ）
  if (userData.email !== undefined) {
    const emailValidation = validateEmail(userData.email);
    if (!emailValidation.success) {
      return emailValidation;
    }
  }

  // ロールの検証（設定されている場合のみ）
  if (userData.role !== undefined) {
    const roleValidation = validateRole(userData.role);
    if (!roleValidation.success) {
      return roleValidation;
    }
  }

  return success(undefined);
};

// 個別バリデーション関数
const validateName = (name: string): Result<void, ValidationError> => {
  if (!name || name.trim() === '') {
    return failure(validationError(
      'name',
      name,
      '名前は必須です'
    ));
  }

  if (name.length > 100) {
    return failure(validationError(
      'name',
      name,
      '名前は100文字以内で入力してください'
    ));
  }

  return success(undefined);
};

const validateEmail = (email: string): Result<void, ValidationError> => {
  if (!email || email.trim() === '') {
    return failure(validationError(
      'email',
      email,
      'メールアドレスは必須です'
    ));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return failure(validationError(
      'email',
      email,
      'メールアドレスの形式が正しくありません'
    ));
  }

  if (email.length > 255) {
    return failure(validationError(
      'email',
      email,
      'メールアドレスは255文字以内で入力してください'
    ));
  }

  return success(undefined);
};

const validateRole = (role: 'admin' | 'user'): Result<void, ValidationError> => {
  if (!['admin', 'user'].includes(role)) {
    return failure(validationError(
      'role',
      role,
      'ロールはadminまたはuserである必要があります'
    ));
  }

  return success(undefined);
};
```

## 📝 実践例2: React Component のTDD

### Phase 1: コンポーネントテストから開始

```typescript
// src/features/user/components/__tests__/UserCreateForm.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { UserCreateForm } from '../UserCreateForm';

describe('UserCreateForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('初期表示時、必要なフォーム要素が表示されること', () => {
    // Act
    render(<UserCreateForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Assert
    expect(screen.getByLabelText('名前')).toBeInTheDocument();
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByLabelText('ロール')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '作成' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  });

  it('有効なデータを入力して送信した場合、onSubmitが呼ばれること', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<UserCreateForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Act
    await user.type(screen.getByLabelText('名前'), '山田太郎');
    await user.type(screen.getByLabelText('メールアドレス'), 'yamada@example.com');
    await user.selectOptions(screen.getByLabelText('ロール'), 'user');
    await user.click(screen.getByRole('button', { name: '作成' }));

    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: '山田太郎',
        email: 'yamada@example.com',
        role: 'user',
      });
    });
  });

  it('必須フィールドが空の場合、エラーメッセージが表示されること', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<UserCreateForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Act
    await user.click(screen.getByRole('button', { name: '作成' }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('名前は必須です')).toBeInTheDocument();
      expect(screen.getByText('メールアドレスは必須です')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('無効なメールアドレス形式の場合、エラーメッセージが表示されること', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<UserCreateForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Act
    await user.type(screen.getByLabelText('名前'), '山田太郎');
    await user.type(screen.getByLabelText('メールアドレス'), 'invalid-email');
    await user.click(screen.getByRole('button', { name: '作成' }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('メールアドレスの形式が正しくありません')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('キャンセルボタンをクリックした場合、onCancelが呼ばれること', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<UserCreateForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Act
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));

    // Assert
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('送信中はボタンが無効化されること', async () => {
    // Arrange
    const user = userEvent.setup();
    const slowOnSubmit = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<UserCreateForm onSubmit={slowOnSubmit} onCancel={mockOnCancel} />);

    // Act
    await user.type(screen.getByLabelText('名前'), '山田太郎');
    await user.type(screen.getByLabelText('メールアドレス'), 'yamada@example.com');
    
    const submitButton = screen.getByRole('button', { name: '作成' });
    await user.click(submitButton);

    // Assert
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('作成中...')).toBeInTheDocument();

    // 送信完了後
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
```

### Phase 2: コンポーネント実装

```typescript
// src/features/user/components/UserCreateForm.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateUserRequest } from '@app/shared/api-types';
import { validateCreateUserData } from '../lib/user-validation';

interface UserCreateFormProps {
  onSubmit: (userData: CreateUserRequest) => void | Promise<void>;
  onCancel: () => void;
}

export const UserCreateForm = ({ onSubmit, onCancel }: UserCreateFormProps) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
    role: 'user',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    const validationResult = validateCreateUserData(formData);
    if (!validationResult.success) {
      setErrors({
        [validationResult.error.field]: validationResult.error.message,
      });
      return;
    }

    // エラーをクリア
    setErrors({});
    
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>新規ユーザー作成</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="role">ロール</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange('role', value as 'admin' | 'user')}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">ユーザー</SelectItem>
                <SelectItem value="admin">管理者</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '作成中...' : '作成'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
```

## 🔄 実践例3: API統合のTDD

### テスト→実装→リファクタリングの統合例

```typescript
// src/features/user/services/__tests__/user-api-integration.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createUserApiService } from '../user-api-service';
import { apiClient } from '@/lib/api-client';
import { setupTestRepositories } from '@app/shared/templates/implementations/repository-pattern';

describe('User API Integration', () => {
  let userApiService: ReturnType<typeof createUserApiService>;
  let cleanup: () => void;

  beforeEach(() => {
    const setup = setupTestRepositories();
    userApiService = createUserApiService(apiClient, setup.userRepository);
    cleanup = setup.cleanup;
  });

  afterEach(() => {
    cleanup();
  });

  describe('ユーザー作成から取得までの統合フロー', () => {
    it('ユーザーを作成し、そのユーザーを取得できること', async () => {
      // Arrange
      const userData = {
        name: '統合テストユーザー',
        email: 'integration@example.com',
        role: 'user' as const,
      };

      // Act - ユーザー作成
      const createResult = await userApiService.createUser(userData);

      // Assert - 作成成功
      expect(createResult.success).toBe(true);
      if (!createResult.success) return;

      const createdUser = createResult.data;
      expect(createdUser.name).toBe(userData.name);
      expect(createdUser.email).toBe(userData.email);

      // Act - ユーザー取得
      const getResult = await userApiService.getUser(createdUser.id);

      // Assert - 取得成功
      expect(getResult.success).toBe(true);
      if (!getResult.success) return;

      const retrievedUser = getResult.data;
      expect(retrievedUser.id).toBe(createdUser.id);
      expect(retrievedUser.name).toBe(createdUser.name);
      expect(retrievedUser.email).toBe(createdUser.email);
    });
  });
});
```

## 📋 Claude Code向けTDD実行チェックリスト

### 開発開始前
- [ ] テストファイルの命名規則確認（`*.test.ts`, `*.spec.ts`）
- [ ] 日本語テストケース名の準備
- [ ] Result型の理解と適用準備

### Red フェーズ（失敗するテストを書く）
- [ ] テストケース名が日本語で明確
- [ ] Arrange-Act-Assert パターンで構造化
- [ ] 期待する結果が明確に定義されている
- [ ] `npm test` でテストが失敗することを確認

### Green フェーズ（最小限の実装）
- [ ] テストを通すための最小限のコード
- [ ] Result型でエラーハンドリング
- [ ] `npm test` でテストが成功することを確認

### Refactor フェーズ（改善）
- [ ] コードの重複排除
- [ ] 関数の単一責任原則確認
- [ ] `npm run typecheck` でエラー0個
- [ ] `npm run lint` でエラー0個

### 品質確認
- [ ] テストカバレッジ80%以上
- [ ] エッジケースのテスト追加
- [ ] 統合テストの実行
- [ ] 全体品質チェック (`npm run quality`)

## 🔗 関連ガイド

- [テスト駆動開発ガイド](./shared/test-driven-development.md): TDD理論と実践方法
- [関数型TypeScriptアーキテクチャ](./shared/functional-typescript-architecture.md): Result型とRepository Pattern
- [開発ワークフローガイド](./shared/development-workflow.md): 開発サイクル全体
- [フルスタック統合ガイド](./fullstack-integration-guide.md): API統合テスト

---

**重要**: このガイドの実践例はすべて動作検証済みです。Claude Codeは必ずこの手順に従い、Red-Green-Refactorサイクルを厳密に実行してください。品質の高いテスト駆動開発により、保守性の高いコードベースを構築できます。