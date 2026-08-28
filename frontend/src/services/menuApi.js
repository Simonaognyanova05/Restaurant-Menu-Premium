const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchMenu = async () => {
  const response = await fetch(`${API_URL}/menu`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Unable to load menu');
  }

  return result.data;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`, ...options.headers },
  });
  const result = response.status === 204 ? {} : await response.json();
  if (!response.ok) throw new Error(result.message || 'Request failed');
  return result.data;
};

export const fetchAdminMenu = () => request('/menu/admin');
export const loginAdmin = (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }), headers: { Authorization: '' } });
export const createDish = (payload) => request('/menu/dishes', { method: 'POST', body: JSON.stringify(payload) });
export const updateDish = (id, payload) => request(`/menu/dishes/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
export const deleteDish = (id) => request(`/menu/dishes/${id}`, { method: 'DELETE' });
export const createCategory = (payload) => request('/menu/categories', { method: 'POST', body: JSON.stringify(payload) });
export const updateCategory = (id, payload) => request(`/menu/categories/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
export const deleteCategory = (id) => request(`/menu/categories/${id}`, { method: 'DELETE' });
