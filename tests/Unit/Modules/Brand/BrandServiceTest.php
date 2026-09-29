<?php

namespace Tests\Unit\Modules\Brand;

use App\Models\User;
use App\Modules\ActivityLog\Services\ActivityLogService;
use App\Modules\Brand\Models\Brand;
use App\Modules\Brand\Repositories\BrandRepositoryInterface;
use App\Modules\Brand\Services\BrandService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class BrandServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_upsert_delegates_to_repository(): void
    {
        $user = User::factory()->make(['id' => 7]);
        $brand = Brand::factory()->make([
            'id' => 11,
            'user_id' => 7,
            'name' => 'Delegated',
            'primary_color' => '#111111',
            'secondary_color' => '#222222',
        ]);

        $repository = Mockery::mock(BrandRepositoryInterface::class);
        $repository->shouldReceive('findForUser')->once()->with(7)->andReturn(null);
        $repository->shouldReceive('upsertForUser')
            ->once()
            ->with(7, Mockery::type('array'))
            ->andReturn($brand);

        $activityLogs = Mockery::mock(ActivityLogService::class);
        $activityLogs->shouldReceive('record')->once();

        $service = new BrandService($repository, $activityLogs);
        $result = $service->upsert($user, [
            'name' => 'Delegated',
            'primary_color' => '#111111',
            'secondary_color' => '#222222',
        ]);

        $this->assertSame('Delegated', $result->name);
    }

    public function test_delete_throws_when_brand_missing(): void
    {
        $user = User::factory()->make(['id' => 3]);

        $repository = Mockery::mock(BrandRepositoryInterface::class);
        $repository->shouldReceive('findForUser')->once()->with(3)->andReturn(null);

        $activityLogs = Mockery::mock(ActivityLogService::class);
        $activityLogs->shouldNotReceive('record');

        $service = new BrandService($repository, $activityLogs);

        $this->expectException(AuthorizationException::class);
        $service->delete($user);
    }
}
