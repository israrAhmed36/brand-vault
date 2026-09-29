<?php

namespace Tests\Feature\Brand;

use App\Models\User;
use App\Modules\Brand\Models\Brand;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BrandPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_view_brand_page(): void
    {
        $this->get(route('brand.edit'))->assertRedirect('/');
    }

    public function test_authenticated_user_sees_empty_brand_page(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('brand.edit'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('brand/edit')
                ->where('brand', null)
            );
    }

    public function test_authenticated_user_sees_own_brand(): void
    {
        $user = User::factory()->create();
        $brand = Brand::factory()->create([
            'user_id' => $user->id,
            'name' => 'Studio North',
        ]);

        $this->actingAs($user)
            ->get(route('brand.edit'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('brand/edit')
                ->where('brand.id', $brand->id)
                ->where('brand.name', 'Studio North')
            );
    }

    public function test_user_cannot_view_another_users_brand_data(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();

        Brand::factory()->create([
            'user_id' => $owner->id,
            'name' => 'Secret Brand',
        ]);

        $this->actingAs($intruder)
            ->get(route('brand.edit'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('brand', null)
            );
    }
}
