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

//
// Supplier Management APIs
//
export const fetchSuppliers = async () => {
    try {
        const response = await api.get('/admin/suppliers'); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
    }
};

export const createSupplier = async (supplierData) => {
    try {
        const response = await api.post('/admin/suppliers', supplierData); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error creating supplier:', error);
        throw error;
    }
};

export const updateSupplier = async (id, supplierData) => {
    try {
        const response = await api.put(`/admin/suppliers/${id}`, supplierData); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error updating supplier:', error);
        throw error;
    }
};

export const deleteSupplier = async (id) => {
    try {
        const response = await api.delete(`/admin/suppliers/${id}`); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error deleting supplier:', error);
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
        const response = await api.post('/admin/products', productData); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await api.put(`/admin/products/${id}`, productData); // Corrected endpoint
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

//
// Sales Management APIs
//
export const fetchSales = async () => {
    try {
        const response = await api.get('/admin/sales'); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching sales:', error);
        throw error;
    }
};

export const createSale = async (saleData) => {
    try {
        const response = await api.post('/admin/sales', saleData); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error creating sale:', error);
        throw error;
    }
};

export const deleteSale = async (id) => {
    try {
        const response = await api.delete(`/admin/sales/${id}`); // Corrected endpoint
        return response.data;
    } catch (error) {
        console.error('Error deleting sale:', error);
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

export default api;