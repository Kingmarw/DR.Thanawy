<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            // nullable عمدًا: أي درس قديم من غير سكشن (unsectioned) يفضل شغال زي ما هو
            // ويتعرض في الواجهة تحت مجموعة "بدون قسم" بدل ما يتكسر أي حاجة.
            $table->foreignId('section_id')
                ->nullable()
                ->after('course_id')
                ->constrained('sections')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropConstrainedForeignId('section_id');
        });
    }
};