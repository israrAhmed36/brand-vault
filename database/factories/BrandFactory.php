<?php

namespace Database\Factories;

use App\Models\User;
use App\Modules\Brand\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Brand>
 */
class BrandFactory extends Factory
{
    protected $model = Brand::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->company(),
            'primary_color' => '#1A1A1A',
            'secondary_color' => '#C45C26',
            'logo_url' => null,
            'default_font' => 'Montserrat',
        ];
    }
}
