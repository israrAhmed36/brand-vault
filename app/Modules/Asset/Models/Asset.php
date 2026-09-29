<?php

namespace App\Modules\Asset\Models;

use App\Models\User;
use App\Modules\Asset\Enums\AssetType;
use App\Modules\Folder\Models\Folder;
use Database\Factories\AssetFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $folder_id
 * @property string $name
 * @property AssetType $type
 * @property string $url
 * @property array<int, string>|null $tags
 * @property string|null $ai_description
 * @property string|null $ai_usage_suggestion
 * @property Carbon|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Asset extends Model
{
    /** @use HasFactory<AssetFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'folder_id',
        'name',
        'type',
        'url',
        'tags',
        'ai_description',
        'ai_usage_suggestion',
    ];

    protected static function newFactory(): AssetFactory
    {
        return AssetFactory::new();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'type' => AssetType::class,
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Folder, $this>
     */
    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }
}
