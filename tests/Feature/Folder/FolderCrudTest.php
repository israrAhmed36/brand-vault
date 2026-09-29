<?php

namespace Tests\Feature\Folder;

use App\Models\User;
use App\Modules\Asset\Models\Asset;
use App\Modules\Folder\Models\Folder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FolderCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_root_folder(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('folders.store'), ['name' => 'Campaigns'])
            ->assertRedirect();

        $this->assertDatabaseHas('folders', [
            'user_id' => $user->id,
            'name' => 'Campaigns',
            'parent_id' => null,
            'depth' => 0,
        ]);
    }

    public function test_user_cannot_exceed_folder_depth(): void
    {
        $user = User::factory()->create();
        $root = Folder::factory()->create(['user_id' => $user->id, 'depth' => 0]);
        $child = Folder::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $root->id,
            'depth' => 1,
        ]);
        $grand = Folder::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $child->id,
            'depth' => 2,
        ]);

        $this->actingAs($user)
            ->from(route('assets.index'))
            ->post(route('folders.store'), [
                'name' => 'Too deep',
                'parent_id' => $grand->id,
            ])
            ->assertRedirect(route('assets.index'))
            ->assertSessionHasErrors('parent_id');
    }

    public function test_user_cannot_delete_non_empty_folder(): void
    {
        $user = User::factory()->create();
        $folder = Folder::factory()->create(['user_id' => $user->id]);
        Asset::factory()->create([
            'user_id' => $user->id,
            'folder_id' => $folder->id,
        ]);

        $this->actingAs($user)
            ->delete(route('folders.destroy', $folder))
            ->assertRedirect();

        $this->assertDatabaseHas('folders', ['id' => $folder->id]);
    }

    public function test_user_cannot_nest_under_another_users_folder(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $folder = Folder::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($intruder)
            ->post(route('folders.store'), [
                'name' => 'Hijack',
                'parent_id' => $folder->id,
            ])
            ->assertSessionHasErrors('parent_id');
    }
}
