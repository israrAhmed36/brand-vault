<?php

namespace Tests\Unit\Modules\Folder;

use App\Models\User;
use App\Modules\Folder\Repositories\FolderRepository;
use App\Modules\Folder\Services\FolderService;
use App\Shared\Exceptions\FolderDepthExceededException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FolderServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_sets_depth_from_parent(): void
    {
        $user = User::factory()->create();
        $service = new FolderService(new FolderRepository);

        $root = $service->create($user, ['name' => 'Root']);
        $child = $service->create($user, [
            'name' => 'Child',
            'parent_id' => $root->id,
        ]);

        $this->assertSame(0, $root->depth);
        $this->assertSame(1, $child->depth);
    }

    public function test_create_rejects_depth_above_two(): void
    {
        $user = User::factory()->create();
        $service = new FolderService(new FolderRepository);

        $root = $service->create($user, ['name' => 'Root']);
        $mid = $service->create($user, [
            'name' => 'Mid',
            'parent_id' => $root->id,
        ]);
        $leaf = $service->create($user, [
            'name' => 'Leaf',
            'parent_id' => $mid->id,
        ]);

        $this->expectException(FolderDepthExceededException::class);
        $service->create($user, [
            'name' => 'Overflow',
            'parent_id' => $leaf->id,
        ]);
    }
}
