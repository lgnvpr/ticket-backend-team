import axios from "axios"
export const appClient = axios.create({
    baseURL: "",
    timeout: 10000,
    headers: {
      common: {
        "Content-Type": "application/json",
      },
    },
  });