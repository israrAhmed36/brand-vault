<?php

namespace Tests\Unit\Modules\Webhook;

use App\Models\User;
use App\Modules\Webhook\Enums\WebhookEvent;
use App\Modules\Webhook\Models\WebhookLog;
use App\Modules\Webhook\Services\WebhookNotifier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class WebhookNotifierTest extends TestCase
{
    use RefreshDatabase;

    public function test_send_logs_skipped_when_url_is_unset(): void
    {
        config(['services.n8n.webhook_url' => '']);
        Http::fake();
        $user = User::factory()->create();

        (new WebhookNotifier)->send(
            WebhookEvent::AssetRestored,
            42,
            (string) $user->email,
            $user->id,
        );

        Http::assertNothingSent();
        $this->assertDatabaseHas('webhook_logs', [
            'user_id' => $user->id,
            'event_type' => 'asset.restored',
            'status' => WebhookLog::STATUS_SKIPPED,
        ]);
    }

    public function test_send_posts_payload_and_logs_sent(): void
    {
        config([
            'services.n8n.webhook_url' => 'https://n8n.example.com/webhook/brandvault',
            'services.n8n.webhook_secret' => 'test-secret',
        ]);
        Http::fake([
            'https://n8n.example.com/webhook/brandvault' => Http::response(['ok' => true], 200),
        ]);
        $user = User::factory()->create();

        (new WebhookNotifier)->send(
            WebhookEvent::AssetTagsSaved,
            99,
            (string) $user->email,
            $user->id,
        );

        Http::assertSent(function (Request $request) use ($user): bool {
            $body = $request->data();

            return $request->url() === 'https://n8n.example.com/webhook/brandvault'
                && $request->hasHeader('X-Webhook-Secret', 'test-secret')
                && $body['event'] === 'asset.tags_saved'
                && $body['entity_id'] === '99'
                && $body['user_email'] === $user->email
                && count($body) === 5;
        });
        $this->assertDatabaseHas('webhook_logs', [
            'user_id' => $user->id,
            'event_type' => 'asset.tags_saved',
            'status' => WebhookLog::STATUS_SENT,
            'http_status' => 200,
        ]);
    }

    public function test_send_logs_failed_without_throwing(): void
    {
        config([
            'services.n8n.webhook_url' => 'https://n8n.example.com/webhook/brandvault',
            'services.n8n.webhook_secret' => 'test-secret',
        ]);
        Log::spy();
        $user = User::factory()->create();

        Http::fake([
            'https://n8n.example.com/webhook/brandvault' => Http::response('fail', 500),
        ]);
        (new WebhookNotifier)->send(
            WebhookEvent::BrandUpdated,
            7,
            (string) $user->email,
            $user->id,
        );

        Http::fake([
            'https://n8n.example.com/webhook/brandvault' => function () {
                throw new ConnectionException('timeout');
            },
        ]);
        (new WebhookNotifier)->send(
            WebhookEvent::AssetRestored,
            8,
            (string) $user->email,
            $user->id,
        );

        $this->assertSame(2, WebhookLog::query()->where('status', WebhookLog::STATUS_FAILED)->count());
    }
}
