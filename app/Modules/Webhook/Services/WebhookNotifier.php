<?php

namespace App\Modules\Webhook\Services;

use App\Modules\Webhook\Enums\WebhookEvent;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class WebhookNotifier
{
    public function send(
        WebhookEvent $event,
        int|string $entityId,
        string $userEmail,
    ): void {
        $url = trim((string) config('services.n8n.webhook_url', ''));

        if ($url === '') {
            return;
        }

        $payload = [
            'event' => $event->value,
            'entity_type' => $event->entityType(),
            'entity_id' => (string) $entityId,
            'user_email' => $userEmail,
            'timestamp' => now()->utc()->format('Y-m-d\TH:i:s.v\Z'),
        ];

        try {
            $response = Http::timeout(3)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'X-Webhook-Secret' => (string) config('services.n8n.webhook_secret', ''),
                ])
                ->post($url, $payload);

            if ($response->failed()) {
                Log::error('n8n webhook failed', [
                    'event' => $event->value,
                    'entity_id' => (string) $entityId,
                    'status' => $response->status(),
                ]);
            }
        } catch (Throwable $exception) {
            Log::error('n8n webhook error', [
                'event' => $event->value,
                'entity_id' => (string) $entityId,
                'message' => $exception->getMessage(),
            ]);
        }
    }
}
