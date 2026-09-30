<?php

namespace Tests\Unit\Modules\Webhook;

use App\Modules\Webhook\Enums\WebhookEvent;
use App\Modules\Webhook\Services\WebhookNotifier;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class WebhookNotifierTest extends TestCase
{
    public function test_send_does_nothing_when_url_is_unset(): void
    {
        config(['services.n8n.webhook_url' => '']);
        Http::fake();

        $notifier = new WebhookNotifier;
        $notifier->send(WebhookEvent::AssetRestored, 42, 'demo@brandvault.dev');

        Http::assertNothingSent();
    }

    public function test_send_posts_exact_payload_and_secret_header(): void
    {
        config([
            'services.n8n.webhook_url' => 'https://n8n.example.com/webhook/brandvault',
            'services.n8n.webhook_secret' => 'test-secret',
        ]);

        Http::fake([
            'https://n8n.example.com/webhook/brandvault' => Http::response(['ok' => true], 200),
        ]);

        $notifier = new WebhookNotifier;
        $notifier->send(WebhookEvent::AssetTagsSaved, 99, 'demo@brandvault.dev');

        Http::assertSent(function (Request $request): bool {
            $body = $request->data();

            return $request->url() === 'https://n8n.example.com/webhook/brandvault'
                && $request->hasHeader('X-Webhook-Secret', 'test-secret')
                && $request->hasHeader('Content-Type', 'application/json')
                && $body['event'] === 'asset.tags_saved'
                && $body['entity_type'] === 'asset'
                && $body['entity_id'] === '99'
                && $body['user_email'] === 'demo@brandvault.dev'
                && is_string($body['timestamp'] ?? null)
                && count($body) === 5;
        });
    }

    public function test_send_swallows_network_and_non_success_responses(): void
    {
        config([
            'services.n8n.webhook_url' => 'https://n8n.example.com/webhook/brandvault',
            'services.n8n.webhook_secret' => 'test-secret',
        ]);

        Log::spy();
        Http::fake([
            'https://n8n.example.com/webhook/brandvault' => Http::response('fail', 500),
        ]);

        $notifier = new WebhookNotifier;
        $notifier->send(WebhookEvent::BrandUpdated, 7, 'demo@brandvault.dev');

        Http::fake([
            'https://n8n.example.com/webhook/brandvault' => function () {
                throw new ConnectionException('timeout');
            },
        ]);

        $notifier->send(WebhookEvent::AssetRestored, 8, 'demo@brandvault.dev');

        $this->assertTrue(true);
    }
}
