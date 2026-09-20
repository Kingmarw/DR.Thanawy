<?php

// database/migrations/xxxx_create_exam_attempt_answers_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exam_attempt_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_attempt_id')->constrained()->cascadeOnDelete();
            $table->foreignId('question_id')->constrained()->cascadeOnDelete();
            $table->foreignId('selected_option_id')->nullable()->constrained('question_options')->nullOnDelete();
            $table->boolean('is_correct')->default(false);
            $table->timestamps();

            $table->unique(['exam_attempt_id', 'question_id']); // مفيش نفس السؤال يتكرر في نفس المحاولة
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_attempt_answers');
    }
};
