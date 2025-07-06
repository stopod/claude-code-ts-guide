export default {
  // 基本フォーマット設定
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  
  // インデントとスペース
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  
  // 改行設定
  endOfLine: 'lf',
  proseWrap: 'preserve',
  
  // TypeScript/JavaScript固有
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  
  // プラグイン（プロジェクトに応じて追加）
  plugins: [
    // Tailwind CSS用（フロントエンドプロジェクトで有効化）
    // 'prettier-plugin-tailwindcss',
    
    // その他のプラグイン
    // 'prettier-plugin-organize-imports',
  ],
  
  // ファイル別設定
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: '*.json',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
}