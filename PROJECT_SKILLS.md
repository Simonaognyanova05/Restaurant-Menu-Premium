# Restaurant Menu Premium: Project Skills

Този документ определя уменията, стандартите и реда на работа по системата за дигитално меню на луксозен ресторант.

## 1. Product Discovery & Information Architecture

**Цел:** Да превърнем менюто в ясен продукт, а не просто в CRUD приложение.

**Отговорности:**
- Дефиниране на роли: публичен посетител, администратор и евентуално editor.
- Дефиниране на основните потоци: разглеждане на менюто, търсене, филтриране, създаване, редакция и изтриване.
- Моделиране на категории, ястия, цени, алергени, етикети, availability и подредба.
- Определяне на MVP и функционалности за следваща фаза.

**Готово е, когато:** има одобрен списък с екрани, роли, полета и бизнес правила.

## 2. Premium UX/UI & Design System

**Цел:** Интерфейсът да изглежда като дигитално преживяване за fine-dining ресторант, а не като административен шаблон.

**Отговорности:**
- Създаване на визуална посока: типография, цветове, spacing, iconography и photography.
- Responsive публично меню за телефон, таблет и desktop.
- Отделен, функционален admin интерфейс за бърза работа.
- Състояния за loading, empty, error, success, unavailable и delete confirmation.
- Достъпност: keyboard navigation, contrast, labels и focus states.

**Готово е, когато:** ключовите екрани имат последователен design system и са използваеми на мобилен екран.

## 3. Backend Architecture: Model-Service-Controller

**Цел:** Поддържаем Express backend с ясни граници между отговорностите.

**Отговорности:**
- `models/`: Mongoose schema и индекси.
- `services/`: бизнес логика и операции с данни.
- `controllers/`: HTTP request/response orchestration.
- `routes/`: endpoint mapping.
- `middlewares/`: auth, validation, error handling, rate limiting и logging.
- `utils/`: конфигурация, API errors, pagination и общи помощни функции.
- Централизиран `appError`/error middleware вместо разпръснати try/catch отговори.

**Готово е, когато:** controller-ите не съдържат бизнес логика, а service-ите могат да се тестват независимо от HTTP слоя.

## 4. MongoDB/Mongoose Data Modeling

**Цел:** Данните да са удобни за редактиране, бързо зареждане и бъдещо разширяване.

**Отговорности:**
- Модели `Category` и `Dish` с ясни референции и правила за изтриване.
- Уникални slug-ове, sort order и status/availability.
- Полета за цена, валута, описание, image URL, allergens, dietary tags и featured.
- Timestamps, validation, normalization и подходящи индекси.
- Защита от orphan dishes при изтриване на категория.

**Готово е, когато:** схемите валидират некоректни данни и основните list/filter заявки използват индекси.

## 5. REST API & Contract Design

**Цел:** Стабилен API договор между React frontend-а и Express backend-а.

**Основни ресурси:**
- `GET /api/menu`
- `GET /api/categories`
- `POST /api/categories`
- `PATCH /api/categories/:id`
- `DELETE /api/categories/:id`
- `GET /api/dishes`
- `GET /api/dishes/:id`
- `POST /api/dishes`
- `PATCH /api/dishes/:id`
- `DELETE /api/dishes/:id`

**Отговорности:**
- Единен response формат и предвидими HTTP status codes.
- Pagination, search, category filter, availability filter и sort order.
- Ясни validation error-и, които frontend-ът може да покаже директно.
- API документация чрез OpenAPI/Swagger или актуален endpoint документ.

**Готово е, когато:** всеки endpoint има request schema, response schema, error cases и authorization правило.

## 6. Authentication, Authorization & Security

**Цел:** Само оторизирани хора да управляват менюто.

**Отговорности:**
- Admin login с password hashing и JWT или secure session подход.
- Role-based authorization за admin/editor операции.
- Санитизация и schema validation на входа.
- CORS, Helmet, rate limiting, secure cookies/token policy и secrets чрез environment variables.
- Без изтичане на MongoDB credentials или stack traces в production.

**Готово е, когато:** публичният API е read-only, management endpoint-ите са защитени и security middleware-ите са покрити с тестове.

## 7. React Frontend Architecture

**Цел:** Чист React frontend със структура, близка до `create-react-app`, без хаотично разрастване.

**Препоръчителни слоеве:**
- `components/`: преизползваеми UI елементи.
- `pages/`: публично меню, login, dashboard, dish editor и category manager.
- `services/`: API client и auth client.
- `hooks/`: data loading и form behavior.
- `context/` или state layer: authentication и глобални UI състояния.
- `utils/`: formatters, constants и validation helpers.

**Отговорности:**
- Един API client с централизирано управление на auth и грешки.
- Form компоненти с client-side validation.
- Optimistic или targeted refresh поведение след CRUD операции.
- Route guards за admin зоната.

**Готово е, когато:** CRUD flow-овете работят без full-page reload и компонентите не дублират API логика.

## 8. Menu Management CRUD

**Цел:** Администраторът да създава, редактира, скрива и изтрива ястия и категории без технически знания.

**Отговорности:**
- Ясни форми за category и dish.
- Create/edit/delete с inline feedback.
- Confirm dialog при destructive actions.
- Drag-and-drop или надежден control за подреждане.
- Toggle за available/unavailable, без задължително изтриване.
- Защита от случайно изтриване и обработка на конфликтни промени.

**Готово е, когато:** целият lifecycle на ястие и категория се изпълнява от dashboard-а и всяка операция има success/error feedback.

## 9. Image & Content Management

**Цел:** Снимките и текстовете да поддържат premium усещането и бързото зареждане.

**Отговорности:**
- Избор на image storage стратегия: Cloudinary, S3-compatible storage или външен CDN.
- Image URL validation, размери, aspect ratio, alt text и fallback image.
- Preview преди публикуване и безопасно премахване/заместване.
- Добре форматирани описания, алергени и dietary labels.

**Готово е, когато:** снимка може да се добави/замени от admin-а, зарежда се оптимизирано и има достъпен fallback.

## 10. Testing & Quality Engineering

**Цел:** CRUD и публичното меню да са надеждни при реални промени.

**Отговорности:**
- Backend unit tests за services и validation.
- API integration tests за auth, categories и dishes.
- Frontend tests за forms, filters, loading/error states и route guards.
- Един end-to-end сценарий: login -> create category -> create dish -> edit -> hide -> delete.
- Linting, formatting и environment validation в CI.

**Готово е, когато:** критичният flow е автоматично проверен и regression грешките се хващат преди deploy.

## 11. Performance, SEO & Accessibility

**Цел:** Публичното меню да се усеща бързо, намеримо и професионално.

**Отговорности:**
- Lazy loading на изображения и разумни payload-и.
- Semantic HTML, metadata, Open Graph и структурирани данни за ресторант/меню.
- Lighthouse проверка за performance, accessibility и best practices.
- Mobile-first поведение и работа при бавна мрежа.

**Готово е, когато:** менюто остава удобно за използване на телефон и няма критични accessibility или performance проблеми.

## 12. Deployment, Observability & Operations

**Цел:** Системата да може да се поддържа след първия release.

**Отговорности:**
- Разделени `.env` конфигурации за development, test и production.
- MongoDB Atlas network access, least-privilege database user и backups.
- Deployment на frontend и backend с health check endpoint.
- Structured logs, request IDs и error monitoring.
- Seed script за demo меню и migration strategy при промяна на schema.

**Готово е, когато:** нов developer може да стартира проекта от README, а production проблем може да бъде диагностициран от логовете.

## Препоръчан ред на работа

1. Product Discovery & Information Architecture
2. Premium UX/UI & Design System
3. Backend Architecture и MongoDB/Mongoose модели
4. REST API contract и validation
5. Authentication и security
6. React архитектура и API client
7. Menu Management CRUD
8. Image & Content Management
9. Testing & Quality Engineering
10. Performance, SEO, accessibility и deployment

## Definition of Done за всяка функционалност

- Има frontend flow и backend endpoint.
- Има validation на client и server.
- Има loading, empty, success и error състояния.
- Има authorization проверка, ако операцията променя данни.
- Има поне един автоматизиран тест за критичното поведение.
- Работи на mobile и desktop.
- Не оставя orphan данни и не нарушава съществуващия API договор.
