<?php

namespace App\Modules\GenAI\Providers;

use App\Modules\GenAI\Contracts\AiProviderInterface;
use App\Modules\GenAI\Exceptions\AiProviderException;
use Illuminate\Support\Facades\Http;
use Throwable;

class OpenAiCompatibleProvider implements AiProviderInterface
{
    public function complete(string $prompt): string
    {
        $apiKey = trim((string) config('ai.api_key'));
        $baseUrl = rtrim(trim((string) config('ai.base_url')), '/');
        $model = trim((string) config('ai.model'));
        $timeout = (int) config('ai.timeout', 30);

        if ($apiKey === '') {
            throw new AiProviderException(
                'AI API key is not configured. Set AI_API_KEY in your .env file.',
            );
        }

        if ($baseUrl === '' || $model === '') {
            throw new AiProviderException(
                'AI provider is not configured. Set AI_BASE_URL and AI_MODEL in your .env file.',
            );
        }

        try {
            $request = Http::withToken($apiKey)
                ->timeout($timeout)
                ->acceptJson()
                ->withHeaders($this->providerHeaders());

            $response = $request->post("{$baseUrl}/chat/completions", [
                'model' => $model,
                'temperature' => 0.2,
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Return only valid JSON matching the requested schema.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
            ]);
        } catch (Throwable $exception) {
            throw new AiProviderException(
                'AI provider request failed.',
                $exception,
            );
        }

        if (! $response->successful()) {
            throw new AiProviderException(
                'AI provider returned an error (HTTP '.$response->status().').',
            );
        }

        $content = data_get($response->json(), 'choices.0.message.content');

        if (! is_string($content) || trim($content) === '') {
            throw new AiProviderException('AI provider returned an empty response.');
        }

        return trim($content);
    }

    /**
     * @return array<string, string>
     */
    private function providerHeaders(): array
    {
        if (strtolower((string) config('ai.provider')) !== 'openrouter') {
            return [];
        }

        $headers = [];
        $referer = trim((string) config('ai.openrouter.http_referer'));
        $title = trim((string) config('ai.openrouter.app_title'));

        if ($referer !== '') {
            $headers['HTTP-Referer'] = $referer;
        }

        if ($title !== '') {
            $headers['X-Title'] = $title;
        }

        return $headers;
    }
}
