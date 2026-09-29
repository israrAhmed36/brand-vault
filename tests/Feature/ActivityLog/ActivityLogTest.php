<?php

namespace Tests\Feature\ActivityLog;

use App\Models\User;
use App\Modules\ActivityLog\Models\ActivityLog;
use App\Modules\Asset\Models\Asset;
use App\Modules\Folder\Models\Folder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ActivityLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_activity_logs_index_renders_for_authenticated_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('activity-logs.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('activity-logs/index')
                ->has('logs.data')
                ->has('filters')
                ->has('moduleOptions')
                ->has('actionOptions')
            );
    }

    public function test_guest_cannot_view_activity_logs(): void
    {
        $this->get(route('activity-logs.index'))->assertRedirect(route('home'));
    }

    public function test_brand_upsert_and_delete_are_logged(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->put(route('brand.update'), [
            'name' => 'Nordic Labs',
            'primary_color' => '#111827',
            'secondary_color' => '#0F766E',
            'logo_url' => null,
            'default_font' => 'Montserrat',
        ])->assertRedirect();

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'module' => 'brand',
            'action' => 'created',
            'subject_label' => 'Nordic Labs',
        ]);

        $this->actingAs($user)->put(route('brand.update'), [
            'name' => 'Nordic Updated',
            'primary_color' => '#111827',
            'secondary_color' => '#0F766E',
            'logo_url' => null,
            'default_font' => 'Montserrat',
        ])->assertRedirect();

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'module' => 'brand',
            'action' => 'updated',
            'subject_label' => 'Nordic Updated',
        ]);

        $this->actingAs($user)->delete(route('brand.destroy'))->assertRedirect();

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'module' => 'brand',
            'action' => 'deleted',
            'subject_label' => 'Nordic Updated',
        ]);
    }

    public function test_folder_and_asset_mutations_are_logged(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('folders.store'), ['name' => 'Campaigns'])
            ->assertRedirect();

        $folder = Folder::query()->where('user_id', $user->id)->firstOrFail();

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'module' => 'folder',
            'action' => 'created',
            'subject_label' => 'Campaigns',
        ]);

        $this->actingAs($user)
            ->post(route('assets.store'), [
                'name' => 'Hero banner',
                'type' => 'image',
                'url' => 'https://cdn.example.com/hero.jpg',
                'folder_id' => $folder->id,
            ])
            ->assertRedirect();

        $asset = Asset::query()->where('user_id', $user->id)->firstOrFail();
        $createdLog = ActivityLog::query()
            ->where('user_id', $user->id)
            ->where('module', 'asset')
            ->where('action', 'created')
            ->latest('id')
            ->firstOrFail();

        $this->assertSame('Campaigns', $createdLog->new_values['folder'] ?? null);
        $this->assertArrayNotHasKey('folder_id', $createdLog->new_values ?? []);
        $this->assertArrayNotHasKey('id', $createdLog->new_values ?? []);

        $this->actingAs($user)
            ->get(route('activity-logs.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('logs.data.0.new_values.folder', 'Campaigns')
            );

        $this->actingAs($user)
            ->delete(route('assets.destroy', $asset))
            ->assertRedirect();

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'module' => 'asset',
            'action' => 'trashed',
            'subject_id' => $asset->id,
        ]);

        $this->actingAs($user)
            ->post(route('assets.restore', $asset->id))
            ->assertRedirect();

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $user->id,
            'module' => 'asset',
            'action' => 'restored',
            'subject_id' => $asset->id,
        ]);
    }

    public function test_user_cannot_see_another_users_activity_logs(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();

        ActivityLog::query()->create([
            'user_id' => $owner->id,
            'module' => 'brand',
            'action' => 'created',
            'subject_label' => 'Secret brand',
            'old_values' => null,
            'new_values' => ['name' => 'Secret brand'],
        ]);

        $this->actingAs($intruder)
            ->get(route('activity-logs.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('logs.data', 0)
            );
    }

    public function test_activity_logs_can_filter_by_module(): void
    {
        $user = User::factory()->create();

        ActivityLog::query()->create([
            'user_id' => $user->id,
            'module' => 'brand',
            'action' => 'created',
            'subject_label' => 'Brand kit',
        ]);
        ActivityLog::query()->create([
            'user_id' => $user->id,
            'module' => 'asset',
            'action' => 'created',
            'subject_label' => 'Logo PNG',
        ]);

        $this->actingAs($user)
            ->get(route('activity-logs.index', ['module' => 'asset']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('logs.data', 1)
                ->where('logs.data.0.module', 'asset')
                ->where('filters.module', 'asset')
            );
    }

    public function test_activity_logs_respect_per_page(): void
    {
        $user = User::factory()->create();

        foreach (range(1, 15) as $index) {
            ActivityLog::query()->create([
                'user_id' => $user->id,
                'module' => 'asset',
                'action' => 'created',
                'subject_label' => "Asset {$index}",
            ]);
        }

        $this->actingAs($user)
            ->get(route('activity-logs.index', ['per_page' => 10, 'page' => 2]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('logs.data', 5)
                ->where('logs.current_page', 2)
                ->where('logs.per_page', 10)
                ->where('logs.total', 15)
                ->where('filters.per_page', 10)
            );
    }
}
