import type { InternalAxiosRequestConfig } from "axios";
import Axios from "axios";
import { getCookie } from "cookies-next";

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = getCookie("ps_access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = (error.response?.data?.message ||
      error.message ||
      "Something went wrong") as string;

    return Promise.reject(new Error(message));
  },
);
