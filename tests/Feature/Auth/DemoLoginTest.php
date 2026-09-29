<?php

namespace Tests\Feature\Auth;

use App\Modules\Auth\Support\DemoCredentials;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_login_authenticates_demo_user(): void
    {
        $response = $this->post(route('login.demo'));

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertSame(DemoCredentials::EMAIL, auth()->user()->email);
        $this->assertSame(DemoCredentials::NAME, auth()->user()->name);
    }

    public function test_demo_login_reuses_existing_demo_user(): void
    {
        $this->post(route('login.demo'));
        $this->post(route('logout'));

        $this->post(route('login.demo'));

        $this->assertAuthenticated();
        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseHas('users', [
            'email' => DemoCredentials::EMAIL,
        ]);
    }
}
