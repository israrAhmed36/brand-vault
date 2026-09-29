<?php

namespace Tests\Unit\Modules\Brand;

use App\Models\User;
use App\Modules\Brand\Models\Brand;
use App\Modules\Brand\Repositories\BrandRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BrandRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private BrandRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->repository = new BrandRepository;
    }

    public function test_find_for_user_returns_only_that_users_brand(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();

        Brand::factory()->create([
            'user_id' => $owner->id,
            'name' => 'Owner Brand',
        ]);
        Brand::factory()->create([
            'user_id' => $other->id,
            'name' => 'Other Brand',
        ]);

        $result = $this->repository->findForUser($owner->id);

        $this->assertNotNull($result);
        $this->assertSame('Owner Brand', $result->name);
        $this->assertSame($owner->id, $result->user_id);
    }

    public function test_upsert_creates_then_updates_same_row(): void
    {
        $user = User::factory()->create();

        $created = $this->repository->upsertForUser($user->id, [
            'name' => 'First',
            'primary_color' => '#111111',
            'secondary_color' => '#222222',
            'logo_url' => null,
            'default_font' => 'Inter',
        ]);

        $updated = $this->repository->upsertForUser($user->id, [
            'name' => 'Second',
            'primary_color' => '#333333',
            'secondary_color' => '#444444',
            'logo_url' => 'https://cdn.example.com/a.png',
            'default_font' => 'Montserrat',
        ]);

        $this->assertSame($created->id, $updated->id);
        $this->assertSame('Second', $updated->name);
        $this->assertDatabaseCount('brands', 1);
    }

    public function test_delete_for_user_removes_brand(): void
    {
        $user = User::factory()->create();
        Brand::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($this->repository->deleteForUser($user->id));
        $this->assertNull($this->repository->findForUser($user->id));
    }
}
