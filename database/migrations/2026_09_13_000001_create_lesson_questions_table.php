<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lesson_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // الطالب السائل
            $table->text('question');
            $table->text('answer')->nullable(); // إجابة المدرس
            $table->foreignId('answered_by')->nullable()->constrained('users')->nullOnDelete(); // المدرس المجيب
            $table->timestamp('answered_at')->nullable();
            $table->boolean('is_private')->default(false); // هل السؤال خاص أم عام؟
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_questions');
    }
};