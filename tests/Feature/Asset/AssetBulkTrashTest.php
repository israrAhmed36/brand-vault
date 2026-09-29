<?php

namespace Tests\Feature\Asset;

use App\Models\User;
use App\Modules\Asset\Models\Asset;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssetBulkTrashTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_bulk_restore_trashed_assets(): void
    {
        $user = User::factory()->create();
        $first = Asset::factory()->create(['user_id' => $user->id]);
        $second = Asset::factory()->create(['user_id' => $user->id]);
        $first->delete();
        $second->delete();

        $this->actingAs($user)
            ->post(route('assets.trash.bulk-restore'), [
                'asset_ids' => [$first->id, $second->id],
            ])
            ->assertRedirect();

        $this->assertNull($first->fresh()->deleted_at);
        $this->assertNull($second->fresh()->deleted_at);
    }

    public function test_user_can_bulk_force_delete_trashed_assets(): void
    {
        $user = User::factory()->create();
        $first = Asset::factory()->create(['user_id' => $user->id]);
        $second = Asset::factory()->create(['user_id' => $user->id]);
        $first->delete();
        $second->delete();

        $this->actingAs($user)
            ->delete(route('assets.trash.bulk-destroy'), [
                'asset_ids' => [$first->id, $second->id],
            ])
            ->assertRedirect();

        $this->assertDatabaseMissing('assets', ['id' => $first->id]);
        $this->assertDatabaseMissing('assets', ['id' => $second->id]);
    }

    public function test_user_cannot_bulk_restore_another_users_assets(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $asset = Asset::factory()->create(['user_id' => $owner->id]);
        $asset->delete();

        $this->actingAs($intruder)
            ->post(route('assets.trash.bulk-restore'), [
                'asset_ids' => [$asset->id],
            ])
            ->assertSessionHasErrors('asset_ids.0');
    }
}
