<?php

namespace App\Modules\GenAI\Support;

use App\Modules\GenAI\Exceptions\AiResponseInvalidException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use JsonException;

final class AiResponseValidator
{
    private const ALLOWED_KEYS = ['tags', 'description', 'usage_suggestion'];

    /**
     * @return array{tags: list<string>, description: string, usage_suggestion: string}
     *
     * @throws AiResponseInvalidException
     */
    public function validate(string $rawResponse): array
    {
        $decoded = $this->decode($rawResponse);
        $this->assertAllowedKeys($decoded);

        try {
            $validated = Validator::make($decoded, [
                'tags' => ['required', 'array', 'min:1', 'max:10'],
                'tags.*' => ['required', 'string', 'min:1', 'max:50'],
                'description' => ['required', 'string', 'min:1', 'max:500'],
                'usage_suggestion' => ['required', 'string', 'min:1', 'max:300'],
            ])->validate();
        } catch (ValidationException $exception) {
            throw new AiResponseInvalidException(
                'AI response failed validation, please retry.',
                $exception->errors(),
            );
        }

        /** @var list<string> $tags */
        $tags = array_values(array_map(
            static fn (string $tag): string => trim($tag),
            $validated['tags'],
        ));

        $tags = array_values(array_filter(
            $tags,
            static fn (string $tag): bool => $tag !== '',
        ));

        if ($tags === []) {
            throw new AiResponseInvalidException(
                'AI response failed validation, please retry.',
                ['tags' => ['Tags must contain at least one non-empty string.']],
            );
        }

        return [
            'tags' => $tags,
            'description' => trim($validated['description']),
            'usage_suggestion' => trim($validated['usage_suggestion']),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function decode(string $rawResponse): array
    {
        $cleaned = trim($rawResponse);
        $cleaned = preg_replace('/^```(?:json)?\s*/i', '', $cleaned) ?? $cleaned;
        $cleaned = preg_replace('/\s*```$/', '', $cleaned) ?? $cleaned;

        try {
            $decoded = json_decode($cleaned, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            throw new AiResponseInvalidException(
                'AI response failed validation, please retry.',
                ['response' => ['Response must be valid JSON.']],
            );
        }

        if (! is_array($decoded)) {
            throw new AiResponseInvalidException(
                'AI response failed validation, please retry.',
                ['response' => ['Response must be a JSON object.']],
            );
        }

        return $decoded;
    }

    /**
     * @param  array<string, mixed>  $decoded
     */
    private function assertAllowedKeys(array $decoded): void
    {
        $extraKeys = array_diff(array_keys($decoded), self::ALLOWED_KEYS);

        if ($extraKeys !== []) {
            throw new AiResponseInvalidException(
                'AI response failed validation, please retry.',
                ['response' => ['Unexpected keys: '.implode(', ', $extraKeys)]],
            );
        }
    }
}
