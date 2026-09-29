<?php

namespace App\Modules\Asset\Services;

use App\Models\User;
use App\Modules\Asset\Support\AssetTypeFromFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CreateAssetsFromFiles
{
    public function __construct(
        private readonly AssetService $assets,
        private readonly AssetFileService $files,
        private readonly AssetTypeFromFile $types,
    ) {}

    /**
     * @param  array{name: string|null, type: string|null, folder_id: int|null, files: list<UploadedFile>}  $payload
     */
    public function handle(User $user, array $payload): int
    {
        $uploads = $payload['files'];
        $count = count($uploads);

        DB::transaction(function () use ($user, $payload, $uploads, $count): void {
            foreach ($uploads as $file) {
                $this->assets->create($user, [
                    'name' => $this->nameFor($file, $payload['name'], $count),
                    'type' => $this->typeFor($file, $payload['type'], $count),
                    'url' => $this->files->store($user, $file),
                    'folder_id' => $payload['folder_id'],
                ]);
            }
        });

        return $count;
    }

    private function nameFor(UploadedFile $file, ?string $preferred, int $count): string
    {
        if ($count === 1 && is_string($preferred) && trim($preferred) !== '') {
            return mb_substr(trim($preferred), 0, 255);
        }

        $base = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $base = trim(is_string($base) ? $base : '');

        return $base === '' ? 'Untitled asset' : mb_substr($base, 0, 255);
    }

    private function typeFor(UploadedFile $file, ?string $preferred, int $count): string
    {
        if ($count === 1 && is_string($preferred) && $preferred !== '') {
            return $preferred;
        }

        return $this->types->resolve($file);
    }
}
