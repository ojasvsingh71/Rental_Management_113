import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ===================== AUTH =====================
export const AuthAPI = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  register: (data: any) => api.post("/auth/register", data),
  me: () => api.get("/me"),
  updateProfile: (data: any) => api.put("/me", data),
};

// ===================== PRODUCTS =====================
export const ProductAPI = {
  list: () => api.get("/products"),
  get: (id: string) => api.get(`/products/${id}`),
  availability: (id: string) => api.get(`/products/${id}/availability`),
  create: (data: any) => api.post("/products", data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  remove: (id: string) => api.delete(`/products/${id}`),
};

// ===================== PRICELISTS =====================
export const PricelistAPI = {
  list: () => api.get("/pricelists"),
  create: (data: any) => api.post("/pricelists", data),
  update: (id: string, data: any) => api.put(`/pricelists/${id}`, data),
  addItem: (data: any) => api.post("/pricelist-items", data),
};

// ===================== QUOTATIONS =====================
export const QuotationAPI = {
  list: () => api.get("/quotations"),
  create: (data: any) => api.post("/quotations", data),
  updateStatus: (id: string, status: string) =>
    api.put(`/quotations/${id}/status`, { status }),
  update: (id: string, data: any) => api.put(`/quotations/${id}`, data),
};

// ===================== RENTALS =====================
export const RentalAPI = {
  list: () => api.get("/rentals"),
  create: (data: any) => api.post("/rentals", data),
  update: (id: string, data: any) => api.put(`/rentals/${id}`, data),
};

// ===================== PICKUPS & RETURNS =====================
export const PickupAPI = {
  list: () => api.get("/pickups"),
  create: (data: any) => api.post("/pickups", data),
  updateStatus: (id: string, status: string) =>
    api.put(`/pickups/${id}/status`, { status }),
};

export const ReturnAPI = {
  list: () => api.get("/returns"),
  create: (data: any) => api.post("/returns", data),
  updateStatus: (id: string, status: string) =>
    api.put(`/returns/${id}/status`, { status }),
};

// ===================== INVOICES & PAYMENTS =====================
export const InvoiceAPI = {
  list: () => api.get("/invoices"),
  create: (data: any) => api.post("/invoices", data),
  update: (id: string, data: any) => api.put(`/invoices/${id}`, data),
};

export const PaymentAPI = {
  create: (data: any) => api.post("/payments", data),
};

// ===================== AUTOMATION =====================
export const AutomationAPI = {
  applyLateFee: () => api.post("/automation/late-fee"),
};

// ===================== BULK ACTIONS =====================
export const BulkAPI = {
  delete: (data: { ids: string[]; type: string }) =>
    api.post("/bulk/delete", data),
  update: (data: { ids: string[]; type: string; payload: any }) =>
    api.post("/bulk/update", data),
};

// ===================== REPORTS =====================
export const ReportAPI = {
  list: (params?: any) => api.get("/reports", { params }),
};

// ===================== USERS =====================
export const UserAPI = {
  list: () => api.get("/users"),
  create: (data: any) => api.post("/users", data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  remove: (id: string) => api.delete(`/users/${id}`),
};

// ===================== NOTIFICATIONS =====================
export const NotificationAPI = {
  list: () => api.get("/notifications"),
  create: (data: any) => api.post("/notifications", data),
};

export default api;