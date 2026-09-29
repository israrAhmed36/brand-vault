FROM php:8.4-cli-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip curl ca-certificates \
    libpq-dev libzip-dev \
    && docker-php-ext-install pdo_pgsql zip \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && corepack enable \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN composer dump-autoload --optimize \
    && php artisan package:discover --ansi \
    && pnpm run build \
    && rm -rf node_modules

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "php artisan migrate --force && php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan storage:link; php artisan serve --host=0.0.0.0 --port=${PORT}"]
