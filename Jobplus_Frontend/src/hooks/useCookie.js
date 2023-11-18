import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

export const useCookie = () => {
  const AUTH_KEY = "jobplus-token";
  const saveAuthCookie = (token, expires = 4 / 24) => {
    Cookies.set(AUTH_KEY, token, { expires: expires });
  };
  const deleteAuthCookie = () => {
    Cookies.remove(AUTH_KEY);
  };
  const getAuthCookie = () => {
    return Cookies.get(AUTH_KEY);
  };
  const isAuthCookieExpired = () => {
    const token = getAuthCookie();
    if (!token) return true;
    const { exp } = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    return exp < currentTime;
  };
  const hasValidAuthCookie = () => {
    return !isAuthCookieExpired();
  };

  return {
    saveAuthCookie,
    deleteAuthCookie,
    getAuthCookie,
    isAuthCookieExpired,
    hasValidAuthCookie,
  };
};
