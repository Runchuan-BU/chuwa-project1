 // 登入狀態、自動登入邏輯

 import { useSelector } from 'react-redux';

export function useAuth() {
  const { user, token } = useSelector(state => state.auth);
  return { isAuthenticated: !!token, user, token };
}
