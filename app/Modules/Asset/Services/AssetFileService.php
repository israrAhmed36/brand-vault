<?php

namespace App\Modules\Asset\Services;

use App\Models\User;
use App\Shared\Supabase\SupabaseStorageClient;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use RuntimeException;

class AssetFileService
{
    public function __construct(
        private readonly SupabaseStorageClient $supabaseStorage,
    ) {}

    /**
     * @throws RuntimeException
     */
    public function store(User $user, UploadedFile $file): string
    {
        if (! $this->supabaseStorage->isConfigured()) {
            throw new RuntimeException(
                'Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
            );
        }

        $extension = strtolower($file->getClientOriginalExtension() ?: 'bin');
        $objectPath = sprintf(
            'assets/%d/%s.%s',
            $user->id,
            Str::uuid()->toString(),
            $extension,
        );
        $binary = file_get_contents($file->getRealPath());

        if ($binary === false) {
            throw new RuntimeException('Unable to read the uploaded file.');
        }

        $bucket = (string) config('services.supabase.brand_logos_bucket');

        $this->supabaseStorage->upload(
            $bucket,
            $objectPath,
            $binary,
            $file->getMimeType() ?: 'application/octet-stream',
        );

        return $this->supabaseStorage->createSignedUrl($bucket, $objectPath);
    }

    public function toCanonicalUrl(?string $url): ?string
    {
        if ($url === null || $url === '' || ! $this->supabaseStorage->isConfigured()) {
            return $url;
        }

        $bucket = (string) config('services.supabase.brand_logos_bucket');
        $objectPath = $this->supabaseStorage->extractObjectPath($url, $bucket);

        if ($objectPath === null) {
            return $url;
        }

        return $this->supabaseStorage->publicObjectUrl($bucket, $objectPath);
    }

    public function presentUrl(?string $url): ?string
    {
        if ($url === null || $url === '' || ! $this->supabaseStorage->isConfigured()) {
            return $url;
        }

        $bucket = (string) config('services.supabase.brand_logos_bucket');
        $objectPath = $this->supabaseStorage->extractObjectPath($url, $bucket);

        if ($objectPath === null) {
            return $url;
        }

        return $this->supabaseStorage->createSignedUrl($bucket, $objectPath);
    }
}
