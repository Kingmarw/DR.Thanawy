<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // فهرس لسرعة البحث عن محاولات الطالب في امتحان (الجارية والمكتملة)
        Schema::table('exam_attempts', function (Blueprint $table) {
            $table->index(['user_id', 'exam_id', 'status'], 'attempts_user_exam_status_idx');
        });

        // احتياطي: امسح أي إجابات مكررة لنفس السؤال في نفس المحاولة (نسيب أول واحدة)
        DB::statement(
            'DELETE a FROM exam_attempt_answers a
             JOIN exam_attempt_answers b
               ON a.exam_attempt_id = b.exam_attempt_id
              AND a.question_id = b.question_id
              AND a.id > b.id'
        );

        // ممنوع إجابتين لنفس السؤال في نفس المحاولة (السيرفر بيقفل الإجابة أول ما تتسجل)
        Schema::table('exam_attempt_answers', function (Blueprint $table) {
            $table->unique(['exam_attempt_id', 'question_id'], 'attempt_question_unique');
        });
    }

    public function down(): void
    {
        Schema::table('exam_attempt_answers', function (Blueprint $table) {
            $table->dropUnique('attempt_question_unique');
        });

        Schema::table('exam_attempts', function (Blueprint $table) {
            $table->dropIndex('attempts_user_exam_status_idx');
        });
    }
};