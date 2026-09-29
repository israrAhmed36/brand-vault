<?php

namespace App\Modules\GenAI\Controllers;

use App\Modules\Asset\Models\Asset;
use App\Modules\GenAI\Exceptions\AiProviderException;
use App\Modules\GenAI\Exceptions\AiResponseInvalidException;
use App\Modules\GenAI\Requests\SaveAiTagsRequest;
use App\Modules\GenAI\Services\AiTaggingService;
use App\Shared\Http\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiTaggingController
{
    public function __construct(
        private readonly AiTaggingService $aiTagging,
    ) {}

    public function generate(Request $request, Asset $asset): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->can('update', $asset), 403);

        try {
            $suggestion = $this->aiTagging->generate($user, $asset);
        } catch (AiResponseInvalidException $exception) {
            return ApiResponse::error(
                'AI_VALIDATION_ERROR',
                $exception->getMessage(),
                422,
                $exception->fields(),
            );
        } catch (AiProviderException $exception) {
            return ApiResponse::error(
                'AI_PROVIDER_ERROR',
                $exception->getMessage(),
                502,
            );
        }

        return ApiResponse::success($suggestion);
    }

    public function save(SaveAiTagsRequest $request, Asset $asset): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->can('update', $asset), 403);

        try {
            $updated = $this->aiTagging->save($user, $asset, $request->suggestion());
        } catch (AiResponseInvalidException $exception) {
            return ApiResponse::error(
                'AI_VALIDATION_ERROR',
                $exception->getMessage(),
                422,
                $exception->fields(),
            );
        }

        return ApiResponse::success([
            'id' => $updated->id,
            'tags' => $updated->tags,
            'ai_description' => $updated->ai_description,
            'ai_usage_suggestion' => $updated->ai_usage_suggestion,
        ]);
    }
}
