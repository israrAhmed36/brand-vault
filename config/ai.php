<?php

return [

    /*
    |--------------------------------------------------------------------------
    | GenAI provider settings (server-side only)
    |--------------------------------------------------------------------------
    |
    | All secrets come from .env. Never hardcode API keys here or in the
    | React/Vite bundle. Only AI_API_KEY is secret; the rest are settings.
    |
    */

    'provider' => env('AI_PROVIDER', 'fake'),

    'api_key' => env('AI_API_KEY'),

    'base_url' => env('AI_BASE_URL'),

    /** Chat / classification model (asset tagging). */
    'model' => env('AI_MODEL'),

    /** Embedding model (OpenAI-compatible / OpenRouter embeddings). */
    'embedding_model' => env('AI_EMBEDDING_MODEL'),

    'timeout' => (int) env('AI_TIMEOUT', 30),

    'prompt_path' => base_path('prompts/asset-tagging.md'),

    'openrouter' => [
        'http_referer' => env('AI_HTTP_REFERER', env('APP_URL')),
        'app_title' => env('AI_APP_TITLE', env('APP_NAME', 'BrandVault')),
    ],

];
