<?php

namespace Tests\Feature\Asset;

use App\Models\User;
use App\Modules\Asset\Models\Asset;
use App\Modules\Folder\Models\Folder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AssetSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_assets_index_filters_by_search_name(): void
    {
        $user = User::factory()->create();
        Asset::factory()->create([
            'user_id' => $user->id,
            'name' => 'Hero banner',
            'folder_id' => null,
        ]);
        Asset::factory()->create([
            'user_id' => $user->id,
            'name' => 'Press kit',
            'folder_id' => null,
        ]);

        $this->actingAs($user)
            ->get(route('assets.index', ['search' => 'hero']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('assets/index')
                ->has('assets.data', 1)
                ->where('assets.data.0.name', 'Hero banner')
                ->where('filters.search', 'hero')
            );
    }

    public function test_search_is_case_insensitive_and_trimmed(): void
    {
        $user = User::factory()->create();
        Asset::factory()->create([
            'user_id' => $user->id,
            'name' => 'Brand Film',
            'folder_id' => null,
        ]);

        $this->actingAs($user)
            ->get(route('assets.index', ['search' => '  BRAND  ']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('assets.data', 1)
                ->where('filters.search', 'BRAND')
            );
    }

    public function test_search_is_scoped_to_current_folder(): void
    {
        $user = User::factory()->create();
        $folder = Folder::factory()->create(['user_id' => $user->id]);
        Asset::factory()->create([
            'user_id' => $user->id,
            'name' => 'Shared name',
            'folder_id' => null,
        ]);
        Asset::factory()->create([
            'user_id' => $user->id,
            'name' => 'Shared name',
            'folder_id' => $folder->id,
        ]);

        $this->actingAs($user)
            ->get(route('assets.folder', ['folder' => $folder, 'search' => 'Shared']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('assets.data', 1)
                ->where('assets.data.0.folder_id', $folder->id)
            );
    }

    public function test_api_search_returns_matching_assets(): void
    {
        $user = User::factory()->create();
        Asset::factory()->create([
            'user_id' => $user->id,
            'name' => 'Logo pack',
        ]);
        Asset::factory()->create([
            'user_id' => $user->id,
            'name' => 'Other file',
        ]);

        $this->actingAs($user)
            ->getJson(route('api.assets.search', ['search' => 'logo']))
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Logo pack');
    }

    public function test_user_cannot_search_another_users_assets(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        Asset::factory()->create([
            'user_id' => $owner->id,
            'name' => 'Secret asset',
        ]);

        $this->actingAs($intruder)
            ->get(route('assets.index', ['search' => 'Secret']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('assets.data', 0));
    }

    public function test_assets_index_filters_by_added_on_date(): void
    {
        $user = User::factory()->create();
        $matching = Asset::factory()->create([
            'user_id' => $user->id,
            'name' => 'Added today',
            'folder_id' => null,
            'created_at' => now()->startOfDay()->addHours(3),
        ]);
        Asset::factory()->create([
            'user_id' => $user->id,
            'name' => 'Added yesterday',
            'folder_id' => null,
            'created_at' => now()->subDay(),
        ]);

        $this->actingAs($user)
            ->get(route('assets.index', [
                'added_on' => now()->toDateString(),
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('assets/index')
                ->has('assets.data', 1)
                ->where('assets.data.0.id', $matching->id)
                ->where('filters.added_on', now()->toDateString())
            );
    }
}
