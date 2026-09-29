<?php

namespace Tests\Feature\Asset;

use App\Models\User;
use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AssetFileUploadTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, PromiseInterface>
     */
    private function supabaseHttpFakes(): array
    {
        return [
            'https://project.supabase.co/storage/v1/object/brand-vault/*' => Http::response(['Key' => 'ok'], 200),
            'https://project.supabase.co/storage/v1/object/sign/brand-vault/*' => Http::response([
                'signedURL' => '/object/sign/brand-vault/assets/1/file.jpeg?token=test-token',
            ], 200),
        ];
    }

    public function test_guest_cannot_upload_asset_file(): void
    {
        $this->postJson(route('assets.upload'), [
            'file' => UploadedFile::fake()->image('hero.png'),
        ])->assertUnauthorized();
    }

    public function test_user_can_upload_asset_under_assets_folder(): void
    {
        Config::set('services.supabase.url', 'https://project.supabase.co');
        Config::set('services.supabase.key', 'service-role-key');
        Config::set('services.supabase.brand_logos_bucket', 'brand-vault');

        Http::fake($this->supabaseHttpFakes());

        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson(route('assets.upload'), [
            'file' => UploadedFile::fake()->image('hero.jpg', 80, 80),
        ]);

        $response->assertOk()->assertJsonPath('success', true);

        $this->assertStringContainsString(
            '/storage/v1/object/sign/brand-vault/assets/',
            (string) $response->json('data.url'),
        );

        Http::assertSent(fn ($request) => str_contains(
            $request->url(),
            '/storage/v1/object/brand-vault/assets/'.$user->id.'/',
        ));
    }
}
