<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            // إضافة عمود pdf_file إذا لم يكن موجوداً بالفعل
            if (!Schema::hasColumn('lessons', 'pdf_file')) {
                $table->string('pdf_file')->nullable()->after('video_url');
            }
            
            // إضافة عمود quiz لحفظ الأسئلة كـ JSON
            if (!Schema::hasColumn('lessons', 'quiz')) {
                $table->json('quiz')->nullable()->after('is_active');
            }
        });
    }

    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn(['pdf_file', 'quiz']);
        });
    }
};