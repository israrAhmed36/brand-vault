<?php

namespace Tests\Unit\Modules\Auth;

use App\Models\User;
use App\Modules\Auth\Repositories\UserRepository;
use App\Modules\Auth\Support\DemoCredentials;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private UserRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->repository = new UserRepository;
    }

    public function test_find_by_email_returns_matching_user(): void
    {
        $user = User::factory()->create([
            'email' => 'found@example.com',
        ]);

        $result = $this->repository->findByEmail('found@example.com');

        $this->assertNotNull($result);
        $this->assertTrue($user->is($result));
    }

    public function test_find_by_email_returns_null_when_missing(): void
    {
        $this->assertNull($this->repository->findByEmail('missing@example.com'));
    }

    public function test_create_persists_verified_user_with_hashed_password(): void
    {
        $user = $this->repository->create([
            'name' => 'New User',
            'email' => 'new@example.com',
            'password' => 'Password1!',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'new@example.com',
            'name' => 'New User',
        ]);
        $this->assertNotNull($user->email_verified_at);
        $this->assertTrue(Hash::check('Password1!', $user->password));
    }

    public function test_first_or_create_demo_creates_demo_user_once(): void
    {
        $first = $this->repository->firstOrCreateDemo(
            DemoCredentials::NAME,
            DemoCredentials::EMAIL,
            DemoCredentials::PASSWORD,
        );

        $second = $this->repository->firstOrCreateDemo(
            DemoCredentials::NAME,
            DemoCredentials::EMAIL,
            DemoCredentials::PASSWORD,
        );

        $this->assertTrue($first->is($second));
        $this->assertDatabaseCount('users', 1);
        $this->assertSame(DemoCredentials::EMAIL, $first->email);
    }
}
