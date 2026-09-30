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

## Features

- Brand kit (colors, logo, font)
- Nested folders + asset library with trash/restore
- AI-assisted tagging (generate → review → save)
- Optional n8n webhook notifications (bonus)

## n8n Webhook (Bonus)

Outbound, fire-and-forget notifications to n8n when key events succeed. Failures never block user actions.

### Events

| Event              | When                                   |
| ------------------ | -------------------------------------- |
| `asset.tags_saved` | Reviewed AI tags are saved on an asset |
| `asset.restored`   | An asset is restored from trash        |
| `brand.updated`    | Brand kit is created or updated        |

### Payload

```json
{
    "event": "asset.restored",
    "entity_type": "asset",
    "entity_id": "42",
    "user_email": "demo@brandvault.dev",
    "timestamp": "2026-09-30T10:15:00.000Z"
}
```

Headers:

- `Content-Type: application/json`
- `X-Webhook-Secret: <N8N_WEBHOOK_SECRET>`

### Environment

```env
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
```

If `N8N_WEBHOOK_URL` is empty, webhooks are skipped.

### Workflow (n8n)

Keep the n8n side small: receive → format message → log + email.

1. Import [`n8n/brandvault-webhook.json`](n8n/brandvault-webhook.json) into n8n.
2. Add Header Auth on the Webhook node for `X-Webhook-Secret` (or validate the header yourself).
3. In n8n, create an **SMTP** credential and attach it to the **Send Email** node. Replace placeholders `FROM_EMAIL_HERE` / `TO_EMAIL_HERE` with your addresses.
4. Activate the workflow and copy the **production** webhook URL (not `/webhook-test/`).
5. Set `N8N_WEBHOOK_URL` and `N8N_WEBHOOK_SECRET` on the server (Railway/etc.), then redeploy.

In n8n, open **Executions** to see each run. Enable “Save successful / error executions” if the list is empty.

### App DB log (`webhook_logs`)

Every attempt is written to Postgres so testers can verify without opening n8n:

| status    | Meaning                       |
| --------- | ----------------------------- |
| `sent`    | n8n returned 2xx              |
| `failed`  | HTTP error or network timeout |
| `skipped` | `N8N_WEBHOOK_URL` was empty   |

```bash
php artisan tinker --execute="dump(App\Modules\Webhook\Models\WebhookLog::query()->latest('id')->limit(10)->get(['id','event_type','status','http_status','payload','created_at'])->toArray());"
```

Or SQL:

```sql
SELECT id, user_id, event_type, status, http_status, payload, created_at
FROM webhook_logs
ORDER BY id DESC
LIMIT 20;
```

Tradeoff: webhooks are fire-and-forget with a 3s timeout. Failures never block user actions. There is no retry queue by design.
