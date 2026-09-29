<?php

namespace App\Shared\Http;

use Illuminate\Http\JsonResponse;

final class ApiResponse
{
    /**
     * @param  array<string, mixed>|null  $meta
     */
    public static function success(mixed $data = null, ?array $meta = null, int $status = 200): JsonResponse
    {
        $payload = [
            'success' => true,
            'data' => $data,
        ];

        if ($meta !== null) {
            $payload['meta'] = $meta;
        }

        return response()->json($payload, $status);
    }

    /**
     * @param  array<string, mixed>|null  $fields
     */
    public static function error(
        string $code,
        string $message,
        int $status = 400,
        ?array $fields = null,
    ): JsonResponse {
        $error = [
            'code' => $code,
            'message' => $message,
        ];

        if ($fields !== null) {
            $error['fields'] = $fields;
        }

        return response()->json([
            'success' => false,
            'error' => $error,
        ], $status);
    }
}
