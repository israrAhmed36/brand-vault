<?php

namespace App\Shared\Supabase;

class SupabaseUrl
{
    public function apiBaseUrl(?string $rawUrl = null): string
    {
        $rawUrl = trim((string) ($rawUrl ?? config('services.supabase.url')));

        if ($rawUrl === '') {
            return '';
        }

        if (preg_match('#https?://([a-z0-9-]+)\.storage\.supabase\.co#i', $rawUrl, $matches) === 1) {
            return 'https://'.$matches[1].'.supabase.co';
        }

        $normalized = preg_replace('#/storage/v1(?:/s3)?/?$#i', '', $rawUrl) ?? $rawUrl;

        return rtrim($normalized, '/');
    }

    public function publicObjectUrl(string $bucket, string $objectPath, ?string $baseUrl = null): string
    {
        $baseUrl ??= $this->apiBaseUrl();

        return $baseUrl.'/storage/v1/object/public/'.$bucket.'/'.$objectPath;
    }

    public function extractObjectPath(string $storedUrl, string $bucket, ?string $baseUrl = null): ?string
    {
        $baseUrl ??= $this->apiBaseUrl();
        $quotedBase = preg_quote($baseUrl, '#');
        $quotedBucket = preg_quote($bucket, '#');

        if (preg_match("#^{$quotedBase}/storage/v1/object/public/{$quotedBucket}/(.+)$#", $storedUrl, $matches) === 1) {
            return rawurldecode($matches[1]);
        }

        if (preg_match("#^{$quotedBase}/storage/v1/object/sign/{$quotedBucket}/(.+?)(?:\\?|$)#", $storedUrl, $matches) === 1) {
            return rawurldecode($matches[1]);
        }

        return null;
    }
}
