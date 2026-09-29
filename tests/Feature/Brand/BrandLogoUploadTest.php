<?php

namespace Tests\Feature\Brand;

use App\Models\User;
use GuzzleHttp\Promise\PromiseInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class BrandLogoUploadTest extends TestCase
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
                'signedURL' => '/object/sign/brand-vault/logo/1/file.jpeg?token=test-token',
            ], 200),
            'https://abc123.supabase.co/storage/v1/object/brand-vault/*' => Http::response(['Key' => 'ok'], 200),
            'https://abc123.supabase.co/storage/v1/object/sign/brand-vault/*' => Http::response([
                'signedURL' => '/object/sign/brand-vault/logo/1/file.jpeg?token=test-token',
            ], 200),
        ];
    }

    public function test_guest_cannot_upload_logo(): void
    {
        $this->postJson(route('brand.logo.store'), [
            'logo' => UploadedFile::fake()->image('logo.png'),
        ])->assertUnauthorized();
    }

    public function test_upload_fails_when_supabase_is_not_configured(): void
    {
        Config::set('services.supabase.url', null);
        Config::set('services.supabase.key', null);

        $user = User::factory()->create();

        $this->actingAs($user)->postJson(route('brand.logo.store'), [
            'logo' => UploadedFile::fake()->image('acme.png', 120, 120),
        ])
            ->assertUnprocessable()
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'LOGO_UPLOAD_FAILED');
    }

    public function test_user_can_upload_logo_under_logo_folder(): void
    {
        Config::set('services.supabase.url', 'https://project.supabase.co');
        Config::set('services.supabase.key', 'service-role-key');
        Config::set('services.supabase.brand_logos_bucket', 'brand-vault');

        Http::fake($this->supabaseHttpFakes());

        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson(route('brand.logo.store'), [
            'logo' => UploadedFile::fake()->image('logo.jpg', 80, 80),
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true);

        $logoUrl = $response->json('data.logo_url');
        $this->assertStringContainsString(
            '/storage/v1/object/sign/brand-vault/logo/',
            $logoUrl,
        );

        Http::assertSent(fn ($request) => str_contains(
            $request->url(),
            '/storage/v1/object/brand-vault/logo/'.$user->id.'/',
        ));
    }

    public function test_logo_upload_rejects_non_image(): void
    {
        Config::set('services.supabase.url', 'https://project.supabase.co');
        Config::set('services.supabase.key', 'service-role-key');

        $user = User::factory()->create();

        $this->actingAs($user)->postJson(route('brand.logo.store'), [
            'logo' => UploadedFile::fake()->create('notes.pdf', 100, 'application/pdf'),
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('logo');
    }
}
