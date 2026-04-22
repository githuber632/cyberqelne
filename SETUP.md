# CyberQELN — Инструкция по запуску

## Быстрый старт (разработка)

### 1. Требования
- Node.js 22+
- PostgreSQL 16+
- npm или pnpm

### 2. Backend

```bash
cd backend

# Установка зависимостей
npm install

# Скопируй .env.example -> .env и заполни переменные
cp .env.example .env

# Создать базу данных
createdb cyberqeln

# Применить миграции
npx prisma migrate dev

# Сгенерировать Prisma Client
npx prisma generate

# Заполнить тестовыми данными
npm run db:seed

# Запуск в dev режиме
npm run start:dev
```

API доступен на: http://localhost:4000
Swagger документация: http://localhost:4000/api/docs

### 3. Frontend

```bash
cd frontend

# Установка зависимостей
npm install

# Скопируй .env.local.example -> .env.local
cp .env.local .env.local

# Запуск
npm run dev
```

Сайт доступен на: http://localhost:3000

---

## Запуск через Docker (production)

```bash
# Клонируй репо
git clone https://github.com/yourusername/cyberqeln.git
cd cyberqeln

# Создай .env файл
cp .env.example .env
# Заполни JWT_SECRET, DB_PASSWORD, FRONTEND_URL

# Запуск
docker-compose up -d

# Применить миграции
docker-compose exec backend npx prisma migrate deploy

# Заполнить начальными данными
docker-compose exec backend npm run db:seed
```

---

## Деплой (Production)

### Рекомендуемая инфраструктура:

```
┌─────────────────────────────────────────────────┐
│                   CloudFlare CDN                │
│              (DNS + DDoS protection)            │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│               Nginx (reverse proxy)             │
│         frontend:3000  │  backend:4000          │
└────────────┬───────────┴────────────────────────┘
             │                    │
    ┌────────▼──────┐    ┌────────▼──────┐
    │  Next.js App  │    │  NestJS API   │
    │  (Vercel /    │    │  (Railway /   │
    │   Docker)     │    │   Render)     │
    └───────────────┘    └───────┬───────┘
                                 │
                    ┌────────────▼────────────┐
                    │  PostgreSQL (Supabase /  │
                    │  Railway / AWS RDS)      │
                    └─────────────────────────┘
```

### Вариант 1: Vercel + Railway (быстрый)

**Frontend (Vercel):**
```bash
# Установи Vercel CLI
npm i -g vercel

# Деплой
cd frontend
vercel --prod
```

**Backend (Railway):**
- Зайди на railway.app
- Создай проект → добавь PostgreSQL
- Подключи GitHub репо → выбери папку backend
- Укажи переменные окружения из .env.example

### Вариант 2: VPS + Docker (полный контроль)

```bash
# На сервере (Ubuntu 22+)
apt update && apt install -y docker.io docker-compose-plugin

# Клонируй проект
git clone https://github.com/yourname/cyberqeln.git
cd cyberqeln

# Настрой env
nano .env

# Запуск
docker compose up -d

# Настрой Nginx
# /etc/nginx/sites-available/cyberqeln
server {
    listen 80;
    server_name cyberqeln.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    location /api {
        proxy_pass http://localhost:4000;
    }

    location /socket.io {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

# SSL через Let's Encrypt
certbot --nginx -d cyberqeln.com
```

---

## Тестовые аккаунты (после seed)

| Email | Password | Role |
|-------|----------|------|
| admin@cyberqeln.com | Admin123! | Admin |
| ph@cyberqeln.com | Demo123! | User (Team Phantom) |
| demo@cyberqeln.com | demo123 | User (demo) |

---

## Структура проекта

```
cyberqeln/
├── frontend/                    # Next.js 15 приложение
│   ├── app/                     # App Router страницы
│   │   ├── page.tsx             # Главная страница
│   │   ├── dashboard/           # Личный кабинет
│   │   ├── tournaments/         # Турниры
│   │   ├── teams/               # Команды
│   │   ├── shop/                # Магазин
│   │   ├── admin/               # Админ панель
│   │   └── auth/                # Авторизация
│   ├── components/
│   │   ├── ui/                  # Базовые UI компоненты
│   │   ├── layout/              # Navbar, Footer, Providers
│   │   ├── features/            # Фичи (home, auth, tournaments...)
│   │   └── animations/          # Framer Motion компоненты
│   ├── lib/
│   │   ├── api.ts               # Axios API клиент
│   │   └── utils.ts             # Утилиты
│   ├── store/
│   │   └── authStore.ts         # Zustand auth store
│   └── hooks/
│       └── useWebSocket.ts      # Socket.io хуки
│
├── backend/                     # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/            # JWT авторизация
│   │   │   ├── users/           # Пользователи
│   │   │   ├── tournaments/     # Турниры + брекет
│   │   │   ├── teams/           # Команды
│   │   │   ├── rankings/        # ELO рейтинг
│   │   │   ├── shop/            # E-commerce
│   │   │   ├── community/       # Посты, комменты
│   │   │   ├── media/           # Видео
│   │   │   ├── admin/           # Админ эндпоинты
│   │   │   └── websockets/      # Socket.io gateway
│   │   └── common/
│   │       ├── guards/          # JWT guard
│   │       ├── decorators/      # @CurrentUser
│   │       └── filters/         # Exception filters
│   └── prisma/
│       ├── schema.prisma        # Полная схема БД
│       └── seed.ts              # Начальные данные
│
└── docker-compose.yml           # Полный стек
```
