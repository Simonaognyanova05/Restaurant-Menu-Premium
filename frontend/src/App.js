import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { fetchMenu } from './services/menuApi';
import { translateMenu } from './services/translationApi';
import AdminPanel from './AdminPanel';
import { languages, translations } from './i18n';

function LanguageSwitcher({ language, onChange, label }) {
  return <label className='language-switcher'><span className='sr-only'>{label}</span><select value={language} onChange={(e) => onChange(e.target.value)} aria-label={label}>{languages.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>;
}

function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');
  const [menu, setMenu] = useState([]);
  const [translatedMenu, setTranslatedMenu] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState(() => localStorage.getItem('menuLanguage') || 'bg');
  const t = translations[language] || translations.bg;

  useEffect(() => {
    const handleHashChange = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  useEffect(() => { fetchMenu().then(setMenu).catch((e) => setError(e.message)).finally(() => setIsLoading(false)); }, []);
  useEffect(() => { localStorage.setItem('menuLanguage', language); document.documentElement.lang = language; }, [language]);
  useEffect(() => {
    let cancelled = false;
    if (!menu.length || language === 'bg') {
      setTranslatedMenu(menu);
      setIsTranslating(false);
      return () => { cancelled = true; };
    }
    setIsTranslating(true);
    setTranslatedMenu([]);
    translateMenu(menu, language).then((result) => {
      if (!cancelled) setTranslatedMenu(result);
    }).finally(() => {
      if (!cancelled) setIsTranslating(false);
    });
    return () => { cancelled = true; };
  }, [language, menu]);

  const filteredMenu = useMemo(() => {
    const search = searchTerm.trim().toLocaleLowerCase(language);
    return translatedMenu.filter((category) => activeCategory === 'all' || category._id === activeCategory)
      .map((category) => ({ ...category, dishes: category.dishes.filter((dish) => !search || `${dish.name} ${dish.description || ''} ${(dish.dietaryTags || []).join(' ')}`.toLocaleLowerCase(language).includes(search)) }))
      .filter((category) => category.dishes.length > 0);
  }, [activeCategory, language, searchTerm, translatedMenu]);

  const featured = translatedMenu.flatMap((category) => category.dishes.filter((dish) => dish.isFeatured).map((dish) => ({ ...dish, category: category.name }))).slice(0, 3);
  if (isAdmin) return <AdminPanel />;

  return <main>
    <nav className='topbar' aria-label={t.nav}>
      <a className='wordmark' href='#top'>AURELIA <span>/</span> 21</a>
      <div className='topbar-links'><a href='#menu'>{t.menu}</a><a href='#experience'>{t.philosophy}</a><LanguageSwitcher language={language} onChange={setLanguage} label={t.language} /></div>
    </nav>
    <section className='hero' id='top'><div className='hero-copy'><p className='eyebrow'>{t.location}</p><h1>{t.hero1}<br /><em>{t.hero2}</em></h1><p className='hero-intro'>{t.intro}</p><button className='text-link' type='button' onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>{t.explore} <span aria-hidden='true'>↓</span></button></div><p className='hero-note'>{t.table}<br />{t.days}</p></section>
    <section className='experience-band' id='experience'><p className='eyebrow'>{t.approach}</p><p className='statement'>{t.statement1}<br /><em>{t.statement2}</em></p><p className='band-copy'>{t.band}</p></section>
    <section className='menu-shell' id='menu'>
      <div className='section-heading'><div><p className='eyebrow'>{t.current}</p><h2>{t.kitchen}</h2></div><p className='menu-meta'>{t.meta1}<br />{t.meta2}</p></div>
      {featured.length > 0 && !searchTerm && activeCategory === 'all' && <section className='featured' aria-label={t.featured}><div className='featured-label'><span>01</span><p className='eyebrow'>{t.featured}</p></div><div className='featured-grid'>{featured.map((dish) => <div className='featured-dish' key={dish._id}><div className='dish-image' style={{ backgroundImage: `url(${dish.imageUrl || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85'})` }} /><p className='dish-category'>{dish.category}</p><h3>{dish.name}</h3><span className='price'>{Number(dish.price).toFixed(2)} <small>{dish.currency}</small></span></div>)}</div></section>}
      <div className='menu-controls'><div className='category-tabs' role='tablist' aria-label={t.categories}><button className={activeCategory === 'all' ? 'active' : ''} type='button' onClick={() => setActiveCategory('all')}>{t.all}</button>{translatedMenu.map((category) => <button className={activeCategory === category._id ? 'active' : ''} type='button' key={category._id} onClick={() => setActiveCategory(category._id)}>{category.name}</button>)}</div><label className='search-box'><span aria-hidden='true'>⌕</span><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t.search} aria-label={t.search} /></label></div>
      {(isLoading || isTranslating) && <p className='state-message'>{t.loading}<span className='loading-dots'>...</span></p>}
      {error && <p className='state-message error-message'>{error}</p>}
      {!isLoading && !error && menu.length === 0 && <p className='state-message'>{t.empty}</p>}
      {!isLoading && !isTranslating && !error && menu.length > 0 && filteredMenu.length === 0 && <p className='state-message'>{t.none}</p>}
      <div className='menu-list' aria-label={t.restaurantMenu}>{filteredMenu.map((category, index) => <article className='category' key={category._id}><div className='category-heading'><span className='category-number'>{String(index + 1).padStart(2, '0')}</span><div><h2>{category.name}</h2>{category.description && <p>{category.description}</p>}</div></div><div className='dish-list'>{category.dishes.map((dish) => <div className={`dish ${dish.isAvailable === false ? 'unavailable' : ''}`} key={dish._id}><div><h3>{dish.name}</h3><p>{dish.description}</p>{dish.allergens?.length > 0 && <small>{t.contains}: {dish.allergens.join(', ')}</small>}{dish.isAvailable === false && <small className='availability'>{t.unavailable}</small>}</div><span className='price'>{Number(dish.price).toFixed(2)} <small>{dish.currency}</small></span></div>)}</div></article>)}</div>
    </section>
    <footer><span className='wordmark'>AURELIA <span>/</span> 21</span><span>{t.address}</span><a href='#admin'>{t.admin} ↗</a></footer>
  </main>;
}
export default App;
