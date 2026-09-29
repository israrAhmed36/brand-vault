<?php

namespace Tests\Unit\Modules\Brand;

use App\Models\User;
use App\Modules\Brand\Models\Brand;
use App\Modules\Brand\Policies\BrandPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandPolicyTest extends TestCase
{
    use RefreshDatabase;

    private BrandPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();

        $this->policy = new BrandPolicy;
    }

    public function test_owner_can_view_update_and_delete_brand(): void
    {
        $owner = User::factory()->create();
        $brand = Brand::factory()->create(['user_id' => $owner->id]);

        $this->assertTrue($this->policy->view($owner, $brand));
        $this->assertTrue($this->policy->update($owner, $brand));
        $this->assertTrue($this->policy->delete($owner, $brand));
    }

    public function test_other_user_cannot_view_update_or_delete_brand(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $brand = Brand::factory()->create(['user_id' => $owner->id]);

        $this->assertFalse($this->policy->view($other, $brand));
        $this->assertFalse($this->policy->update($other, $brand));
        $this->assertFalse($this->policy->delete($other, $brand));
    }

    public function test_authenticated_user_can_create_brand(): void
    {
        $user = User::factory()->create();

        $this->assertTrue($this->policy->create($user));
    }
}
