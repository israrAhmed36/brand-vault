<?php

namespace Tests\Feature\Asset;

use App\Models\User;
use App\Modules\Asset\Models\Asset;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AssetLibraryCountsTest extends TestCase
{
    use RefreshDatabase;

    public function test_tab_counts_include_only_the_current_users_assets(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        Asset::factory()->count(2)->create(['user_id' => $user->id]);
        Asset::factory()->create([
            'user_id' => $user->id,
            'deleted_at' => now(),
        ]);
        Asset::factory()->count(4)->create(['user_id' => $other->id]);

        $this->actingAs($user)
            ->get(route('assets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('counts.assets', 2)
                ->where('counts.trash', 1)
            );

        $this->actingAs($user)
            ->get(route('assets.trash'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('counts.assets', 2)
                ->where('counts.trash', 1)
            );
    }
}
