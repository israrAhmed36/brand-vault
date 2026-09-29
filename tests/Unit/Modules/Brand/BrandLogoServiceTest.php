<?php

namespace Tests\Unit\Modules\Brand;

use App\Models\User;
use App\Modules\Brand\Services\BrandLogoService;
use App\Shared\Supabase\SupabaseStorageClient;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Mockery;
use RuntimeException;
use Tests\TestCase;

class BrandLogoServiceTest extends TestCase
{
    public function test_store_uploads_under_logo_and_returns_signed_url(): void
    {
        Config::set('services.supabase.brand_logos_bucket', 'brand-vault');

        $user = User::factory()->make(['id' => 42]);
        $file = UploadedFile::fake()->image('mark.png');

        $client = Mockery::mock(SupabaseStorageClient::class);
        $client->shouldReceive('isConfigured')->once()->andReturn(true);
        $client->shouldReceive('upload')
            ->once()
            ->withArgs(function (string $bucket, string $path) {
                return $bucket === 'brand-vault'
                    && str_starts_with($path, 'logo/42/');
            })
            ->andReturn('https://abc.supabase.co/storage/v1/object/public/brand-vault/logo/42/mark.png');
        $client->shouldReceive('createSignedUrl')
            ->once()
            ->andReturn('https://abc.supabase.co/storage/v1/object/sign/brand-vault/logo/42/mark.png?token=abc');

        $service = new BrandLogoService($client);
        $url = $service->store($user, $file);

        $this->assertStringContainsString('/object/sign/brand-vault/logo/42/', $url);
    }

    public function test_store_requires_supabase_configuration(): void
    {
        $user = User::factory()->make(['id' => 9]);
        $file = UploadedFile::fake()->image('mark.png');

        $client = Mockery::mock(SupabaseStorageClient::class);
        $client->shouldReceive('isConfigured')->once()->andReturn(false);

        $service = new BrandLogoService($client);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Supabase Storage is not configured');
        $service->store($user, $file);
    }
}
