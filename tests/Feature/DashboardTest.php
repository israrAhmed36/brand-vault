<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Asset\Enums\AssetType;
use App\Modules\Asset\Models\Asset;
use App\Modules\Brand\Models\Brand;
use App\Modules\Folder\Models\Folder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_home_page(): void
    {
        $this->get(route('dashboard'))->assertRedirect(route('home'));
    }

    public function test_authenticated_users_can_visit_the_dashboard(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.assets', 0)
                ->where('stats.folders', 0)
                ->where('stats.trash', 0)
                ->where('stats.untagged', 0)
                ->where('brand', null)
                ->has('assetTypes', 5)
                ->has('recentAssets', 0)
                ->has('recentActivity', 0)
            );
    }

    public function test_dashboard_summarizes_owned_workspace_data(): void
    {
        $user = User::factory()->create(['name' => 'Alex Nordic']);
        $other = User::factory()->create();

        Brand::factory()->create([
            'user_id' => $user->id,
            'name' => 'Nordic Studio',
        ]);
        Folder::factory()->create(['user_id' => $user->id]);
        Asset::factory()->create([
            'user_id' => $user->id,
            'type' => AssetType::Document,
            'name' => 'Brand guidelines',
            'tags' => ['campaign'],
        ]);
        Asset::factory()->create([
            'user_id' => $user->id,
            'type' => AssetType::Image,
            'name' => 'Hero banner',
            'tags' => null,
        ]);
        $trashed = Asset::factory()->create(['user_id' => $user->id]);
        $trashed->delete();

        Asset::factory()->create(['user_id' => $other->id]);
        Folder::factory()->create(['user_id' => $other->id]);
        Brand::factory()->create(['user_id' => $other->id]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('stats.assets', 2)
                ->where('stats.folders', 1)
                ->where('stats.trash', 1)
                ->where('stats.untagged', 1)
                ->where('brand.name', 'Nordic Studio')
                ->where('recentAssets.0.name', 'Hero banner')
                ->has('recentAssets', 2)
                ->has('assetTypes', 5)
            );
    }

    public function test_dashboard_does_not_leak_other_users_data(): void
    {
        $owner = User::factory()->create();
        $viewer = User::factory()->create();

        Brand::factory()->create([
            'user_id' => $owner->id,
            'name' => 'Secret Brand',
        ]);
        Asset::factory()->create([
            'user_id' => $owner->id,
            'name' => 'Private asset',
        ]);

        $this->actingAs($viewer)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('brand', null)
                ->where('stats.assets', 0)
                ->has('recentAssets', 0)
            );
    }
}
