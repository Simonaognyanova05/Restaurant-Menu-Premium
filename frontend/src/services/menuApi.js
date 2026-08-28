const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchMenu = async () => {
  const response = await fetch(`${API_URL}/menu`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Unable to load menu');
  }

  return result.data;
};
