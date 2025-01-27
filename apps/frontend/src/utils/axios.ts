import Axios from "axios";

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

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
