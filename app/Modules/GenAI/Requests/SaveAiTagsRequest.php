<?php

namespace App\Modules\GenAI\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveAiTagsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'tags' => ['required', 'array', 'min:1', 'max:10'],
            'tags.*' => ['required', 'string', 'min:1', 'max:50'],
            'description' => ['required', 'string', 'min:1', 'max:500'],
            'usage_suggestion' => ['required', 'string', 'min:1', 'max:300'],
        ];
    }

    /**
     * @return array{tags: list<string>, description: string, usage_suggestion: string}
     */
    public function suggestion(): array
    {
        /** @var list<string> $tags */
        $tags = array_values($this->validated('tags'));

        return [
            'tags' => $tags,
            'description' => trim((string) $this->validated('description')),
            'usage_suggestion' => trim((string) $this->validated('usage_suggestion')),
        ];
    }
}
