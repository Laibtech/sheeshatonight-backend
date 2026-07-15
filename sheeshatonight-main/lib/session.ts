export interface SessionPayload {
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  email: string;
  name: string;
  region: string;
}

export const setSessionCookie = (payload: SessionPayload) => {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();

  document.cookie = `user_logged_in=true; path=/; expires=${expires};`;
  document.cookie = `user_role=${encodeURIComponent(payload.role)}; path=/; expires=${expires};`;
  document.cookie = `user_email=${encodeURIComponent(payload.email)}; path=/; expires=${expires};`;
  document.cookie = `user_name=${encodeURIComponent(payload.name)}; path=/; expires=${expires};`;
  document.cookie = `user_region=${encodeURIComponent(payload.region)}; path=/; expires=${expires};`;
};

export const clearSessionCookie = () => {
  document.cookie = 'user_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'user_region=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};
