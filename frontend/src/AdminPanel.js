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
    runAction(action, editingDish ? 'Ястието е обновено.' : 'Ястието е добавено.');
    setDish(emptyDish); setEditingDish(null);
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();
    const payload = { ...category, sortOrder: Number(category.sortOrder) };
    const action = editingCategory ? () => updateCategory(editingCategory, payload) : () => createCategory(payload);
    runAction(action, editingCategory ? 'Категорията е обновена.' : 'Категорията е добавена.');
    setCategory(emptyCategory); setEditingCategory(null);
  };

  const startEditDish = (item, categoryId) => setDish({ ...item, category: categoryId, allergens: toList(item.allergens), dietaryTags: toList(item.dietaryTags) }) || setEditingDish(item._id);
  const startEditCategory = (item) => { setCategory(item); setEditingCategory(item._id); };
  const logout = () => { localStorage.removeItem('adminToken'); setToken(null); };

  if (!token) return <main className="admin-page"><div className="admin-login"><a className="admin-brand" href="#top">AURELIA <span>/</span> 21</a><p className="admin-kicker">Частен достъп</p><h1>Добре дошли.</h1><p className="admin-muted">Влезте, за да оформите менюто за тази вечер.</p><form onSubmit={handleLogin}><label>Имейл<input type="email" required value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} /></label><label>Парола<input type="password" required value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} /></label><button className="admin-primary" disabled={loading}>{loading ? 'Влизане...' : 'Влез в студиото'} <span>↗</span></button></form>{error && <p className="admin-error">{error}</p>}<a className="back-link" href="#top">← Към публичното меню</a></div></main>;

  return <main className="admin-page"><header className="admin-header"><a className="admin-brand" href="#top">AURELIA <span>/</span> 21</a><div><span className="admin-status">● Студиото е активно</span><button className="admin-logout" type="button" onClick={logout}>Изход</button></div></header><section className="admin-content"><div className="admin-intro"><div><p className="admin-kicker">Управление на менюто</p><h1>Студиото.</h1></div><a className="back-link" href="#top">Публично меню ↗</a></div>{message && <p className="admin-success">{message}</p>}{error && <p className="admin-error">{error}</p>}<div className="admin-grid"><section className="admin-card"><div className="card-heading"><div><p className="admin-kicker">{editingDish ? 'Редакция на ястие' : 'Ново ястие'}</p><h2>{editingDish ? 'Усъвършенствайте ястието' : 'Добавете в менюто'}</h2></div>{editingDish && <button className="cancel-button" type="button" onClick={() => { setEditingDish(null); setDish(emptyDish); }}>Отказ</button>}</div><form onSubmit={handleDishSubmit} className="admin-form"><label>Име на ястието<input required value={dish.name} onChange={(event) => setDish({ ...dish, name: event.target.value })} /></label><label>Описание<textarea required rows="3" value={dish.description} onChange={(event) => setDish({ ...dish, description: event.target.value })} /></label><div className="form-row"><label>Цена<input required type="number" min="0" step="0.01" value={dish.price} onChange={(event) => setDish({ ...dish, price: event.target.value })} /></label><label>Валута<input maxLength="3" value={dish.currency} onChange={(event) => setDish({ ...dish, currency: event.target.value.toUpperCase() })} /></label></div><label>Категория<select required value={dish.category} onChange={(event) => setDish({ ...dish, category: event.target.value })}><option value="">Изберете категория</option>{menu.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}</select></label><label>URL на изображение<input type="url" value={dish.imageUrl} onChange={(event) => setDish({ ...dish, imageUrl: event.target.value })} placeholder="https://..." /></label><div className="form-row"><label>Алергени <small>разделени със запетая</small><input value={dish.allergens} onChange={(event) => setDish({ ...dish, allergens: event.target.value })} /></label><label>Диетични етикети <small>разделени със запетая</small><input value={dish.dietaryTags} onChange={(event) => setDish({ ...dish, dietaryTags: event.target.value })} /></label></div><div className="toggle-row"><label><input type="checkbox" checked={dish.isAvailable} onChange={(event) => setDish({ ...dish, isAvailable: event.target.checked })} /> Публикувано</label><label><input type="checkbox" checked={dish.isFeatured} onChange={(event) => setDish({ ...dish, isFeatured: event.target.checked })} /> Избор на шеф-готвача</label></div><button className="admin-primary" disabled={loading}>{editingDish ? 'Запази промените' : 'Добави ястие'} <span>↗</span></button></form></section><section className="admin-card category-card"><div className="card-heading"><div><p className="admin-kicker">Структура</p><h2>Категории</h2></div></div><form onSubmit={handleCategorySubmit} className="admin-form compact"><label>Име<input required value={category.name} onChange={(event) => setCategory({ ...category, name: event.target.value })} /></label><label>Slug<input required value={category.slug} onChange={(event) => setCategory({ ...category, slug: event.target.value })} placeholder="предястия" /></label><label>Описание<textarea rows="2" value={category.description} onChange={(event) => setCategory({ ...category, description: event.target.value })} /></label><button className="admin-secondary" disabled={loading}>{editingCategory ? 'Запази категорията' : 'Добави категория'}</button></form><div className="category-list">{menu.map((item) => <div className="category-item" key={item._id}><div><strong>{item.name}</strong><small>{item.dishes.length} ястия</small></div><div><button type="button" onClick={() => startEditCategory(item)}>Редактирай</button><button type="button" onClick={() => window.confirm(`Изтриване на ${item.name}? Ястията в нея също ще бъдат изтрити.`) && runAction(() => deleteCategory(item._id), 'Категорията е изтрита.')}>Изтрий</button></div></div>)}</div></section></div><section className="dish-inventory"><div className="inventory-heading"><div><p className="admin-kicker">Активно меню</p><h2>Всяко ястие има значение.</h2></div><span>{menu.reduce((total, item) => total + item.dishes.length, 0)} ястия</span></div>{loading && <p className="admin-muted">Обновяване на менюто...</p>}{menu.map((item) => <div className="inventory-category" key={item._id}><h3>{item.name}</h3>{item.dishes.map((itemDish) => <div className="inventory-row" key={itemDish._id}><div><strong>{itemDish.name}</strong><small>{itemDish.description}</small></div><span className={itemDish.isAvailable ? 'available' : 'hidden'}>{itemDish.isAvailable ? 'Публикувано' : 'Скрито'}</span><span className="inventory-price">{Number(itemDish.price).toFixed(2)} {itemDish.currency}</span><button type="button" onClick={() => startEditDish(itemDish, item._id) || window.scrollTo({ top: 0, behavior: 'smooth' })}>Редактирай</button><button className="delete-action" type="button" onClick={() => window.confirm(`Изтриване на ${itemDish.name}?`) && runAction(() => deleteDish(itemDish._id), 'Ястието е изтрито.')}>Изтрий</button></div>)}</div>)}</section></section></main>;
}

export default AdminPanel;
