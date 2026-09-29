<?php

namespace Tests\Feature\Asset;

use App\Models\User;
use App\Modules\Asset\Models\Asset;
use App\Modules\Folder\Models\Folder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssetMoveTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_move_asset_via_api(): void
    {
        $user = User::factory()->create();
        $folder = Folder::factory()->create(['user_id' => $user->id]);
        $asset = Asset::factory()->create([
            'user_id' => $user->id,
            'folder_id' => null,
        ]);

        $this->actingAs($user)
            ->putJson(route('api.assets.move', $asset), [
                'folder_id' => $folder->id,
            ])
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.folder_id', $folder->id);

        $this->assertDatabaseHas('assets', [
            'id' => $asset->id,
            'folder_id' => $folder->id,
        ]);
    }

    public function test_user_can_move_asset_to_library_root(): void
    {
        $user = User::factory()->create();
        $folder = Folder::factory()->create(['user_id' => $user->id]);
        $asset = Asset::factory()->create([
            'user_id' => $user->id,
            'folder_id' => $folder->id,
        ]);

        $this->actingAs($user)
            ->putJson(route('api.assets.move', $asset), [
                'folder_id' => null,
            ])
            ->assertOk()
            ->assertJsonPath('data.folder_id', null);

        $this->assertDatabaseHas('assets', [
            'id' => $asset->id,
            'folder_id' => null,
        ]);
    }

    public function test_user_cannot_move_another_users_asset(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $folder = Folder::factory()->create(['user_id' => $intruder->id]);
        $asset = Asset::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($intruder)
            ->putJson(route('api.assets.move', $asset), [
                'folder_id' => $folder->id,
            ])
            ->assertForbidden();
    }

    public function test_user_cannot_move_asset_into_another_users_folder(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $foreignFolder = Folder::factory()->create(['user_id' => $other->id]);
        $asset = Asset::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->putJson(route('api.assets.move', $asset), [
                'folder_id' => $foreignFolder->id,
            ])
            ->assertStatus(422);
    }
}
