<?php

namespace App\Modules\Brand\Models;

use App\Models\User;
use Database\Factories\BrandFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $primary_color
 * @property string $secondary_color
 * @property string|null $logo_url
 * @property string|null $default_font
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Brand extends Model
{
    /** @use HasFactory<BrandFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'primary_color',
        'secondary_color',
        'logo_url',
        'default_font',
    ];

    protected static function newFactory(): BrandFactory
    {
        return BrandFactory::new();
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
