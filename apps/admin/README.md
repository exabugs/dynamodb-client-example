# DynamoDB Client Example - Admin UI

React + react-admin + Vite による管理画面（Articles、Tasks リソース）

## 技術スタック

- **React**: 19.x
- **react-admin**: 5.x
- **Material-UI**: 6.x
- **Vite**: 5.x
- **TypeScript**: 5.3.x

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# プレビュー
pnpm preview
```

## 環境変数

環境変数ファイルは、Terraform outputから自動生成できます。

### 自動生成（推奨）

```bash
# プロジェクトルートから実行
make env-admin ENV=dev  # .env.development を生成
make env-admin ENV=stg  # .env.staging を生成
make env-admin ENV=prd  # .env.production を生成
```

Viteは自動的に適切な環境ファイルを読み込みます：

- `vite dev` → `.env.development`
- `vite build --mode staging` → `.env.staging`
- `vite build` → `.env.production`

### 手動設定

`.env.example` を参考に、環境別ファイルを作成することもできます：

```bash
# 開発環境用
cp .env.example .env.development

# ステージング環境用
cp .env.example .env.staging

# 本番環境用
cp .env.example .env.production
```

**注意**: 環境変数ファイルは`.gitignore`で除外されているため、コミットされません。

## ディレクトリ構造

```
src/
├── main.tsx              # エントリーポイント（Amplify設定、ルーティング）
├── App.tsx               # react-admin <Admin>コンポーネント
├── authProvider.ts       # 認証プロバイダー（Amplify v6 Cognito統合）
├── dataProvider.ts       # データプロバイダー（Records Lambda統合）
├── resources/            # リソース定義（articles, tasks）
└── components/           # 共通コンポーネント（LoginPage、DateTime、Datagrid）
```

## 開発

- ポート: 3000（固定、`strictPort: true`）
- 自動リロード: 有効
- TypeScript型チェック: `pnpm type-check`

### 重要な設定

#### ポート固定

開発サーバーはポート3000で固定されています（`vite.config.ts`で`strictPort: true`を設定）。

理由：

- Cognito Hosted UIのコールバック/ログアウトURLがポート3000で設定されている
- ポートが自動的に変更されると、認証が失敗する

ポート3000が使用中の場合は、以下のコマンドで使用中のプロセスを確認してください：

```bash
lsof -ti:3000
```

#### CORS設定

Lambda Function URLのCORS設定を使用するため、Lambda関数のハンドラーではCORSヘッダーを設定していません。

CORSエラーが発生する場合は、以下を確認してください：

1. Lambda関数が最新版にデプロイされているか
2. ブラウザのキャッシュをクリアしたか
3. Lambda Function URLのCORS設定が正しいか（`infra/modules/api/lambda-records/main.tf`）

## リソース

- **Articles**: 記事のCRUD操作（タイトル、内容、ステータス、作成日時、更新日時）
- **Tasks**: タスクのCRUD操作（タイトル、説明、ステータス、優先度、期限、作成日時、更新日時）

各リソースは、DynamoDB Shadow Recordsによるソート機能をサポートしています。
