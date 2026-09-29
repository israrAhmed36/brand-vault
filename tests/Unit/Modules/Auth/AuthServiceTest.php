<?php

namespace Tests\Unit\Modules\Auth;

use App\Models\User;
use App\Modules\Auth\Repositories\UserRepositoryInterface;
use App\Modules\Auth\Services\AuthService;
use App\Modules\Auth\Support\DemoCredentials;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class AuthServiceTest extends TestCase
{
    use RefreshDatabase;

    private AuthService $authService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->authService = $this->app->make(AuthService::class);
    }

    public function test_attempt_login_authenticates_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'member@example.com',
            'password' => 'password',
        ]);

        $authenticated = $this->authService->attemptLogin([
            'email' => 'member@example.com',
            'password' => 'password',
        ]);

        $this->assertTrue($user->is($authenticated));
        $this->assertTrue(Auth::check());
    }

    public function test_attempt_login_throws_for_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'member@example.com',
            'password' => 'password',
        ]);

        $this->expectException(ValidationException::class);

        $this->authService->attemptLogin([
            'email' => 'member@example.com',
            'password' => 'wrong-password',
        ]);
    }

    public function test_register_creates_user_and_logs_them_in(): void
    {
        $user = $this->authService->register([
            'name' => 'Fresh User',
            'email' => 'fresh@example.com',
            'password' => 'Password1!',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'fresh@example.com',
        ]);
        $this->assertAuthenticatedAs($user);
    }

    public function test_login_as_demo_uses_demo_credentials(): void
    {
        $user = $this->authService->loginAsDemo();

        $this->assertAuthenticatedAs($user);
        $this->assertSame(DemoCredentials::EMAIL, $user->email);
        $this->assertInstanceOf(UserRepositoryInterface::class, $this->app->make(UserRepositoryInterface::class));
    }

    public function test_logout_clears_the_session(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->authService->logout();

        $this->assertGuest();
    }
}
