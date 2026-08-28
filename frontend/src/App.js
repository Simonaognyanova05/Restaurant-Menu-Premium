import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { fetchMenu } from './services/menuApi';
import AdminPanel from './AdminPanel';

function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleHashChange = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    fetchMenu()
      .then(setMenu)
      .catch((loadError) => setError(loadError.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredMenu = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return menu
      .filter((category) => activeCategory === 'all' || category._id === activeCategory)
      .map((category) => ({
        ...category,
        dishes: category.dishes.filter((dish) => !normalizedSearch || `${dish.name} ${dish.description || ''} ${(dish.dietaryTags || []).join(' ')}`.toLowerCase().includes(normalizedSearch)),
      }))
      .filter((category) => category.dishes.length > 0);
  }, [activeCategory, menu, searchTerm]);

  const featuredDishes = menu.flatMap((category) => category.dishes.filter((dish) => dish.isFeatured).map((dish) => ({ ...dish, category: category.name }))).slice(0, 3);
  const scrollToMenu = () => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });

  if (isAdmin) return <AdminPanel />;

  return (
    <main>
      <nav className="topbar" aria-label="Primary navigation"><a className="wordmark" href="#top">AURELIA <span>/</span> 21</a><div className="topbar-links"><a href="#menu">The menu</a><a href="#experience">Our philosophy</a><button className="reserve-button" type="button" onClick={() => window.alert('Please call +359 2 951 21 21 to reserve your table.')}>Reserve a table <span aria-hidden="true">↗</span></button></div></nav>
      <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">Sofia · Since 2021</p><h1>A quiet kind<br /><em>of luxury.</em></h1><p className="hero-intro">A seasonal tasting menu shaped by the Bulgarian landscape, served with intention.</p><button className="text-link" type="button" onClick={scrollToMenu}>Explore the menu <span aria-hidden="true">↓</span></button></div><p className="hero-note">Chef's table<br />Open Tuesday — Saturday</p></section>
      <section className="experience-band" id="experience"><p className="eyebrow">The Aurelia approach</p><p className="statement">We let the ingredient<br />take the <em>lead.</em></p><p className="band-copy">Our menu moves with the seasons. Every plate is a study in balance: local produce, thoughtful technique, and just enough surprise.</p></section>
      <section className="menu-shell" id="menu"><div className="section-heading"><div><p className="eyebrow">The current menu</p><h2>From the kitchen</h2></div><p className="menu-meta">A la carte · 12:00 — 23:00<br />Please allow 20 minutes for preparation.</p></div>
        {featuredDishes.length > 0 && !searchTerm && activeCategory === 'all' && <section className="featured" aria-label="Chef's selection"><div className="featured-label"><span>01</span><p className="eyebrow">Chef's selection</p></div><div className="featured-grid">{featuredDishes.map((dish) => <div className="featured-dish" key={dish._id}><div className="dish-image" style={{ backgroundImage: `url(${dish.imageUrl || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85'})` }} /><p className="dish-category">{dish.category}</p><h3>{dish.name}</h3><span className="price">{Number(dish.price).toFixed(2)} <small>{dish.currency}</small></span></div>)}</div></section>}
        <div className="menu-controls"><div className="category-tabs" role="tablist" aria-label="Menu categories"><button className={activeCategory === 'all' ? 'active' : ''} type="button" onClick={() => setActiveCategory('all')}>All dishes</button>{menu.map((category) => <button className={activeCategory === category._id ? 'active' : ''} type="button" key={category._id} onClick={() => setActiveCategory(category._id)}>{category.name}</button>)}</div><label className="search-box"><span aria-hidden="true">⌕</span><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search menu" aria-label="Search menu" /></label></div>
        {isLoading && <p className="state-message">Preparing tonight's selection<span className="loading-dots">...</span></p>}{error && <p className="state-message error-message">{error}</p>}{!isLoading && !error && menu.length === 0 && <p className="state-message">Our menu is being prepared. Please return shortly.</p>}{!isLoading && !error && menu.length > 0 && filteredMenu.length === 0 && <p className="state-message">No dishes match your search.</p>}
        <div className="menu-list" aria-label="Restaurant menu">{filteredMenu.map((category, categoryIndex) => <article className="category" key={category._id}><div className="category-heading"><span className="category-number">0{categoryIndex + 1}</span><div><h2>{category.name}</h2>{category.description && <p>{category.description}</p>}</div></div><div className="dish-list">{category.dishes.map((dish) => <div className={`dish ${dish.isAvailable === false ? 'unavailable' : ''}`} key={dish._id}><div><h3>{dish.name}</h3><p>{dish.description}</p>{dish.allergens?.length > 0 && <small>Contains: {dish.allergens.join(', ')}</small>}{dish.isAvailable === false && <small className="availability">Currently unavailable</small>}</div><span className="price">{Number(dish.price).toFixed(2)} <small>{dish.currency}</small></span></div>)}</div></article>)}</div>
      </section><footer><span className="wordmark">AURELIA <span>/</span> 21</span><span>25 Oborishte · Sofia</span><a href="#admin">Admin ↗</a></footer>
    </main>
  );
}

export default App;
