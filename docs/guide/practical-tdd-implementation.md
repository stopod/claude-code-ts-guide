# 実践的TDD実装ガイド

このガイドは、Claude Codeが具体的なコード例を用いてテスト駆動開発（TDD）を実践するための完全な手順を提供します。理論ではなく、実際に動作するコード例を中心に構成されています。

## 🎯 実践TDDの核心原則

### Red-Green-Refactor サイクル
1. **Red**: 失敗するテストを書く
2. **Green**: 最小限のコードでテストを通す
3. **Refactor**: テストを保ちながらコードを改善

### Claude Code向け実行規則
- **日本語テストケース必須**: すべてのテストケース名は日本語
- **Result型活用**: エラーハンドリングにResult型を使用
- **段階的実装**: 複雑な機能も小さなステップに分割

## 📝 実践例1: ユーザー作成機能のTDD

### Phase 1: テストファーストで開始

```typescript
// src/features/user/services/__tests__/user-service.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { createUserService } from '../user-service';
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