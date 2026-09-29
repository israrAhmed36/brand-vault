<?php

namespace App\Shared\Supabase;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class SupabaseStorageClient
{
    public function __construct(
        private readonly SupabaseUrl $urls = new SupabaseUrl,
    ) {}

    /**
     * @throws RuntimeException
     */
    public function upload(
        string $bucket,
        string $objectPath,
        string $binary,
        string $contentType,
    ): string {
        try {
            Http::withHeaders($this->authHeaders() + [
                'Content-Type' => $contentType,
                'x-upsert' => 'true',
            ])
                ->withBody($binary, $contentType)
                ->post("{$this->requireBaseUrl()}/storage/v1/object/{$bucket}/{$objectPath}")
                ->throw();
        } catch (RequestException $exception) {
            throw new RuntimeException(
                'Unable to upload file to Supabase Storage.',
                previous: $exception,
            );
        }

        return $this->urls->publicObjectUrl($bucket, $objectPath, $this->apiBaseUrl());
    }

    /**
     * @throws RuntimeException
     */
    public function createSignedUrl(
        string $bucket,
        string $objectPath,
        int $expiresInSeconds = 31_536_000,
    ): string {
        try {
            $response = Http::withHeaders($this->authHeaders())
                ->post("{$this->requireBaseUrl()}/storage/v1/object/sign/{$bucket}/{$objectPath}", [
                    'expiresIn' => $expiresInSeconds,
                ])
                ->throw();
        } catch (RequestException $exception) {
            throw new RuntimeException(
                'Unable to create a signed logo URL.',
                previous: $exception,
            );
        }

        $signedPath = (string) $response->json('signedURL');

        if ($signedPath === '') {
            throw new RuntimeException('Unable to create a signed logo URL.');
        }

        return $this->apiBaseUrl().'/storage/v1'.$signedPath;
    }

    public function publicObjectUrl(string $bucket, string $objectPath): string
    {
        return $this->urls->publicObjectUrl($bucket, $objectPath, $this->apiBaseUrl());
    }

    public function extractObjectPath(string $storedUrl, string $bucket): ?string
    {
        return $this->urls->extractObjectPath($storedUrl, $bucket, $this->apiBaseUrl());
    }

    public function isConfigured(): bool
    {
        return $this->apiBaseUrl() !== ''
            && filled(config('services.supabase.key'));
    }

    public function apiBaseUrl(): string
    {
        return $this->urls->apiBaseUrl();
    }

    /**
     * @return array<string, string>
     */
    private function authHeaders(): array
    {
        $apiKey = (string) config('services.supabase.key');

        if ($apiKey === '') {
            throw new RuntimeException(
                'Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
            );
        }

        return [
            'Authorization' => 'Bearer '.$apiKey,
            'apikey' => $apiKey,
        ];
    }

    private function requireBaseUrl(): string
    {
        $baseUrl = $this->apiBaseUrl();

        if ($baseUrl === '') {
            throw new RuntimeException(
                'Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
            );
        }

        return $baseUrl;
    }
}
