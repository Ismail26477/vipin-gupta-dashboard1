// Dynamically set API base URL based on environment
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? "http://localhost:5000/api"
  : "/api";

// Helper function for API calls
async function apiCall(method: string, endpoint: string, data?: any) {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API error");
  }

  return response.json();
}

// Products
export const mongodbProducts = {
  getAll: () => apiCall("GET", "/products"),
  getById: (id: string) => apiCall("GET", `/products/${id}`),
  create: (data: any) => apiCall("POST", "/products", data),
  update: (id: string, data: any) => apiCall("PUT", `/products/${id}`, data),
  delete: (id: string) => apiCall("DELETE", `/products/${id}`),
};

// Categories
export const mongodbCategories = {
  getAll: () => apiCall("GET", "/categories"),
  create: (data: any) => apiCall("POST", "/categories", data),
  update: (id: string, data: any) => apiCall("PUT", `/categories/${id}`, data),
  delete: (id: string) => apiCall("DELETE", `/categories/${id}`),
};

// Subcategories
export const mongodbSubcategories = {
  getAll: () => apiCall("GET", "/subcategories"),
  create: (data: any) => apiCall("POST", "/subcategories", data),
  delete: (id: string) => apiCall("DELETE", `/subcategories/${id}`),
};

// Orders
export const mongodbOrders = {
  getAll: () => apiCall("GET", "/orders"),
  getById: (id: string) => apiCall("GET", `/orders/${id}`),
  create: (data: any) => apiCall("POST", "/orders", data),
  update: (id: string, data: any) => apiCall("PUT", `/orders/${id}`, data),
};

// Customers
export const mongodbCustomers = {
  getAll: () => apiCall("GET", "/customers"),
  getById: (id: string) => apiCall("GET", `/customers/${id}`),
};

// Reviews
export const mongodbReviews = {
  getAll: () => apiCall("GET", "/reviews"),
  create: (data: any) => apiCall("POST", "/reviews", data),
  delete: (id: string) => apiCall("DELETE", `/reviews/${id}`),
};

// Unified API export
export const api = {
  // Products
  getProducts: () => mongodbProducts.getAll(),
  getProduct: (id: string) => mongodbProducts.getById(id),
  addProduct: (data: any) => mongodbProducts.create(data),
  updateProduct: (id: string, data: any) => mongodbProducts.update(id, data),
  deleteProduct: (id: string) => mongodbProducts.delete(id),

  // Categories
  getCategories: () => mongodbCategories.getAll(),
  addCategory: (data: any) => mongodbCategories.create(data),
  updateCategory: (id: string, data: any) => mongodbCategories.update(id, data),
  deleteCategory: (id: string) => mongodbCategories.delete(id),

  // Subcategories
  getSubcategories: () => mongodbSubcategories.getAll(),
  addSubcategory: (data: any) => mongodbSubcategories.create(data),
  addSubcategories: (data: any[]) => Promise.all(data.map(d => mongodbSubcategories.create(d))),
  deleteSubcategory: (id: string) => mongodbSubcategories.delete(id),

  // Orders
  getOrders: () => mongodbOrders.getAll(),
  getOrder: (id: string) => mongodbOrders.getById(id),
  addOrder: (data: any) => mongodbOrders.create(data),
  updateOrder: (id: string, data: any) => mongodbOrders.update(id, data),

  // Customers
  getCustomers: () => mongodbCustomers.getAll(),
  getCustomer: (id: string) => mongodbCustomers.getById(id),

  // Reviews
  getReviews: () => mongodbReviews.getAll(),
  addReview: (data: any) => mongodbReviews.create(data),
  deleteReview: (id: string) => mongodbReviews.delete(id),
};
