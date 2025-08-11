import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  checkAdmin: () => api.get("/auth/check-admin"),
  checkUser: (email: string) => api.get(`/auth/check-user?email=${email}`),
  generateOTP: (email: string) => api.post("/auth/generate-otp", { email }),
  verifyOTP: (email: string, code: string) =>
    api.post("/auth/verify-otp", { email, code }),
  signup: (userData: any) => api.post("/auth/signup", userData),
  signin: (credentials: any) => api.post("/auth/signin", credentials),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data: any) => api.put("/auth/update-profile", data),
  getUsers: () => api.get("/auth/users"),
  deleteUser: (userId: string) => api.delete("/auth/user", { data: { userId } }),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) => api.get("/product", { params }),
  getById: (id: string) => api.get(`/product/${id}`),
  create: (data: any) => api.post("/product", data),
  update: (id: string, data: any) => api.put(`/product/${id}`, data),
  delete: (id: string) => api.delete(`/product/${id}`),
  addDuration: (id: string, data: any) => api.post(`/product/${id}/duration`, data),
  addAvailability: (id: string, data: any) => api.post(`/product/${id}/availability`, data),
  updateAvailability: (availabilityId: string, data: any) =>
    api.put(`/product/availability/${availabilityId}`, data),
  deleteAvailability: (availabilityId: string) =>
    api.delete(`/product/availability/${availabilityId}`),
};

// Rentals API
export const rentalsAPI = {
  getAll: () => api.get("/rental"),
  getMy: () => api.get("/rental/my"),
  create: (data: any) => api.post("/rental", data),
  updateStatus: (id: string, status: string) =>
    api.put(`/rental/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/rental/${id}`),
};

// Customers API
export const customersAPI = {
  getAll: () => api.get("/customer"),
  getMe: () => api.get("/customer/me"),
  create: (data: any) => api.post("/customer", data),
  update: (data: any) => api.put("/customer/me", data),
  delete: () => api.delete("/customer/me"),
  getRentals: (id: string) => api.get(`/customer/${id}/rentals`),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get("/notification"),
  create: (data: any) => api.post("/notification", data),
  markAsRead: (id: string, isRead: boolean) =>
    api.put(`/notification/${id}/read`, { isRead }),
  delete: (id: string) => api.delete(`/notification/${id}`),
};

// Payments API
export const paymentsAPI = {
  getAll: () => api.get("/payment"),
  getMy: () => api.get("/payment/my"),
  create: (data: any) => api.post("/payment", data),
  updateStatus: (id: string, status: string) =>
    api.put(`/payment/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/payment/${id}`),
};

// Reports API
export const reportsAPI = {
  getRevenue: (params: any) => api.get("/report/revenue", { params }),
  getRentalStatus: () => api.get("/report/rental-status"),
  getTopProducts: () => api.get("/report/top-products"),
};

// Search API
export const searchAPI = {
  products: (params: any) => api.get("/search/products/search", { params }),
  rentals: (params: any) => api.get("/search/rentals/filter", { params }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  impersonate: (userId: string) => api.post(`/admin/impersonate/${userId}`),
};

// Pickup API
export const pickupAPI = {
  getAll: () => api.get("/pickup"),
  getMy: () => api.get("/pickup/my"),
  create: (data: any) => api.post("/pickup", data),
  complete: (id: string) => api.put(`/pickup/${id}/complete`),
  delete: (id: string) => api.delete(`/pickup/${id}`),
};

// Return API
export const returnAPI = {
  getAll: () => api.get("/rental-return"),
  getMy: () => api.get("/rental-return/my"),
  create: (data: any) => api.post("/rental-return", data),
  complete: (id: string) => api.put(`/rental-return/${id}/complete`),
  update: (id: string, data: any) => api.put(`/rental-return/${id}`, data),
  delete: (id: string) => api.delete(`/rental-return/${id}`),
};

// Quotation API
export const quotationAPI = {
  getAll: () => api.get("/quotation"),
  getMy: () => api.get("/quotation/my"),
  create: (data: any) => api.post("/quotation", data),
  accept: (id: string) => api.post(`/quotation/${id}/accept`),
  delete: (id: string) => api.delete(`/quotation/${id}`),
};

// Invoice API
export const invoiceAPI = {
  getAll: () => api.get("/invoice"),
  getById: (id: string) => api.get(`/invoice/${id}`),
  create: (data: any) => api.post("/invoice", data),
  updateStatus: (id: string, status: string) =>
    api.put(`/invoice/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/invoice/${id}`),
};

// Pricelist API
export const pricelistAPI = {
  getAll: (params?: any) => api.get("/pricelist", { params }),
  getById: (id: string) => api.get(`/pricelist/${id}`),
  create: (data: any) => api.post("/pricelist", data),
  update: (id: string, data: any) => api.put(`/pricelist/${id}`, data),
  delete: (id: string) => api.delete(`/pricelist/${id}`),
  addItem: (id: string, data: any) => api.post(`/pricelist/${id}/items`, data),
  updateItem: (id: string, itemId: string, data: any) =>
    api.put(`/pricelist/${id}/items/${itemId}`, data),
  deleteItem: (id: string, itemId: string) =>
    api.delete(`/pricelist/${id}/items/${itemId}`),
};

// Bulk operations API
export const bulkAPI = {
  delete: (model: string, ids: string[]) =>
    api.post("/bulk/delete", { model, ids }),
  updateRentalStatus: (rentalIds: string[], status: string) =>
    api.post("/bulk/rental/status", { rentalIds, status }),
};

// Automation API
export const automationAPI = {
  applyLateFees: () => api.post("/automation/apply-late-fees"),
  sendOverdueReminders: () => api.post("/automation/send-overdue-reminders"),
};

export default api;