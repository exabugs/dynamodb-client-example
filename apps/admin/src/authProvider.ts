// src/auth/authProvider.ts
import { fetchAuthSession, getCurrentUser, signInWithRedirect, signOut } from '@aws-amplify/auth';

import type { AuthProvider } from 'react-admin';

const SIGNED_OUT_FLAG = 'example.signedOut';

/**
 * ログアウト時にクリアするAmplifyのローカルストレージキー
 */
const AMPLIFY_KEYS = [
  'amplify-signin-with-hostedUI',
  'amplify-auto-sign-in',
  'amplify-redirected-from-hosted-ui',
];

/**
 * IDトークンを取得（dataProviderで使用）
 */
export const getIdToken = async (): Promise<string | null> => {
  try {
    const { tokens } = await fetchAuthSession();
    return tokens?.idToken?.toString() ?? null;
  } catch {
    return null;
  }
};

export const authProvider: AuthProvider = {
  async login() {
    // ログアウトフラグをクリア（明示的なログイン操作）
    localStorage.removeItem(SIGNED_OUT_FLAG);

    // Amplify に任せる（PKCE 前処理込み）
    await signInWithRedirect();
  },

  async logout() {
    try {
      // 「ログアウト直後に自動再ログインさせない」ためのフラグ
      localStorage.setItem(SIGNED_OUT_FLAG, '1');

      // Amplifyのローカルストレージキーを明示的にクリア
      // これにより、ログアウト後の自動リダイレクトを防止
      AMPLIFY_KEYS.forEach((key) => {
        localStorage.removeItem(key);
      });

      // グローバルサインアウトでCognitoセッションを完全に破棄
      // global: true により Cognito Hosted UI の /logout エンドポイントにリダイレクトされる
      // redirectSignOut で設定されたURL（/login）にログアウト後リダイレクトされる
      await signOut({ global: true });
    } catch (error) {
      // エラーが発生してもログアウトフラグは維持
      console.error('Logout error:', error);
      // エラーが発生しても続行（ローカルストレージはクリア済み）
    }
  },

  async checkAuth() {
    // ログアウト直後の場合は、自動ログインを試みずに即座に拒否
    if (localStorage.getItem(SIGNED_OUT_FLAG) === '1') {
      return Promise.reject(new Error('User signed out'));
    }

    // 未ログインなら例外 → react-admin が /login を表示（LoginPage はボタンのみで自動遷移しない）
    await getCurrentUser();
  },

  async checkError() {
    return;
  },

  async getPermissions() {
    return;
  },

  async getIdentity() {
    try {
      const user = await getCurrentUser();
      const { tokens } = await fetchAuthSession();

      // IDトークンからユーザー情報を取得
      const idToken = tokens?.idToken;
      const payload = idToken?.payload;

      // デバッグ: 利用可能なクレームを確認
      console.log('🔍 User Identity Debug:');
      console.log('  user:', user);
      console.log('  payload:', payload);
      console.log('  Available claims:', {
        name: payload?.name,
        given_name: payload?.given_name,
        family_name: payload?.family_name,
        preferred_username: payload?.preferred_username,
        'cognito:username': payload?.['cognito:username'],
        email: payload?.email,
        username: user.username,
        userId: user.userId,
      });

      // fullName のフォールバック処理
      // 1. name クレーム
      // 2. given_name + family_name
      // 3. preferred_username
      // 4. email のローカル部分（UUID より優先）
      // 5. username
      // 6. cognito:username（UUID の可能性が高い）
      // 7. userId（最終フォールバック）
      const emailLocal = (payload?.email as string | undefined)?.split('@')[0];
      const cognitoUsername = payload?.['cognito:username'] as string | undefined;

      // cognito:username が UUID 形式（ハイフン区切りの16進数）の場合は email を優先
      const isUuid =
        cognitoUsername &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cognitoUsername);

      const fullName =
        (payload?.name as string | undefined) ||
        [payload?.given_name, payload?.family_name].filter(Boolean).join(' ') ||
        (payload?.preferred_username as string | undefined) ||
        emailLocal ||
        user.username ||
        (!isUuid ? cognitoUsername : undefined) ||
        user.userId;

      console.log('  ✅ Selected fullName:', fullName);

      return {
        id: user.userId,
        fullName,
        email: payload?.email as string | undefined,
        avatar: payload?.picture as string | undefined,
      };
    } catch (error) {
      console.error('Failed to get user identity:', error);
      return Promise.reject(new Error('Failed to get user identity'));
    }
  },
};
