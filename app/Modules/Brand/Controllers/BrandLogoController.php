<?php

namespace App\Modules\Brand\Controllers;

use App\Modules\Brand\Requests\UploadBrandLogoRequest;
use App\Modules\Brand\Services\BrandLogoService;
use Illuminate\Http\JsonResponse;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

class BrandLogoController
{
    public function __construct(
        private readonly BrandLogoService $brandLogoService,
    ) {}

    public function store(UploadBrandLogoRequest $request): JsonResponse
    {
        try {
            $file = $request->file('logo');

            if ($file === null) {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'LOGO_MISSING',
                        'message' => 'Choose a logo image to upload.',
                    ],
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $logoUrl = $this->brandLogoService->store($request->user(), $file);
        } catch (RuntimeException $exception) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'LOGO_UPLOAD_FAILED',
                    'message' => $exception->getMessage(),
                ],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'logo_url' => $logoUrl,
            ],
        ]);
    }
}
