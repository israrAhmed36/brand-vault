<?php

namespace Database\Factories;

use App\Models\User;
use App\Modules\Asset\Enums\AssetType;
use App\Modules\Asset\Models\Asset;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Asset>
 */
class AssetFactory extends Factory
{
    protected $model = Asset::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'folder_id' => null,
            'name' => fake()->words(3, true),
            'type' => AssetType::Image,
            'url' => fake()->url(),
            'tags' => null,
            'ai_description' => null,
            'ai_usage_suggestion' => null,
        ];
    }
}
