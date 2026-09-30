import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8082",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const orgId = localStorage.getItem("organizationId");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (orgId) {
      config.headers["X-Organization-Id"] = orgId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
