# Brand Vault

Laravel + Inertia (React) application for managing brand assets.

## Stack

- **Backend:** Laravel 13, PHP 8.4+, PostgreSQL
- **Frontend:** React, Inertia, TypeScript, Vite+, Tailwind CSS
- **Quality:** Husky hooks, Pint, PHPStan/Larastan, Vite+ lint, PHPUnit

## Setup

```bash
composer setup
# or manually:
composer install
cp .env.example .env
php artisan key:generate
# configure PostgreSQL in .env, then:
createdb brand_vault   # if needed
php artisan migrate
pnpm install
pnpm exec husky        # enable git hooks (.npmrc has ignore-scripts=true)
pnpm dev
```

## Git hooks

| Hook           | What it enforces                                                           |
| -------------- | -------------------------------------------------------------------------- |
| **pre-commit** | Pint (PHP), Vite+ format/lint on staged `resources/js`, TypeScript (`tsc`) |
| **pre-push**   | Frontend build, lint, TypeScript + PHPStan, Laravel tests                  |

After `pnpm install`, run `pnpm exec husky` once so hooks are registered.

## Scripts

```bash
pnpm check          # Vite+ format + lint
pnpm types:check    # TypeScript
composer lint:check # Pint
composer types:check # PHPStan
composer test       # Pint + PHPStan + PHPUnit
composer ci:check   # Full CI suite
```
