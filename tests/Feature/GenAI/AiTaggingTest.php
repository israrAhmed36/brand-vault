<?php

namespace Tests\Feature\GenAI;

use App\Models\User;
use App\Modules\Asset\Models\Asset;
use App\Modules\Brand\Models\Brand;
use App\Modules\Folder\Models\Folder;
use App\Modules\GenAI\Contracts\AiProviderInterface;
use App\Modules\GenAI\Providers\FakeAiProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiTaggingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->bind(AiProviderInterface::class, FakeAiProvider::class);
    }

    public function test_user_can_generate_tags_for_owned_asset(): void
    {
        $user = User::factory()->create();
        $folder = Folder::factory()->create([
            'user_id' => $user->id,
            'name' => 'Campaigns',
        ]);
        Brand::factory()->create([
            'user_id' => $user->id,
            'name' => 'Nordic Labs',
        ]);
        $asset = Asset::factory()->create([
            'user_id' => $user->id,
            'folder_id' => $folder->id,
            'name' => 'Hero Banner',
            'type' => 'image',
        ]);

        $this->actingAs($user)
            ->postJson(route('api.assets.generate-tags', $asset))
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'tags',
                    'description',
                    'usage_suggestion',
                ],
            ]);

        $this->assertDatabaseMissing('assets', [
            'id' => $asset->id,
            'ai_description' => 'Short internal description derived from available asset metadata.',
        ]);
    }

    public function test_user_can_save_validated_ai_suggestion(): void
    {
        $user = User::factory()->create();
        $asset = Asset::factory()->create(['user_id' => $user->id]);

        $payload = [
            'tags' => ['campaign', 'social', 'product'],
            'description' => 'Short asset description for internal library search.',
            'usage_suggestion' => 'Best used for Instagram posts or website banners.',
        ];

        $this->actingAs($user)
            ->putJson(route('api.assets.tags', $asset), $payload)
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.tags.0', 'campaign');

        $this->assertDatabaseHas('assets', [
            'id' => $asset->id,
            'ai_description' => $payload['description'],
            'ai_usage_suggestion' => $payload['usage_suggestion'],
        ]);
    }

    public function test_save_rejects_invalid_ai_payload(): void
    {
        $user = User::factory()->create();
        $asset = Asset::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->putJson(route('api.assets.tags', $asset), [
                'tags' => [],
                'description' => '',
                'usage_suggestion' => '',
            ])
            ->assertStatus(422);
    }

    public function test_user_cannot_generate_tags_for_another_users_asset(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $asset = Asset::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($intruder)
            ->postJson(route('api.assets.generate-tags', $asset))
            ->assertForbidden();
    }

    public function test_guest_cannot_generate_or_save_tags(): void
    {
        $asset = Asset::factory()->create();

        $this->postJson(route('api.assets.generate-tags', $asset))
            ->assertUnauthorized();

        $this->putJson(route('api.assets.tags', $asset), [
            'tags' => ['campaign'],
            'description' => 'Description',
            'usage_suggestion' => 'Usage',
        ])->assertUnauthorized();
    }
}
