<?php

namespace Tests\Unit\Shared\Supabase;

use App\Shared\Supabase\SupabaseUrl;
use Tests\TestCase;

class SupabaseUrlTest extends TestCase
{
    public function test_api_base_url_normalizes_s3_endpoint(): void
    {
        $urls = new SupabaseUrl;

        $this->assertSame(
            'https://hdpknichvajsvqnghukp.supabase.co',
            $urls->apiBaseUrl('https://hdpknichvajsvqnghukp.storage.supabase.co/storage/v1/s3'),
        );
    }

    public function test_api_base_url_keeps_project_url(): void
    {
        $urls = new SupabaseUrl;

        $this->assertSame(
            'https://hdpknichvajsvqnghukp.supabase.co',
            $urls->apiBaseUrl('https://hdpknichvajsvqnghukp.supabase.co/'),
        );
    }
}
