<?php

namespace Tests\Feature\Brand;

use App\Models\User;
use App\Modules\Brand\Models\Brand;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandUpsertTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, string>
     */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Nordic Labs',
            'primary_color' => '#111827',
            'secondary_color' => '#0F766E',
            'logo_url' => 'https://cdn.example.com/logo.svg',
            'default_font' => 'Montserrat',
        ], $overrides);
    }

    public function test_user_can_create_brand_kit(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->put(
            route('brand.update'),
            $this->validPayload(),
        );

        $response->assertRedirect(route('brand.edit'));
        $this->assertDatabaseHas('brands', [
            'user_id' => $user->id,
            'name' => 'Nordic Labs',
            'primary_color' => '#111827',
            'secondary_color' => '#0F766E',
        ]);
    }

    public function test_user_can_update_existing_brand_kit(): void
    {
        $user = User::factory()->create();
        Brand::factory()->create([
            'user_id' => $user->id,
            'name' => 'Old Name',
        ]);

        $this->actingAs($user)->put(
            route('brand.update'),
            $this->validPayload(['name' => 'New Name']),
        )->assertRedirect(route('brand.edit'));

        $this->assertDatabaseCount('brands', 1);
        $this->assertDatabaseHas('brands', [
            'user_id' => $user->id,
            'name' => 'New Name',
        ]);
    }

    public function test_secondary_color_must_differ_from_primary(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->from(route('brand.edit'))
            ->put(route('brand.update'), $this->validPayload([
                'primary_color' => '#ABCDEF',
                'secondary_color' => '#ABCDEF',
            ]));

        $response->assertRedirect(route('brand.edit'));
        $response->assertSessionHasErrors('secondary_color');
        $this->assertDatabaseCount('brands', 0);
    }

    public function test_primary_color_must_be_hex(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->from(route('brand.edit'))
            ->put(route('brand.update'), $this->validPayload([
                'primary_color' => 'blue',
            ]))
            ->assertSessionHasErrors('primary_color');
    }

    public function test_user_can_delete_own_brand_kit(): void
    {
        $user = User::factory()->create();
        Brand::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->delete(route('brand.destroy'))
            ->assertRedirect(route('brand.edit'));

        $this->assertDatabaseCount('brands', 0);
    }

    public function test_delete_returns_not_found_without_brand(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->delete(route('brand.destroy'))
            ->assertNotFound();
    }

    public function test_user_can_create_brand_without_optional_fields(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->put(route('brand.update'), [
            'name' => 'Minimal Co',
            'primary_color' => '#111827',
            'secondary_color' => '#0F766E',
        ])->assertRedirect(route('brand.edit'));

        $this->assertDatabaseHas('brands', [
            'user_id' => $user->id,
            'name' => 'Minimal Co',
            'logo_url' => null,
            'default_font' => null,
        ]);
    }

    public function test_guest_cannot_upsert_or_delete_brand(): void
    {
        $this->put(route('brand.update'), $this->validPayload())
            ->assertRedirect('/');

        $this->delete(route('brand.destroy'))
            ->assertRedirect('/');
    }
}
