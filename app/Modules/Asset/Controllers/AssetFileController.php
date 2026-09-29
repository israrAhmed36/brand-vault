<?php

namespace App\Modules\Asset\Controllers;

use App\Modules\Asset\Requests\UploadAssetFileRequest;
use App\Modules\Asset\Services\AssetFileService;
use Illuminate\Http\JsonResponse;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

class AssetFileController
{
    public function __construct(
        private readonly AssetFileService $assetFileService,
    ) {}

    public function store(UploadAssetFileRequest $request): JsonResponse
    {
        try {
            $file = $request->file('file');

            if ($file === null) {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'FILE_MISSING',
                        'message' => 'Choose a file to upload.',
                    ],
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $url = $this->assetFileService->store($request->user(), $file);
        } catch (RuntimeException $exception) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'FILE_UPLOAD_FAILED',
                    'message' => $exception->getMessage(),
                ],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'url' => $url,
            ],
        ]);
    }
}
