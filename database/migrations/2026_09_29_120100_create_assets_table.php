<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('folder_id')
                ->nullable()
                ->constrained('folders')
                ->nullOnDelete();
            $table->string('name');
            $table->string('type', 50);
            $table->string('url', 2048);
            $table->json('tags')->nullable();
            $table->text('ai_description')->nullable();
            $table->text('ai_usage_suggestion')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'folder_id', 'deleted_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
