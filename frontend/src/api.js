import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Automatically set the token from sessionStorage if it exists
const token = sessionStorage.getItem('token');
if (token) {
    setAuthToken(token);
}

// Fetch the logged-in user's role
export const fetchUserRole = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data.role;
    } catch (error) {
        console.error('Error fetching user role:', error);
        throw error;
    }
};


// Dashboard APIs
export const fetchAdminDashboardData = async () => {
    try {
        const response = await api.get('/admin/dashboard');
        return response.data;
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        throw error;
    }
};

export const fetchSellerDashboardData = async () => {
    try {
        const response = await api.get('/seller/dashboard'); // Correct endpoint
        console.log('Fetched Seller Dashboard Data:', response.data); // Log the response
        return response.data;
    } catch (error) {
        console.error('Error fetching seller dashboard data:', error);
        throw error;
    }
};


export const fetchSupplierDashboardData = async () => {
    try {
        const response = await api.get('/supplier/dashboard'); // Matches backend route
        return response.data;
    } catch (error) {
        console.error('Error fetching supplier dashboard data:', error);
        throw error;
    }
};
//
// Supplier Management APIs
//
export const fetchSuppliers1 = async () => {
    try {
        const response = await api.get('/admin/supplier'); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
    }
};

export const createSupplier = async (supplierData) => {
    try {
        const response = await api.post('/admin/supplier', supplierData); // Matches backend route
        return response.data;
    } catch (error) {
        console.error('Error creating supplier:', error);
        throw error;
    }
};

export const updateSupplier = async (id, supplierData) => {
    try {
        const response = await api.put(`/admin/supplier/${id}`, supplierData); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error updating supplier:', error);
        throw error;
    }
};

export const deleteSupplier = async (id) => {
    try {
        const response = await api.delete(`/admin/supplier/${id}`); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error deleting supplier:', error);
        throw error;
    }
};

// Supplier APIs

export const fetchSuppliers2 = async () => {
    try {
        const response = await api.get('/supplier'); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
    }
};
export const fetchSupplierProfile = async () => {
    try {
        const response = await api.get('/supplier/profile'); // Ensure this matches the backend route
        return response.data;
    } catch (error) {
        console.error('Error fetching supplier profile:', error);
        throw error;
    }
};

export const fetchSupplierProducts = async () => {
    try {
        const response = await api.get('/supplier/products'); // Ensure this matches the backend route
        return response.data;
    } catch (error) {
        console.error('Error fetching supplier products:', error);
        throw error;
    }
};

export const updateSupplierProfile = async (profileData) => {
    try {
        const response = await api.put('/supplier/profile', profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating supplier profile:', error);
        throw error;
    }
};

export const fetchSupplierAnalytics = async () => {
    try {
        const response = await api.get('/supplier/analytics'); // Matches backend route
        return response.data;
    } catch (error) {
        console.error('Error fetching supplier analytics:', error);
        throw error;
    }
};

//
// Product Management APIs
//
export const fetchProducts = async () => {
    try {
        const response = await api.get('/admin/products'); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await api.post('/admin/products', productData); // Send JSON payload
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await api.put(`/admin/products/${id}`, productData); // Send JSON payload
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/admin/products/${id}`); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// Sales Management APIs
export const fetchSales = async () => {
    try {
        const response = await api.get('/admin/sales'); // Admin-specific endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching sales:', error);
        throw error;
    }
};

export const fetchSales2 = async () => {
    try {
        const response = await api.get('/sales/seller'); // Seller-specific endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching sales:', error);
        throw error;
    }
};

export const createSale = async (saleData) => {
    try {
        const response = await api.post('/admin/sales', saleData); // Admin-specific endpoint
        return response.data;
    } catch (error) {
        console.error('Error creating sale:', error);
        throw error;
    }
};

export const createSale2 = async (saleData) => {
    try {
        const response = await api.post('/sales', saleData); // Seller-specific endpoint
        return response.data;
    } catch (error) {
        console.error('Error creating sale:', error);
        throw error;
    }
};

export const deleteSale = async (id) => {
    try {
        const response = await api.delete(`/admin/sales/${id}`); // Admin-specific endpoint
        return response.data;
    } catch (error) {
        console.error('Error deleting sale:', error);
        throw error;
    }
};

export const deleteSale2 = async (id) => {
    try {
        const response = await api.delete(`/sales/${id}`); // Seller-specific endpoint
        return response.data;
    } catch (error) {
        console.error('Error deleting sale:', error);
        throw error;
    }
};

export const updateSale = async (id, saleData) => {
    try {
        const response = await api.put(`/admin/sales/${id}`, saleData); // Admin-specific endpoint
        return response.data;
    } catch (error) {
        console.error('Error updating sale:', error);
        throw error;
    }
};

export const updateSale2 = async (id, saleData) => {
    try {
        const response = await api.put(`/sales/${id}`, saleData); // Seller-specific endpoint
        return response.data;
    } catch (error) {
        console.error('Error updating sale:', error);
        throw error;
    }
};

export const fetchSalesReport = async () => {
    try {
        const response = await api.get('/admin/sales/report'); // Admin-specific endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching sales report:', error);
        throw error;
    }
};

export const fetchSalesReport2 = async () => {
    try {
        const response = await api.get('/sales/report'); // Seller-specific endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching sales report:', error);
        throw error;
    }
};

export const fetchProducts2 = async () => {
    try {
        const response = await api.get('/products'); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};


//
// User Management APIs
//
export const fetchUsers = async () => {
    try {
        const response = await api.get('/admin/users'); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post('/admin/users', userData); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/admin/users/${id}`, userData); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/admin/users/${id}`); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const fetchUserProfile = async () => {
    try {
        const response = await api.get('/auth/prof');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const updatePassword = async (currentPassword, newPassword) => {
    try {
        const response = await api.post('/auth/update-password', { currentPassword, newPassword });
        return response.data;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
};

export const fetchFilteredProducts = async (filters) => {
    try {
        const query = new URLSearchParams(filters).toString();
        const response = await api.get(`/products/search?${query}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        throw error;
    }
};

export const fetchCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await api.post('/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};

export const fetchBrands = async () => {
    try {
        const response = await api.get('/brands');
        return response.data;
    } catch (error) {
        console.error('Error fetching brands:', error);
        throw error;
    }
};

export const createBrand = async (brandData) => {
    try {
        const response = await api.post('/brands', brandData);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const updateBrand = async (id, brandData) => {
    try {
        const response = await api.put(`/brands/${id}`, brandData);
        return response.data; 
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

export const deleteBrand = async (id) => {
    try {
        const response = await api.delete(`/brands/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};

export default api;