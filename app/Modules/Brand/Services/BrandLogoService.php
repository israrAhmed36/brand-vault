<?php

namespace App\Modules\Brand\Services;

use App\Models\User;
use App\Modules\Brand\Models\Brand;
use App\Shared\Supabase\SupabaseStorageClient;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use RuntimeException;

class BrandLogoService
{
    public function __construct(
        private readonly SupabaseStorageClient $supabaseStorage,
    ) {}

    /**
     * @throws RuntimeException
     */
    public function store(User $user, UploadedFile $logo): string
    {
        if (! $this->supabaseStorage->isConfigured()) {
            throw new RuntimeException(
                'Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
            );
        }

        $extension = strtolower($logo->getClientOriginalExtension() ?: 'png');
        $objectPath = sprintf(
            'logo/%d/%s.%s',
            $user->id,
            Str::uuid()->toString(),
            $extension,
        );
        $binary = file_get_contents($logo->getRealPath());

        if ($binary === false) {
            throw new RuntimeException('Unable to read the uploaded logo.');
        }

        $bucket = (string) config('services.supabase.brand_logos_bucket');

        $this->supabaseStorage->upload(
            $bucket,
            $objectPath,
            $binary,
            $logo->getMimeType() ?: 'application/octet-stream',
        );

        return $this->supabaseStorage->createSignedUrl($bucket, $objectPath);
    }

    public function toCanonicalUrl(?string $logoUrl): ?string
    {
        if ($logoUrl === null || $logoUrl === '' || ! $this->supabaseStorage->isConfigured()) {
            return $logoUrl;
        }

        $bucket = (string) config('services.supabase.brand_logos_bucket');
        $objectPath = $this->supabaseStorage->extractObjectPath($logoUrl, $bucket);

        if ($objectPath === null) {
            return $logoUrl;
        }

        return $this->supabaseStorage->publicObjectUrl($bucket, $objectPath);
    }

    public function present(?Brand $brand): ?Brand
    {
        if ($brand === null || ! $this->supabaseStorage->isConfigured()) {
            return $brand;
        }

        $logoUrl = $brand->logo_url;

        if ($logoUrl === null || $logoUrl === '') {
            return $brand;
        }

        $bucket = (string) config('services.supabase.brand_logos_bucket');
        $objectPath = $this->supabaseStorage->extractObjectPath($logoUrl, $bucket);

        if ($objectPath !== null) {
            $brand->setAttribute(
                'logo_url',
                $this->supabaseStorage->createSignedUrl($bucket, $objectPath),
            );
        }

        return $brand;
    }
}
