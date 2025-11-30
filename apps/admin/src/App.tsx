/**
 * メインアプリケーションコンポーネント
 * react-adminの<Admin>コンポーネントを設定
 * - authProvider: Amplify v6 Cognito認証統合
 * - dataProvider: Records Lambda HTTP API統合
 * - リソース定義: articles, tasks
 * - テーマ設定: MUI
 *
 * 重要: BrowserRouterはmain.tsxで設定済み
 */
import { Admin, Resource } from 'react-admin';

import { authProvider } from './authProvider';
import { LoginPage } from './components/LoginPage';
import { dataProvider } from './dataProvider';
import articles from './resources/articles';
import tasks from './resources/tasks';

/**
 * Appコンポーネント
 *
 * 重要: main.tsxでBrowserRouterを管理
 */
function App() {
  return (
    <Admin authProvider={authProvider} dataProvider={dataProvider} loginPage={LoginPage}>
      <Resource {...articles} />
      <Resource {...tasks} />
    </Admin>
  );
}

export default App;
