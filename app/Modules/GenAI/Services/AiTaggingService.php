<?php

namespace App\Modules\GenAI\Services;

use App\Models\User;
use App\Modules\ActivityLog\Enums\ActivityAction;
use App\Modules\ActivityLog\Enums\ActivityModule;
use App\Modules\ActivityLog\Services\ActivityLogService;
use App\Modules\ActivityLog\Support\ActivitySnapshot;
use App\Modules\Asset\Models\Asset;
use App\Modules\Asset\Repositories\AssetRepositoryInterface;
use App\Modules\Brand\Repositories\BrandRepositoryInterface;
use App\Modules\GenAI\Contracts\AiProviderInterface;
use App\Modules\GenAI\Support\AiResponseValidator;
use App\Modules\GenAI\Support\AssetTaggingPromptBuilder;

class AiTaggingService
{
    public function __construct(
        private readonly AiProviderInterface $aiProvider,
        private readonly AiResponseValidator $validator,
        private readonly AssetTaggingPromptBuilder $promptBuilder,
        private readonly BrandRepositoryInterface $brands,
        private readonly AssetRepositoryInterface $assets,
        private readonly ActivityLogService $activityLogs,
    ) {}

    /**
     * @return array{tags: list<string>, description: string, usage_suggestion: string}
     */
    public function generate(User $user, Asset $asset): array
    {
        $asset->loadMissing('folder');
        $brand = $this->brands->findForUser($user->id);
        $prompt = $this->promptBuilder->build(
            $this->promptBuilder->context($asset, $brand),
        );
        $raw = $this->aiProvider->complete($prompt);

        return $this->validator->validate($raw);
    }

    /**
     * @param  array{tags: list<string>, description: string, usage_suggestion: string}  $suggestion
     */
    public function save(User $user, Asset $asset, array $suggestion): Asset
    {
        $validated = $this->validator->validate(json_encode($suggestion, JSON_THROW_ON_ERROR));
        $oldValues = ActivitySnapshot::asset($asset);
        $updated = $this->assets->updateAiSuggestionForUser($user->id, $asset, $validated);

        $this->activityLogs->record(
            $user,
            ActivityModule::Asset,
            ActivityAction::Updated,
            $updated,
            $oldValues,
            ActivitySnapshot::asset($updated),
            $updated->name,
        );

        return $updated;
    }
}
