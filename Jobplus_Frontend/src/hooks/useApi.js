import axios from "axios";
import { parseError } from "../utils/parseError";
import { useCookie } from "./useCookie";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useApi = () => {
  const { getAuthCookie } = useCookie();
  const token = getAuthCookie();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  const request = async (endpoint, options = {}) => {
    try {
      const res = await axios({
        method: options.method,
        url: `${BACKEND_URL}/${endpoint}`,
        data: options.data || {},
        params: options.params || {},
      });
      options.onSuccess && options.onSuccess(res);
    } catch (err) {
      options.onFailure && options.onFailure(parseError(err));
    }
  };
  return {
    post: (endpoint, options) =>
      request(endpoint, { ...options, method: "POST" }),
    get: (endpoint, options) =>
      request(endpoint, { ...options, method: "GET" }),
  };
};
