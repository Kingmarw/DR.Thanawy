<?php

// database/migrations/xxxx_create_exam_attempts_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('total_questions')->default(0);
            $table->unsignedInteger('correct_answers')->default(0);
            $table->decimal('score_percent', 5, 2)->nullable(); // بتتحسب بعد التسليم
            $table->enum('status', ['in_progress', 'completed'])->default('in_progress');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_attempts');
    }
};
