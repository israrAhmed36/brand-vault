<?php

namespace Tests\Feature\Folder;

use App\Models\User;
use App\Modules\Folder\Models\Folder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FolderMoveTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_nest_folder_under_parent(): void
    {
        $user = User::factory()->create();
        $parent = Folder::factory()->create(['user_id' => $user->id, 'depth' => 0]);
        $child = Folder::factory()->create(['user_id' => $user->id, 'depth' => 0]);

        $this->actingAs($user)
            ->put(route('folders.move', $child), ['parent_id' => $parent->id])
            ->assertRedirect();

        $this->assertDatabaseHas('folders', [
            'id' => $child->id,
            'parent_id' => $parent->id,
            'depth' => 1,
        ]);
    }

    public function test_user_can_promote_child_to_root(): void
    {
        $user = User::factory()->create();
        $parent = Folder::factory()->create(['user_id' => $user->id, 'depth' => 0]);
        $child = Folder::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $parent->id,
            'depth' => 1,
        ]);

        $this->actingAs($user)
            ->put(route('folders.move', $child), ['parent_id' => null])
            ->assertRedirect();

        $this->assertDatabaseHas('folders', [
            'id' => $child->id,
            'parent_id' => null,
            'depth' => 0,
        ]);
    }

    public function test_cannot_demote_last_root_folder(): void
    {
        $user = User::factory()->create();
        $root = Folder::factory()->create(['user_id' => $user->id, 'depth' => 0]);
        $child = Folder::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $root->id,
            'depth' => 1,
        ]);

        $this->actingAs($user)
            ->from(route('assets.index'))
            ->put(route('folders.move', $root), ['parent_id' => $child->id])
            ->assertRedirect(route('assets.index'));

        $this->assertDatabaseHas('folders', [
            'id' => $root->id,
            'parent_id' => null,
            'depth' => 0,
        ]);
    }

    public function test_assets_index_includes_full_folder_tree(): void
    {
        $user = User::factory()->create();
        $parent = Folder::factory()->create([
            'user_id' => $user->id,
            'name' => 'Campaigns',
        ]);
        Folder::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $parent->id,
            'depth' => 1,
            'name' => 'Social',
        ]);

        $this->actingAs($user)
            ->get(route('assets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('assets/index')
                ->has('folders', 2)
            );
    }

    public function test_cannot_move_into_parent_with_same_sibling_name(): void
    {
        $user = User::factory()->create();
        $parent = Folder::factory()->create([
            'user_id' => $user->id,
            'name' => 'Parent',
            'depth' => 0,
        ]);
        Folder::factory()->create([
            'user_id' => $user->id,
            'parent_id' => $parent->id,
            'name' => 'Shared',
            'depth' => 1,
        ]);
        $siblingRoot = Folder::factory()->create([
            'user_id' => $user->id,
            'name' => 'Shared',
            'depth' => 0,
        ]);

        $this->actingAs($user)
            ->from(route('assets.index'))
            ->put(route('folders.move', $siblingRoot), ['parent_id' => $parent->id])
            ->assertRedirect(route('assets.index'))
            ->assertSessionHasErrors('parent_id');

        $this->assertDatabaseHas('folders', [
            'id' => $siblingRoot->id,
            'parent_id' => null,
            'depth' => 0,
        ]);
    }
}
