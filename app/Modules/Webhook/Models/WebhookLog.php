<?php

namespace App\Modules\Webhook\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $event_type
 * @property array<string, mixed> $payload
 * @property string $status
 * @property int|null $http_status
 * @property string|null $error_message
 * @property Carbon|null $created_at
 */
class WebhookLog extends Model
{
    public const UPDATED_AT = null;

    public const STATUS_SENT = 'sent';

    public const STATUS_FAILED = 'failed';

    public const STATUS_SKIPPED = 'skipped';

    protected $fillable = [
        'user_id',
        'event_type',
        'payload',
        'status',
        'http_status',
        'error_message',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'http_status' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
