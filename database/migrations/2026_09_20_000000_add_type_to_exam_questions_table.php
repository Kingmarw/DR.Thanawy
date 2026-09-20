<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // ⚠️ غيّر اسم الجدول لو جدول أسئلة الامتحانات عندك اسمه مختلف (مثلًا questions)
    private string $table = 'questions';

    public function up(): void
    {
        Schema::table($this->table, function (Blueprint $table) {
            // multiple_choice (الافتراضي) | true_false
            $table->string('type')->default('multiple_choice')->after('question_text');
        });
    }

    public function down(): void
    {
        Schema::table($this->table, function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};