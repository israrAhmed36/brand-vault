<?php

namespace Tests\Unit\Modules\GenAI;

use App\Modules\GenAI\Exceptions\AiResponseInvalidException;
use App\Modules\GenAI\Support\AiResponseValidator;
use Tests\TestCase;

class AiResponseValidatorTest extends TestCase
{
    public function test_accepts_valid_suggestion_json(): void
    {
        $validator = new AiResponseValidator;
        $result = $validator->validate(json_encode([
            'tags' => ['campaign', 'social'],
            'description' => 'A short description.',
            'usage_suggestion' => 'Use on social channels.',
        ], JSON_THROW_ON_ERROR));

        $this->assertSame(['campaign', 'social'], $result['tags']);
        $this->assertSame('A short description.', $result['description']);
    }

    public function test_rejects_extra_top_level_keys(): void
    {
        $validator = new AiResponseValidator;

        $this->expectException(AiResponseInvalidException::class);
        $validator->validate(json_encode([
            'tags' => ['campaign'],
            'description' => 'A short description.',
            'usage_suggestion' => 'Use on social channels.',
            'hallucinated' => true,
        ], JSON_THROW_ON_ERROR));
    }

    public function test_rejects_invalid_json(): void
    {
        $validator = new AiResponseValidator;

        $this->expectException(AiResponseInvalidException::class);
        $validator->validate('not-json');
    }
}
