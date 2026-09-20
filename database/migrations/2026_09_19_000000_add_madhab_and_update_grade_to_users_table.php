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
        Schema::table('users', function (Blueprint $table) {
            // إضافة عمود المذهب
            $table->string('madhab')->nullable()->after('grade');
            
            // تعديل عمود الصف ليكون text بدلاً من enum عشان نقدر نخزن القيم الجديدة
            $table->string('grade')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('madhab');
            // رجع العمود لـ enum تاني (اختياري - ممكن متعملهوش حاجة لو مش ضروري)
            // $table->enum('grade', ['first', 'second', 'third'])->change();
        });
    }
};