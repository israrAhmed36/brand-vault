<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_security_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('security.edit'))
            ->assertOk();
    }

    public function test_password_can_be_updated(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);

        $response = $this
            ->actingAs($user)
            ->from(route('security.edit'))
            ->put(route('security.update'), [
                'current_password' => 'password',
                'password' => 'Password1!',
                'password_confirmation' => 'Password1!',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('security.edit'));

        $this->assertTrue(Hash::check('Password1!', $user->refresh()->password));
    }

    public function test_correct_password_must_be_provided_to_update_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);

        $response = $this
            ->actingAs($user)
            ->from(route('security.edit'))
            ->put(route('security.update'), [
                'current_password' => 'wrong-password',
                'password' => 'Password1!',
                'password_confirmation' => 'Password1!',
            ]);

        $response
            ->assertSessionHasErrors('current_password')
            ->assertRedirect(route('security.edit'));
    }

    public function test_new_password_must_meet_strength_rules(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);

        $response = $this
            ->actingAs($user)
            ->from(route('security.edit'))
            ->put(route('security.update'), [
                'current_password' => 'password',
                'password' => 'weakpass',
                'password_confirmation' => 'weakpass',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect(route('security.edit'));
    }
}
