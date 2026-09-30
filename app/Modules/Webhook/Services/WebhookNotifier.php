<?php

namespace App\Modules\Webhook\Services;

use App\Modules\Webhook\Enums\WebhookEvent;
use App\Modules\Webhook\Models\WebhookLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class WebhookNotifier
{
    public function send(
        WebhookEvent $event,
        int|string $entityId,
        string $userEmail,
        int $userId,
    ): void {
        $payload = [
            'event' => $event->value,
            'entity_type' => $event->entityType(),
            'entity_id' => (string) $entityId,
            'user_email' => $userEmail,
            'timestamp' => now()->utc()->format('Y-m-d\TH:i:s.v\Z'),
        ];

        $url = trim((string) config('services.n8n.webhook_url', ''));

        if ($url === '') {
            $this->persist($userId, $event, $payload, WebhookLog::STATUS_SKIPPED, null, 'N8N_WEBHOOK_URL is empty');

            return;
        }

        try {
            $response = Http::timeout(3)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'X-Webhook-Secret' => (string) config('services.n8n.webhook_secret', ''),
                ])
                ->post($url, $payload);

            if ($response->failed()) {
                $this->persist(
                    $userId,
                    $event,
                    $payload,
                    WebhookLog::STATUS_FAILED,
                    $response->status(),
                    'HTTP '.$response->status(),
                );
                Log::error('n8n webhook failed', [
                    'event' => $event->value,
                    'entity_id' => (string) $entityId,
                    'status' => $response->status(),
                ]);

                return;
            }

            $this->persist($userId, $event, $payload, WebhookLog::STATUS_SENT, $response->status());
        } catch (Throwable $exception) {
            $this->persist(
                $userId,
                $event,
                $payload,
                WebhookLog::STATUS_FAILED,
                null,
                $exception->getMessage(),
            );
            Log::error('n8n webhook error', [
                'event' => $event->value,
                'entity_id' => (string) $entityId,
                'message' => $exception->getMessage(),
            ]);
        }
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function persist(
        int $userId,
        WebhookEvent $event,
        array $payload,
        string $status,
        ?int $httpStatus,
        ?string $errorMessage = null,
    ): void {
        try {
            WebhookLog::query()->create([
                'user_id' => $userId,
                'event_type' => $event->value,
                'payload' => $payload,
                'status' => $status,
                'http_status' => $httpStatus,
                'error_message' => $errorMessage,
            ]);
        } catch (Throwable $exception) {
            Log::error('webhook_logs write failed', [
                'event' => $event->value,
                'message' => $exception->getMessage(),
            ]);
        }
    }
}
