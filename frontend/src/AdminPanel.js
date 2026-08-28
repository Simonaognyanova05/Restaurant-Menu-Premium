import { useEffect, useState } from 'react';
import './Admin.css';
import { createCategory, createDish, deleteCategory, deleteDish, fetchAdminMenu, loginAdmin, updateCategory, updateDish } from './services/menuApi';

const emptyDish = { name: '', description: '', price: '', currency: 'EUR', imageUrl: '', allergens: '', dietaryTags: '', category: '', sortOrder: 0, isAvailable: true, isFeatured: false };
const emptyCategory = { name: '', slug: '', description: '', sortOrder: 0 };
const toList = (value) => Array.isArray(value) ? value.join(', ') : value;

function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [menu, setMenu] = useState([]);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [dish, setDish] = useState(emptyDish);
  const [category, setCategory] = useState(emptyCategory);
  const [editingDish, setEditingDish] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMenu = async () => {
    setLoading(true);
    try { setMenu(await fetchAdminMenu()); setError(''); } catch (loadError) { setError(loadError.message); } finally { setLoading(false); }
  };

  useEffect(() => { if (token) loadMenu(); }, [token]);

  const runAction = async (action, successMessage) => {
    setLoading(true); setError(''); setMessage('');
    try { await action(); await loadMenu(); setMessage(successMessage); } catch (actionError) { setError(actionError.message); } finally { setLoading(false); }
  };

  const handleLogin = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try { const result = await loginAdmin(login.email, login.password); localStorage.setItem('adminToken', result.token); setToken(result.token); }
    catch (loginError) { setError(loginError.message); } finally { setLoading(false); }
  };

  const handleDishSubmit = (event) => {
    event.preventDefault();
    const payload = { ...dish, price: Number(dish.price), sortOrder: Number(dish.sortOrder), allergens: dish.allergens.split(',').map((item) => item.trim()).filter(Boolean), dietaryTags: dish.dietaryTags.split(',').map((item) => item.trim()).filter(Boolean) };
    const action = editingDish ? () => updateDish(editingDish, payload) : () => createDish(payload);
    runAction(action, editingDish ? 'Dish updated.' : 'Dish added.');
    setDish(emptyDish); setEditingDish(null);
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();
    const payload = { ...category, sortOrder: Number(category.sortOrder) };
    const action = editingCategory ? () => updateCategory(editingCategory, payload) : () => createCategory(payload);
    runAction(action, editingCategory ? 'Category updated.' : 'Category added.');
    setCategory(emptyCategory); setEditingCategory(null);
  };

  const startEditDish = (item, categoryId) => setDish({ ...item, category: categoryId, allergens: toList(item.allergens), dietaryTags: toList(item.dietaryTags) }) || setEditingDish(item._id);
  const startEditCategory = (item) => { setCategory(item); setEditingCategory(item._id); };
  const logout = () => { localStorage.removeItem('adminToken'); setToken(null); };

  if (!token) return <main className="admin-page"><div className="admin-login"><a className="admin-brand" href="#top">AURELIA <span>/</span> 21</a><p className="admin-kicker">Private access</p><h1>Welcome back.</h1><p className="admin-muted">Sign in to shape tonight's menu.</p><form onSubmit={handleLogin}><label>Email<input type="email" required value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} /></label><label>Password<input type="password" required value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} /></label><button className="admin-primary" disabled={loading}>{loading ? 'Signing in...' : 'Enter the studio'} <span>↗</span></button></form>{error && <p className="admin-error">{error}</p>}<a className="back-link" href="#top">← Back to public menu</a></div></main>;

  return <main className="admin-page"><header className="admin-header"><a className="admin-brand" href="#top">AURELIA <span>/</span> 21</a><div><span className="admin-status">● Live studio</span><button className="admin-logout" type="button" onClick={logout}>Sign out</button></div></header><section className="admin-content"><div className="admin-intro"><div><p className="admin-kicker">Menu management</p><h1>The studio.</h1></div><a className="back-link" href="#top">View public menu ↗</a></div>{message && <p className="admin-success">{message}</p>}{error && <p className="admin-error">{error}</p>}<div className="admin-grid"><section className="admin-card"><div className="card-heading"><div><p className="admin-kicker">{editingDish ? 'Edit dish' : 'New dish'}</p><h2>{editingDish ? 'Refine the plate' : 'Add to the menu'}</h2></div>{editingDish && <button className="cancel-button" type="button" onClick={() => { setEditingDish(null); setDish(emptyDish); }}>Cancel</button>}</div><form onSubmit={handleDishSubmit} className="admin-form"><label>Dish name<input required value={dish.name} onChange={(event) => setDish({ ...dish, name: event.target.value })} /></label><label>Description<textarea required rows="3" value={dish.description} onChange={(event) => setDish({ ...dish, description: event.target.value })} /></label><div className="form-row"><label>Price<input required type="number" min="0" step="0.01" value={dish.price} onChange={(event) => setDish({ ...dish, price: event.target.value })} /></label><label>Currency<input maxLength="3" value={dish.currency} onChange={(event) => setDish({ ...dish, currency: event.target.value.toUpperCase() })} /></label></div><label>Category<select required value={dish.category} onChange={(event) => setDish({ ...dish, category: event.target.value })}><option value="">Choose a category</option>{menu.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label><label>Image URL<input type="url" value={dish.imageUrl} onChange={(event) => setDish({ ...dish, imageUrl: event.target.value })} placeholder="https://..." /></label><div className="form-row"><label>Allergens <small>comma separated</small><input value={dish.allergens} onChange={(event) => setDish({ ...dish, allergens: event.target.value })} /></label><label>Dietary tags <small>comma separated</small><input value={dish.dietaryTags} onChange={(event) => setDish({ ...dish, dietaryTags: event.target.value })} /></label></div><div className="toggle-row"><label><input type="checkbox" checked={dish.isAvailable} onChange={(event) => setDish({ ...dish, isAvailable: event.target.checked })} /> Available</label><label><input type="checkbox" checked={dish.isFeatured} onChange={(event) => setDish({ ...dish, isFeatured: event.target.checked })} /> Chef's selection</label></div><button className="admin-primary" disabled={loading}>{editingDish ? 'Save changes' : 'Add dish'} <span>↗</span></button></form></section><section className="admin-card category-card"><div className="card-heading"><div><p className="admin-kicker">Structure</p><h2>Categories</h2></div></div><form onSubmit={handleCategorySubmit} className="admin-form compact"><label>Name<input required value={category.name} onChange={(event) => setCategory({ ...category, name: event.target.value })} /></label><label>Slug<input required value={category.slug} onChange={(event) => setCategory({ ...category, slug: event.target.value })} placeholder="appetizers" /></label><label>Description<textarea rows="2" value={category.description} onChange={(event) => setCategory({ ...category, description: event.target.value })} /></label><button className="admin-secondary" disabled={loading}>{editingCategory ? 'Save category' : 'Add category'}</button></form><div className="category-list">{menu.map((item) => <div className="category-item" key={item._id}><div><strong>{item.name}</strong><small>{item.dishes.length} dishes</small></div><div><button type="button" onClick={() => startEditCategory(item)}>Edit</button><button type="button" onClick={() => window.confirm(`Delete ${item.name}? This also deletes its dishes.`) && runAction(() => deleteCategory(item._id), 'Category deleted.')}>Delete</button></div></div>)}</div></section></div><section className="dish-inventory"><div className="inventory-heading"><div><p className="admin-kicker">Live inventory</p><h2>Every dish, considered.</h2></div><span>{menu.reduce((total, item) => total + item.dishes.length, 0)} dishes</span></div>{loading && <p className="admin-muted">Updating menu...</p>}{menu.map((item) => <div className="inventory-category" key={item._id}><h3>{item.name}</h3>{item.dishes.map((itemDish) => <div className="inventory-row" key={itemDish._id}><div><strong>{itemDish.name}</strong><small>{itemDish.description}</small></div><span className={itemDish.isAvailable ? 'available' : 'hidden'}>{itemDish.isAvailable ? 'Published' : 'Hidden'}</span><span className="inventory-price">{Number(itemDish.price).toFixed(2)} {itemDish.currency}</span><button type="button" onClick={() => startEditDish(itemDish, item._id) || window.scrollTo({ top: 0, behavior: 'smooth' })}>Edit</button><button className="delete-action" type="button" onClick={() => window.confirm(`Delete ${itemDish.name}?`) && runAction(() => deleteDish(itemDish._id), 'Dish deleted.')}>Delete</button></div>)}</div>)}</section></section></main>;
}

export default AdminPanel;
