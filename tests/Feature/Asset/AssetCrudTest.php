<?php

namespace Tests\Feature\Asset;

use App\Models\User;
use App\Modules\Asset\Models\Asset;
use App\Modules\Folder\Models\Folder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AssetCrudTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, mixed>
     */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Hero banner',
            'type' => 'image',
            'url' => 'https://cdn.example.com/hero.jpg',
            'folder_id' => null,
        ], $overrides);
    }

    public function test_assets_index_renders_for_owner(): void
    {
        $user = User::factory()->create();
        Asset::factory()->create(['user_id' => $user->id, 'name' => 'Mine']);

        $this->actingAs($user)
            ->get(route('assets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('assets/index')
                ->has('assets.data', 1)
            );
    }

    public function test_user_cannot_see_another_users_assets(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        Asset::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($intruder)
            ->get(route('assets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('assets.data', 0)
            );
    }

    public function test_user_can_create_and_soft_delete_asset(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('assets.store'), $this->validPayload())
            ->assertRedirect();

        $asset = Asset::query()->where('user_id', $user->id)->firstOrFail();

        $this->actingAs($user)
            ->delete(route('assets.destroy', $asset))
            ->assertRedirect();

        $this->assertSoftDeleted('assets', ['id' => $asset->id]);
    }

    public function test_user_can_restore_asset_to_root_when_folder_missing(): void
    {
        $user = User::factory()->create();
        $folder = Folder::factory()->create(['user_id' => $user->id]);
        $asset = Asset::factory()->create([
            'user_id' => $user->id,
            'folder_id' => $folder->id,
        ]);

        $asset->delete();
        $folder->delete();

        $this->actingAs($user)
            ->post(route('assets.restore', $asset->id))
            ->assertRedirect();

        $this->assertDatabaseHas('assets', [
            'id' => $asset->id,
            'folder_id' => null,
            'deleted_at' => null,
        ]);
    }

    public function test_user_cannot_update_another_users_asset(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $asset = Asset::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($intruder)
            ->put(route('assets.update', $asset), $this->validPayload([
                'name' => 'Stolen',
            ]))
            ->assertForbidden();
    }

    public function test_user_can_move_asset_to_folder_on_update(): void
    {
        $user = User::factory()->create();
        $folder = Folder::factory()->create(['user_id' => $user->id]);
        $asset = Asset::factory()->create([
            'user_id' => $user->id,
            'folder_id' => null,
        ]);

        $this->actingAs($user)
            ->put(route('assets.update', $asset), $this->validPayload([
                'name' => $asset->name,
                'folder_id' => $folder->id,
            ]))
            ->assertRedirect();

        $this->assertDatabaseHas('assets', [
            'id' => $asset->id,
            'folder_id' => $folder->id,
        ]);
    }

    public function test_user_can_force_delete_trashed_asset(): void
    {
        $user = User::factory()->create();
        $asset = Asset::factory()->create(['user_id' => $user->id]);
        $asset->delete();

        $this->actingAs($user)
            ->delete(route('assets.force-destroy', $asset->id))
            ->assertRedirect();

        $this->assertDatabaseMissing('assets', ['id' => $asset->id]);
    }

    public function test_assets_index_includes_folder_options(): void
    {
        $user = User::factory()->create();
        Folder::factory()->create(['user_id' => $user->id, 'name' => 'Campaigns']);

        $this->actingAs($user)
            ->get(route('assets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('folderOptions', 2)
            );
    }

    public function test_assets_index_includes_folder_asset_counts(): void
    {
        $user = User::factory()->create();
        $folder = Folder::factory()->create([
            'user_id' => $user->id,
            'name' => 'Campaigns',
        ]);
        $empty = Folder::factory()->create([
            'user_id' => $user->id,
            'name' => 'Empty',
        ]);
        Asset::factory()->count(2)->create([
            'user_id' => $user->id,
            'folder_id' => $folder->id,
        ]);
        Asset::factory()->create([
            'user_id' => $user->id,
            'folder_id' => $folder->id,
            'deleted_at' => now(),
        ]);

        $this->actingAs($user)
            ->get(route('assets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('folders', fn ($folders) => collect($folders)->contains(
                    fn ($item) => $item['id'] === $folder->id && $item['assets_count'] === 2,
                ) && collect($folders)->contains(
                    fn ($item) => $item['id'] === $empty->id && $item['assets_count'] === 0,
                ))
            );
    }
}
