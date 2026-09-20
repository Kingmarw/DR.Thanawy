<?php

// database/migrations/xxxx_create_exams_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['exam', 'practice'])->default('practice');
            $table->unsignedInteger('duration_minutes')->nullable(); // null = بلا وقت محدد
            $table->unsignedTinyInteger('passing_score')->nullable(); // نسبة النجاح %، للاختبار الرسمي فقط
            $table->unsignedInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
