# 実践的TDD実装ガイド

このガイドは、Claude Codeが具体的なコード例を用いてテスト駆動開発（TDD）を実践するための完全な手順を提供します。理論ではなく、実際に動作するコード例を中心に構成されています。

## t-wada流TDD核心原則

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

## t-wada流実践例: ユーザー作成機能のTDD

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
    email: 'duplicate@example.com', // 同じメール
    role: 'user'
  });

  // Assert
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.code).toBe('VALIDATION_ERROR');
    expect(result.error.message).toContain('メールアドレス');
  }
});
```

## t-wada流テスト設計の科学

### 境界値分析の実践

**境界値分析**は、入力の境界となる値でテストする手法です。t-wadaさんが重視する「なぜそのテストケースなのか」を明確にする技法です。

#### 実践例1: 文字列長の境界値分析

```typescript
describe('ユーザー名のバリデーション', () => {
  // 境界値の定義
  const MIN_LENGTH = 1;
  const MAX_LENGTH = 100;
  
  describe('🔬 境界値分析: 文字列長', () => {
    // 有効な境界値
    it.each([
      [MIN_LENGTH, 'a'], // 最小値
      [MAX_LENGTH, 'a'.repeat(100)], // 最大値
      [50, 'a'.repeat(50)], // 中央値
    ])('名前が%i文字の場合、正常に作成されること: "%s"', async (length, name) => {
      // Arrange
      const userData: CreateUserRequest = {
        name,
        email: `user${length}@example.com`,
        role: 'user'
      };

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe(name);
      }
    });

    // 無効な境界値
    it.each([
      [0, ''], // 最小値未満
      [101, 'a'.repeat(101)], // 最大値超過
    ])('名前が%i文字の場合、ValidationErrorになること: "%s"', async (length, name) => {
      // Arrange
      const userData: CreateUserRequest = {
        name,
        email: `user${length}@example.com`,
        role: 'user'
      };

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('VALIDATION_ERROR');
        expect(result.error.field).toBe('name');
      }
    });
  });
});
```

#### 実践例2: 数値範囲の境界値分析

```typescript
describe('年齢フィールドのバリデーション', () => {
  const MIN_AGE = 18;
  const MAX_AGE = 120;

  describe('🔬 境界値分析: 年齢', () => {
    it.each([
      [MIN_AGE - 1, false, '最小値未満'],
      [MIN_AGE, true, '最小値'],
      [MIN_AGE + 1, true, '最小値+1'],
      [MAX_AGE - 1, true, '最大値-1'],
      [MAX_AGE, true, '最大値'],
      [MAX_AGE + 1, false, '最大値超過'],
    ])('年齢%i歳の場合（%s）、%s', async (age, shouldSucceed, description) => {
      // Arrange
      const userData = {
        name: '山田太郎',
        email: 'yamada@example.com',
        age,
      };

      // Act
      const result = await validateAge(userData);

      // Assert
      expect(result.success).toBe(shouldSucceed);
    });
  });
});
```

#### 実践例3: 配列サイズの境界値分析

```typescript
describe('タグ配列のバリデーション', () => {
  const MIN_TAGS = 0;
  const MAX_TAGS = 5;

  describe('🔬 境界値分析: 配列サイズ', () => {
    it.each([
      [0, true, '最小値（空配列）'],
      [1, true, '最小値+1'],
      [3, true, '中央値'],
      [5, true, '最大値'],
      [6, false, '最大値超過'],
    ])('タグが%i個の場合（%s）、適切に処理されること', async (tagCount, shouldSucceed, description) => {
      // Arrange
      const tags = Array.from({ length: tagCount }, (_, i) => `tag${i + 1}`);
      const postData = {
        title: 'テスト投稿',
        content: '内容',
        tags,
      };

      // Act
      const result = await createPost(postData);

      // Assert
      expect(result.success).toBe(shouldSucceed);
      if (shouldSucceed) {
        expect(result.data.tags).toHaveLength(tagCount);
      } else {
        expect(result.error.code).toBe('VALIDATION_ERROR');
        expect(result.error.field).toBe('tags');
      }
    });
  });
});
```

### 同値分割によるテストケース設計

**同値分割**は、同じ振る舞いをする入力値をグループ化し、各グループから代表値を選んでテストする手法です。

#### 実践例: メールアドレス形式の同値分割

```typescript
describe('メールアドレスのバリデーション', () => {
  describe('🧩 同値分割: メール形式', () => {
    // 有効な同値クラス
    describe('有効なメールアドレス', () => {
      it.each([
        ['basic@example.com', '基本形式'],
        ['user.name@example.com', 'ドット付き'],
        ['user+tag@example.com', 'プラス付き'],
        ['user@sub.example.com', 'サブドメイン'],
        ['123@example.com', '数字のユーザー名'],
        ['user@example-site.com', 'ハイフン付きドメイン'],
      ])('%s (%s) は有効なメールアドレスとして受け入れられること', async (email, description) => {
        // Arrange
        const userData: CreateUserRequest = {
          name: '山田太郎',
          email,
          role: 'user'
        };

        // Act
        const result = await userService.createUser(userData);

        // Assert
        expect(result.success).toBe(true);
      });
    });

    // 無効な同値クラス
    describe('無効なメールアドレス', () => {
      it.each([
        ['invalid-email', 'アット記号なし'],
        ['@example.com', 'ユーザー名なし'],
        ['user@', 'ドメインなし'],
        ['user@domain', 'トップレベルドメインなし'],
        ['user@@example.com', 'アット記号重複'],
        ['user@.example.com', 'ドメイン先頭ドット'],
        ['user@example..com', 'ドット連続'],
        ['', '空文字'],
        ['  ', 'スペースのみ'],
      ])('%s (%s) は無効なメールアドレスとしてエラーになること', async (email, description) => {
        // Arrange
        const userData: CreateUserRequest = {
          name: '山田太郎',
          email,
          role: 'user'
        };

        // Act
        const result = await userService.createUser(userData);

        // Assert
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.code).toBe('VALIDATION_ERROR');
          expect(result.error.field).toBe('email');
        }
      });
    });
  });
});
```

### パラメータ化テスト（test.each）の活用

**t-wadaポイント**: パラメータ化テストは、同じロジックを異なる値でテストする際の重複を排除し、テストケースの意図を明確にします。

#### 実践例: ロール権限のパラメータ化テスト

```typescript
describe('ロール権限のテスト', () => {
  describe('🔄 パラメータ化テスト: 権限チェック', () => {
    it.each([
      ['admin', 'users', 'create', true, '管理者は全操作可能'],
      ['admin', 'users', 'read', true, '管理者は全操作可能'],
      ['admin', 'posts', 'delete', true, '管理者は全操作可能'],
      ['user', 'users', 'read', true, 'ユーザーは読み取り可能'],
      ['user', 'posts', 'create', true, 'ユーザーは投稿作成可能'],
      ['user', 'users', 'create', false, 'ユーザーはユーザー作成不可'],
      ['user', 'users', 'delete', false, 'ユーザーは削除不可'],
      ['guest', 'posts', 'read', true, 'ゲストは投稿読み取り可能'],
      ['guest', 'posts', 'create', false, 'ゲストは投稿作成不可'],
      ['guest', 'users', 'read', false, 'ゲストはユーザー情報読み取り不可'],
    ])(
      'ロール%s が%s:%s を実行した場合、%s（%s）',
      async (role, resource, action, expectedResult, description) => {
        // Arrange
        const user = { role: role as 'admin' | 'user' | 'guest' };
        const permission = { resource, action };

        // Act
        const result = await checkPermission(user, permission);

        // Assert
        expect(result).toBe(expectedResult);
      }
    );
  });
});
```

### テストダブル（Mock vs Stub vs Spy）の使い分け

**t-wadaポイント**: テストダブルは目的に応じて使い分けることが重要です。何をテストしたいかで選択しましょう。

#### Mock（モック）: 振る舞いの検証

**用途**: 「正しいメソッドが正しい引数で呼ばれたか」を検証

```typescript
describe('ユーザー作成時のメール送信', () => {
  it('ユーザー作成成功時、ウェルカムメールが送信されること', async () => {
    // Arrange
    const mockEmailService = {
      sendWelcomeEmail: vi.fn().mockResolvedValue({ success: true }),
    };
    
    const userService = createUserService(userRepository, mockEmailService);
    const userData: CreateUserRequest = {
      name: '山田太郎',
      email: 'yamada@example.com',
      role: 'user'
    };

    // Act
    await userService.createUser(userData);

    // Assert - 振る舞いの検証
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith({
      to: 'yamada@example.com',
      userName: '山田太郎',
    });
  });

  it('メール送信に失敗してもユーザー作成は成功すること', async () => {
    // Arrange
    const mockEmailService = {
      sendWelcomeEmail: vi.fn().mockRejectedValue(new Error('メール送信失敗')),
    };
    
    const userService = createUserService(userRepository, mockEmailService);

    // Act
    const result = await userService.createUser({
      name: '山田太郎',
      email: 'yamada@example.com',
      role: 'user'
    });

    // Assert - メール送信失敗でもユーザー作成は成功
    expect(result.success).toBe(true);
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalled();
  });
});
```

#### Stub（スタブ）: 戻り値の制御

**用途**: 「依存するコンポーネントから特定の値を返させる」制御

```typescript
describe('外部API統合のテスト', () => {
  it('外部ユーザー検証APIが成功した場合、ユーザーが作成されること', async () => {
    // Arrange - Stub: 固定の戻り値を設定
    const stubExternalApi = {
      validateUser: vi.fn().mockResolvedValue({
        isValid: true,
        score: 85,
      }),
    };

    const userService = createUserService(userRepository, undefined, stubExternalApi);

    // Act
    const result = await userService.createUser({
      name: '山田太郎',
      email: 'yamada@example.com',
      role: 'user'
    });

    // Assert
    expect(result.success).toBe(true);
  });

  it('外部ユーザー検証APIでスコアが低い場合、エラーになること', async () => {
    // Arrange - Stub: 低スコアを返すよう設定
    const stubExternalApi = {
      validateUser: vi.fn().mockResolvedValue({
        isValid: false,
        score: 15, // 低スコア
      }),
    };

    const userService = createUserService(userRepository, undefined, stubExternalApi);

    // Act
    const result = await userService.createUser({
      name: '山田太郎',
      email: 'yamada@example.com',
      role: 'user'
    });

    // Assert
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('VALIDATION_ERROR');
      expect(result.error.message).toContain('検証スコア');
    }
  });
});
```

#### Spy（スパイ）: 既存機能の監視

**用途**: 「実際の機能を使いつつ、呼び出しを監視する」

```typescript
describe('ログ出力の監視', () => {
  it('ユーザー作成時、適切なログが出力されること', async () => {
    // Arrange - Spy: console.logを監視
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Act
    const result = await userService.createUser({
      name: '山田太郎',
      email: 'yamada@example.com',
      role: 'user'
    });

    // Assert
    expect(result.success).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('User created successfully:'),
      expect.stringContaining('yamada@example.com')
    );

    // Cleanup
    consoleSpy.mockRestore();
  });

  it('エラー時、エラーログが出力されること', async () => {
    // Arrange - Repository をエラーを返すよう設定
    const errorMessage = 'Database connection failed';
    vi.spyOn(userRepository, 'create').mockRejectedValue(new Error(errorMessage));
    
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Act
    const result = await userService.createUser({
      name: '山田太郎',
      email: 'yamada@example.com',
      role: 'user'
    });

    // Assert
    expect(result.success).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('User creation failed:'),
      expect.any(Error)
    );

    // Cleanup
    consoleErrorSpy.mockRestore();
  });
});
```

#### 実際のプロダクトコードでの依存注入

```typescript
// src/features/user/services/user-service.ts

interface EmailService {
  sendWelcomeEmail(params: { to: string; userName: string }): Promise<Result<void, Error>>;
}

interface ExternalUserApi {
  validateUser(userData: CreateUserRequest): Promise<{ isValid: boolean; score: number }>;
}

export const createUserService = (
  userRepository: UserRepository,
  emailService?: EmailService, // オプショナル
  externalUserApi?: ExternalUserApi // オプショナル
) => {
  const createUser = async (userData: CreateUserRequest): Promise<Result<User, any>> => {
    try {
      // 外部API検証（設定されている場合）
      if (externalUserApi) {
        const validation = await externalUserApi.validateUser(userData);
        if (!validation.isValid || validation.score < 50) {
          return failure(validationError(
            'user',
            userData,
            `検証スコアが不足しています: ${validation.score}`
          ));
        }
      }

      // ユーザー作成
      const result = await userRepository.create({
        ...userData,
        isActive: true,
      });

      if (result.success) {
        console.log('User created successfully:', result.data.email);
        
        // ウェルカムメール送信（失敗してもユーザー作成は成功とする）
        if (emailService) {
          try {
            await emailService.sendWelcomeEmail({
              to: result.data.email,
              userName: result.data.name,
            });
          } catch (error) {
            console.error('Welcome email failed, but user creation succeeded:', error);
          }
        }
      }

      return result;
    } catch (error) {
      console.error('User creation failed:', error);
      return failure(error as Error);
    }
  };

  return { createUser };
};
```

#### t-wadaポイント: テストダブルの選択指針

1. **Mock**: メソッド呼び出しの検証が主目的
   - 「メールが送信されたか？」
   - 「正しい引数でAPIが呼ばれたか？」

2. **Stub**: 戻り値の制御が主目的
   - 「APIが特定の値を返した場合の動作確認」
   - 「エラーケースの再現」

3. **Spy**: 既存機能の監視が主目的
   - 「ログ出力の確認」
   - 「既存メソッドの呼び出し回数確認」

**重要**: 1つのテストで複数のテストダブルを使いすぎると、テストが何を検証しているかわからなくなります。1つのテストで検証することは1つに絞りましょう。

## Phase 3: TypeScript特化手法

### 型安全なテスト設計パターン

**t-wadaポイント**: TypeScriptの型システムを活用して、実行時エラーをコンパイル時に検出できるテストを書きましょう。

#### 実践例: 型安全なAssertionヘルパー

```typescript
// test-utils/type-safe-assertions.ts

import { expect } from 'vitest';
import { Result } from '../../../shared/types/result';

/**
 * Result型の成功値を型安全に検証するヘルパー
 */
export const expectSuccess = <T, E>(
  result: Result<T, E>
): asserts result is { success: true; data: T } => {
  expect(result.success).toBe(true);
  if (!result.success) {
    throw new Error('Expected success but got failure');
  }
};

/**
 * Result型の失敗値を型安全に検証するヘルパー
 */
export const expectFailure = <T, E>(
  result: Result<T, E>
): asserts result is { success: false; error: E } => {
  expect(result.success).toBe(false);
  if (result.success) {
    throw new Error('Expected failure but got success');
  }
};

/**
 * 型安全なエラーコード検証
 */
export const expectErrorCode = <T extends { code: string }>(
  error: T,
  expectedCode: T['code']
): void => {
  expect(error.code).toBe(expectedCode);
};
```

#### 使用例: 型安全テストの実践

```typescript
describe('型安全なテストの実践', () => {
  it('成功ケース：型安全にSuccessを検証', async () => {
    // Act
    const result = await userService.createUser({
      name: '山田太郎',
      email: 'yamada@example.com',
      role: 'user'
    });

    // Assert - 型安全な検証
    expectSuccess(result);
    
    // この時点でresult.dataの型が確定し、IDE補完が効く
    expect(result.data.name).toBe('山田太郎');
    expect(result.data.email).toBe('yamada@example.com');
    expect(result.data.id).toBeDefined();
  });

  it('失敗ケース：型安全にFailureを検証', async () => {
    // Act
    const result = await userService.createUser({
      name: '',
      email: 'invalid-email',
      role: 'user'
    });

    // Assert - 型安全な検証
    expectFailure(result);
    
    // この時点でresult.errorの型が確定
    expectErrorCode(result.error, 'VALIDATION_ERROR');
    expect(result.error.field).toBe('name');
  });
});
```

### Result型を使ったエラー処理のTDD

#### 実践例: Result型でのエラーハンドリングTDD

```typescript
// features/user/types/user-errors.ts

export type UserError = 
  | { code: 'VALIDATION_ERROR'; field: string; message: string }
  | { code: 'DUPLICATE_EMAIL'; email: string }
  | { code: 'EXTERNAL_API_ERROR'; apiName: string; originalError: unknown }
  | { code: 'DATABASE_ERROR'; operation: string; originalError: unknown };

// TDD Step 1: 失敗するテストを書く
describe('Result型エラーハンドリング', () => {
  it('重複メール検証エラーの場合、適切なエラー型が返されること', async () => {
    // Arrange
    const existingUser = createMockUser({ email: 'existing@example.com' });
    vi.spyOn(userRepository, 'findByEmail').mockResolvedValue(success(existingUser));

    // Act
    const result = await userService.createUser({
      name: '新規ユーザー',
      email: 'existing@example.com', // 既存メールアドレス
      role: 'user'
    });

    // Assert
    expectFailure(result);
    expectErrorCode(result.error, 'DUPLICATE_EMAIL');
    expect(result.error.email).toBe('existing@example.com');
  });
});
```

### 非同期処理（Promise/async-await）のテスト戦略

#### 実践例: 非同期エラーハンドリングのTDD

```typescript
describe('非同期処理のテスト', () => {
  it('タイムアウト設定での非同期処理テスト', async () => {
    // Arrange
    const slowApi = {
      validateUser: vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ isValid: true }), 2000))
      ),
    };

    const userService = createUserService(userRepository, undefined, slowApi);

    // Act & Assert - タイムアウトエラーを期待
    await expect(
      userService.createUser({
        name: '山田太郎',
        email: 'yamada@example.com',
        role: 'user'
      })
    ).rejects.toThrow('タイムアウト');
  }, 1500); // 1.5秒でタイムアウト

  it('Promise.all使用時の部分失敗ハンドリング', async () => {
    // Arrange
    const partialFailureService = {
      operation1: vi.fn().mockResolvedValue(success('result1')),
      operation2: vi.fn().mockRejectedValue(new Error('operation2 failed')),
      operation3: vi.fn().mockResolvedValue(success('result3')),
    };

    // Act
    const results = await Promise.allSettled([
      partialFailureService.operation1(),
      partialFailureService.operation2(),
      partialFailureService.operation3(),
    ]);

    // Assert
    expect(results[0].status).toBe('fulfilled');
    expect(results[1].status).toBe('rejected');
    expect(results[2].status).toBe('fulfilled');
  });
});
```

### React コンポーネントのTDD実践

#### 実践例: Hooks + Result型を使ったコンポーネントTDD

```typescript
// components/__tests__/user-form.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserForm } from '../user-form';

describe('UserForm コンポーネント', () => {
  it('フォーム送信成功時、成功メッセージが表示されること', async () => {
    // Arrange
    const mockOnSubmit = vi.fn().mockResolvedValue(success({ id: '1', name: '山田太郎' }));
    
    render(<UserForm onSubmit={mockOnSubmit} />);

    // Act
    fireEvent.change(screen.getByLabelText('名前'), { target: { value: '山田太郎' } });
    fireEvent.change(screen.getByLabelText('メールアドレス'), { target: { value: 'yamada@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: '登録' }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('ユーザーの登録が完了しました')).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: '山田太郎',
      email: 'yamada@example.com',
      role: 'user'
    });
  });

  it('バリデーションエラー時、エラーメッセージが表示されること', async () => {
    // Arrange
    const mockOnSubmit = vi.fn().mockResolvedValue(failure({
      code: 'VALIDATION_ERROR',
      field: 'email',
      message: 'メールアドレスの形式が正しくありません'
    }));
    
    render(<UserForm onSubmit={mockOnSubmit} />);

    // Act
    fireEvent.change(screen.getByLabelText('名前'), { target: { value: '山田太郎' } });
    fireEvent.change(screen.getByLabelText('メールアドレス'), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: '登録' }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('メールアドレスの形式が正しくありません')).toBeInTheDocument();
    });
  });
});
```

## t-wada流TDD実践チェックリスト

### ✅ 開発前の準備

- [ ] **TODOリスト作成**: 機能要求をTODOリストに分解
- [ ] **失敗パターン想定**: 境界値・エラーケースを事前に洗い出し
- [ ] **テストダブル戦略**: Mock/Stub/Spyの使い分けを明確化

### ✅ Red-Green-Refactor サイクル

- [ ] **🔴 Red**: 必ず失敗するテストから開始
- [ ] **🟢 Green**: 最小限の実装でテストを通す
- [ ] **🔄 Refactor**: テストを保ちながらコードを改善
- [ ] **📝 Commit**: 各サイクル完了後にコミット

### ✅ t-wada流3段階実装

- [ ] **仮実装**: ハードコーディングでテストを通す
- [ ] **三角測量**: 複数テストケースで一般化を促す
- [ ] **明白な実装**: 正しいロジックを実装

### ✅ 境界値分析・同値分割

- [ ] **境界値**: 最小値、最大値、境界値±1のテスト
- [ ] **同値分割**: 同じ振る舞いをするグループごとのテスト
- [ ] **パラメータ化**: test.eachで効率的なテストケース設計

### ✅ TypeScript特化技法

- [ ] **型安全**: 型安全なAssertion ヘルパーの活用
- [ ] **Result型**: エラーハンドリングの統一
- [ ] **非同期**: Promise/async-awaitの適切なテスト
- [ ] **コンポーネント**: React + Hooksの統合テスト

## 実践のポイント

**t-wadaからのメッセージ**: TDDは単なるテスト手法ではなく、設計手法です。テストファーストにより、より良い設計と保守性の高いコードが生まれます。

1. **最小限の変更**: 一度に多くを実装せず、段階的に進める
2. **適切な失敗**: コンパイルエラー → ランタイムエラー → アサーション失敗の順
3. **TODO駆動**: 常に次に何をすべきかを明確にする
4. **境界を攻める**: 境界値分析で隠れたバグを発見
5. **型で守る**: TypeScriptの型システムを最大限活用

---

**Claude Codeは、このガイドに沿ってt-wada流TDDを必ず実践してください。**

テストファーストで、より良い設計のコードを一緒に作りましょう。
