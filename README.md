<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).


```
doctor_thanawy
├─ .claude
│  └─ skills
│     ├─ inertia-react-development
│     │  └─ SKILL.md
│     ├─ infer-conventions
│     │  ├─ references
│     │  │  └─ checklist.md
│     │  └─ SKILL.md
│     ├─ laravel-best-practices
│     │  ├─ rules
│     │  │  ├─ advanced-queries.md
│     │  │  ├─ architecture.md
│     │  │  ├─ blade-views.md
│     │  │  ├─ caching.md
│     │  │  ├─ collections.md
│     │  │  ├─ config.md
│     │  │  ├─ db-performance.md
│     │  │  ├─ eloquent.md
│     │  │  ├─ error-handling.md
│     │  │  ├─ events-notifications.md
│     │  │  ├─ http-client.md
│     │  │  ├─ mail.md
│     │  │  ├─ migrations.md
│     │  │  ├─ queue-jobs.md
│     │  │  ├─ routing.md
│     │  │  ├─ scheduling.md
│     │  │  ├─ security.md
│     │  │  ├─ style.md
│     │  │  └─ validation.md
│     │  └─ SKILL.md
│     ├─ tailwindcss-development
│     │  └─ SKILL.md
│     └─ testing-best-practices
│        ├─ rules
│        │  ├─ assertions.md
│        │  ├─ endpoint-tests.md
│        │  ├─ finding-features.md
│        │  ├─ isolation.md
│        │  ├─ naming.md
│        │  ├─ performance.md
│        │  ├─ review.md
│        │  ├─ security.md
│        │  └─ test-data.md
│        └─ SKILL.md
├─ .editorconfig
├─ .mcp.json
├─ .npmrc
├─ AGENTS.md
├─ app
│  ├─ Enums
│  │  └─ Grade.php
│  ├─ Filament
│  │  └─ Resources
│  │     ├─ Courses
│  │     │  ├─ CourseResource.php
│  │     │  ├─ Pages
│  │     │  │  ├─ CreateCourse.php
│  │     │  │  ├─ EditCourse.php
│  │     │  │  └─ ListCourses.php
│  │     │  ├─ Schemas
│  │     │  │  └─ CourseForm.php
│  │     │  └─ Tables
│  │     │     └─ CoursesTable.php
│  │     └─ Lessons
│  │        ├─ LessonResource.php
│  │        ├─ Pages
│  │        │  ├─ CreateLesson.php
│  │        │  ├─ EditLesson.php
│  │        │  └─ ListLessons.php
│  │        ├─ Schemas
│  │        │  └─ LessonForm.php
│  │        └─ Tables
│  │           └─ LessonsTable.php
│  ├─ Http
│  │  ├─ Controllers
│  │  │  ├─ Auth
│  │  │  │  ├─ AuthenticatedSessionController.php
│  │  │  │  ├─ ConfirmablePasswordController.php
│  │  │  │  ├─ EmailVerificationNotificationController.php
│  │  │  │  ├─ EmailVerificationPromptController.php
│  │  │  │  ├─ NewPasswordController.php
│  │  │  │  ├─ PasswordController.php
│  │  │  │  ├─ PasswordResetLinkController.php
│  │  │  │  ├─ RegisteredUserController.php
│  │  │  │  └─ VerifyEmailController.php
│  │  │  ├─ Controller.php
│  │  │  ├─ CourseController.php
│  │  │  ├─ EnrollmentController.php
│  │  │  ├─ LessonController.php
│  │  │  └─ ProfileController.php
│  │  ├─ Middleware
│  │  │  └─ HandleInertiaRequests.php
│  │  └─ Requests
│  │     ├─ Auth
│  │     │  └─ LoginRequest.php
│  │     └─ ProfileUpdateRequest.php
│  ├─ Models
│  │  ├─ Course.php
│  │  ├─ Exam.php
│  │  ├─ ExamAttempt.php
│  │  ├─ ExamAttemptAnswer.php
│  │  ├─ Lesson.php
│  │  ├─ LessonCompletion.php
│  │  ├─ Order.php
│  │  ├─ Question.php
│  │  ├─ QuestionOption.php
│  │  └─ User.php
│  ├─ Providers
│  │  ├─ AppServiceProvider.php
│  │  └─ Filament
│  │     └─ AdminPanelProvider.php
│  └─ Services
│     └─ CloudinaryService.php
├─ artisan
├─ boost.json
├─ bootstrap
│  ├─ app.php
│  ├─ cache
│  │  ├─ packages.php
│  │  └─ services.php
│  └─ providers.php
├─ CLAUDE.md
├─ composer.json
├─ composer.lock
├─ config
│  ├─ app.php
│  ├─ auth.php
│  ├─ cache.php
│  ├─ database.php
│  ├─ filesystems.php
│  ├─ logging.php
│  ├─ mail.php
│  ├─ queue.php
│  ├─ services.php
│  └─ session.php
├─ database
│  ├─ factories
│  │  └─ UserFactory.php
│  ├─ migrations
│  │  ├─ 0001_01_01_000000_create_users_table.php
│  │  ├─ 0001_01_01_000001_create_cache_table.php
│  │  ├─ 0001_01_01_000002_create_jobs_table.php
│  │  ├─ 2026_09_08_045800_create_courses_table.php
│  │  ├─ 2026_09_08_045801_create_lessons_table.php
│  │  ├─ 2026_09_08_050129_create_exams_table.php
│  │  ├─ 2026_09_08_050130_create_questions_table.php
│  │  ├─ 2026_09_08_050158_create_question_options_table.php
│  │  ├─ 2026_09_08_050159_create_exam_attempts_table.php
│  │  ├─ 2026_09_08_050206_create_exam_attempt_answers_table.php
│  │  ├─ 2026_09_08_150928_add_phone_and_grade_to_users_table.php
│  │  ├─ 2026_09_09_025702_create_courses_table.php
│  │  ├─ 2026_09_09_025706_create_lessons_table.php
│  │  ├─ 2026_09_09_034733_create_course_user_table.php
│  │  ├─ 2026_09_09_042830_create_orders_table.php
│  │  ├─ 2026_09_09_042833_create_lesson_completions_table.php
│  │  ├─ 2026_09_09_045056_add_price_to_courses_table.php
│  │  ├─ 2026_09_09_122909_add_thumbnail_to_courses_table.php
│  │  ├─ 2026_09_09_133817_add_thumbnail_public_id_to_courses_table.php
│  │  └─ 2026_09_10_140413_add_is_admin_to_users_table.php
│  └─ seeders
│     └─ DatabaseSeeder.php
├─ ds
├─ jsconfig.json
├─ lang
│  └─ en
│     ├─ auth.php
│     ├─ pagination.php
│     ├─ passwords.php
│     └─ validation.php
├─ package-lock.json
├─ package.json
├─ phpunit.xml
├─ postcss.config.js
├─ public
│  ├─ .htaccess
│  ├─ css
│  ├─ favicon.ico
│  ├─ fonts
│  ├─ images
│  │  └─ logo.webp
│  ├─ index.php
│  ├─ js
│  └─ robots.txt
├─ README.md
├─ resources
│  ├─ css
│  │  └─ app.css
│  ├─ js
│  │  ├─ app.jsx
│  │  ├─ bootstrap.js
│  │  ├─ Components
│  │  │  ├─ ApplicationLogo.jsx
│  │  │  ├─ ArchIcon.jsx
│  │  │  ├─ Brandcontextmenu.jsx
│  │  │  ├─ Checkbox.jsx
│  │  │  ├─ Customcursor.jsx
│  │  │  ├─ DangerButton.jsx
│  │  │  ├─ DarkModeToggle.jsx
│  │  │  ├─ divider.jsx
│  │  │  ├─ dividerVertical.jsx
│  │  │  ├─ Dropdown.jsx
│  │  │  ├─ Iconbutton.jsx
│  │  │  ├─ InputError.jsx
│  │  │  ├─ InputLabel.jsx
│  │  │  ├─ IslamicPattern.jsx
│  │  │  ├─ Logo.jsx
│  │  │  ├─ MainButton.jsx
│  │  │  ├─ Modal.jsx
│  │  │  ├─ NavLink.jsx
│  │  │  ├─ PageLoader.jsx
│  │  │  ├─ press3d.js
│  │  │  ├─ Pressablecard.jsx
│  │  │  ├─ PrimaryButton.jsx
│  │  │  ├─ ResponsiveNavLink.jsx
│  │  │  ├─ SecondaryButton.jsx
│  │  │  ├─ TextInput.jsx
│  │  │  └─ Usepresssound.jsx
│  │  ├─ Hooks
│  │  │  ├─ useDarkMode.js
│  │  │  └─ Usepresssound.js
│  │  ├─ Layouts
│  │  │  ├─ AuthenticatedLayout.jsx
│  │  │  └─ GuestLayout.jsx
│  │  └─ Pages
│  │     ├─ Auth
│  │     │  ├─ ConfirmPassword.jsx
│  │     │  ├─ ForgotPassword.jsx
│  │     │  ├─ Login.jsx
│  │     │  ├─ Register.jsx
│  │     │  ├─ ResetPassword.jsx
│  │     │  └─ VerifyEmail.jsx
│  │     ├─ Courses
│  │     │  ├─ Checkout.jsx
│  │     │  ├─ Index.jsx
│  │     │  ├─ Learn.jsx
│  │     │  ├─ Myorders.jsx
│  │     │  └─ Show.jsx
│  │     ├─ Dashboard.jsx
│  │     ├─ Error.jsx
│  │     ├─ Profile
│  │     │  ├─ Edit.jsx
│  │     │  └─ Partials
│  │     │     ├─ DeleteUserForm.jsx
│  │     │     ├─ UpdatePasswordForm.jsx
│  │     │     └─ UpdateProfileInformationForm.jsx
│  │     └─ Welcome.jsx
│  └─ views
│     └─ app.blade.php
├─ routes
│  ├─ auth.php
│  ├─ console.php
│  └─ web.php
├─ storage
│  ├─ app
│  │  ├─ private
│  │  │  ├─ livewire-tmp
│  │  │  │  ├─ 63cLv5DZGAIul7yqTCXnz1RIL2JqKjOKOR3Fm4DS.jpg.json
│  │  │  │  ├─ Fm0aGWXSESmdaRhsW6PrLNOCjayTPfsDvX5N1xDA.jpg.json
│  │  │  │  ├─ jAlffqWGp6OvYJzlSLtrzOpoDXclXu6nEzkVm0ca.jpg.json
│  │  │  │  ├─ kbKJIADc1b7wlgfv3e4CNA4IMFdIzZVqhSX8GGv1.jpg
│  │  │  │  ├─ kbKJIADc1b7wlgfv3e4CNA4IMFdIzZVqhSX8GGv1.jpg.json
│  │  │  │  ├─ LyKxT5RchN97M6Ir4aSZ6TW4HMaYvIEorFZV3Oql.jpg.json
│  │  │  │  ├─ q2TOjfYTvfiHC5a7BStEa4juKJzCxX85C7wAL9aS.jpg.json
│  │  │  │  ├─ ta26lSeSlQsYhCHo9gTs1iU1sFNp1cIOVjpJY2bs.png
│  │  │  │  ├─ ta26lSeSlQsYhCHo9gTs1iU1sFNp1cIOVjpJY2bs.png.json
│  │  │  │  ├─ ubAjQ7QFzrYFM141MK9sA97yL9Ld15cj3daFwdXs.webp
│  │  │  │  ├─ ubAjQ7QFzrYFM141MK9sA97yL9Ld15cj3daFwdXs.webp.json
│  │  │  │  ├─ UpFNL6DoP9Dx9csJoyyjr5AH0xe8mQBygTXIlPPN.jpg.json
│  │  │  │  └─ XkYVYEJDUnSofrnoRCilQnioXrdoIGQDl7tBHXDS.jpg.json
│  │  │  └─ temp
│  │  │     └─ courses
│  │  │        ├─ 01M2476EZ7T170AEGZ24ZEQ48S.jpg
│  │  │        └─ 01M25TYZM8K1X37D2N769E217X.jpg
│  │  └─ public
│  │     ├─ course-temp
│  │     └─ lpJIcD786W1aZTWPgucR3CzRR5JqgYlwxou7MF1E.png
│  ├─ framework
│  │  ├─ cache
│  │  │  └─ data
│  │  ├─ sessions
│  │  ├─ testing
│  │  │  └─ _pest.php
│  │  └─ views
│  │     ├─ 0388c3d7ea9c96ded3ca5fb3b86f40a7.php
│  │     ├─ 07922704da5d0cab458ad12988444b0c.php
│  │     ├─ 090663dde5c6ee34ea57967a53c7e3e5.php
│  │     ├─ 091287adff932854e092d2ef186ca9e1.php
│  │     ├─ 09b92414aee774c9ae48cc44acc86b0b.php
│  │     ├─ 15805a5427be3673148b2048162f9e12.php
│  │     ├─ 1847cd6dc7bb9b6b80d37b9c7a4ae333.php
│  │     ├─ 196ef669195a402cb42518602e41a420.php
│  │     ├─ 1c4ab9c9150dc9f9ed9d77fe9cfb3786.php
│  │     ├─ 1c677899648619f4154085d4d0199b63.php
│  │     ├─ 1d429f25fd73a0a909f84e305e928f41.php
│  │     ├─ 1e3fb7bc2eda1029c1aa7b252fab24f3.php
│  │     ├─ 21c54cfc853af285314429ec4174e3f2.php
│  │     ├─ 2381a337f7818f586fc024c21e3a54e5.php
│  │     ├─ 24c793c4ea625b2d344c7bb7c7868213.php
│  │     ├─ 282b3bd8c01aaa64b1c3d4e376b589c8.php
│  │     ├─ 2ed4d059c1ea36602615eba5fd16205b.php
│  │     ├─ 2fac3fd809940d1ccdb34cb8ad2a44f3.php
│  │     ├─ 2fc024b1de0cfe5588a96b46aa143644.php
│  │     ├─ 31029ec02aac27f5d9ad8aa563f02391.php
│  │     ├─ 39163594d327043b4729c03377ae2f80.php
│  │     ├─ 3a52e267181e95b7e57152aa358af7e3.php
│  │     ├─ 3a6b771b057c6ac03b88eb476737e59d.php
│  │     ├─ 3e9e342b423ee03d882ad9720334aa65.php
│  │     ├─ 3ef7ab8ae9e3f4fd3410bd81b10a7e8f.php
│  │     ├─ 41a831430ba7defd3fbffe3d47287f9a.php
│  │     ├─ 42c2c5d3b1c43d5ba16188beafd08ef2.php
│  │     ├─ 460607b81daf97c9b378d34e9e5e3fb0.php
│  │     ├─ 4943bc92ebba41e8b0e508149542e0ad.blade.php
│  │     ├─ 4a5d797427243c0326bd55cd1b57b42e.php
│  │     ├─ 4b80da33744dd9058fb06afb2d3ed100.php
│  │     ├─ 4b918bd8a0a8a2ec49839711df8779cc.php
│  │     ├─ 4ba014aff7f37aaef006470423c6f323.php
│  │     ├─ 4c797cf3a46a1bf04a93df25606b8cd2.php
│  │     ├─ 5150eabfd1d9e08918fc7496e24d0467.php
│  │     ├─ 5a6c8810903424a351246a5306aa24c7.php
│  │     ├─ 5e6eee64d59ef9f84e6ac1b04db7655c.php
│  │     ├─ 6825620b3028dd27fc431a0090603f58.php
│  │     ├─ 6a8502862f8e2f68e59a91aebc088d25.php
│  │     ├─ 7453a3d5faf8de12f81eb9f577bae009.php
│  │     ├─ 7a353c396867e2cc42b718fc8fdbf69d.php
│  │     ├─ 7da5add967119a6250dcba22b3851b7f.php
│  │     ├─ 85ac7f1bbb5a08da05d855b43ec83c19.php
│  │     ├─ 87a9c4bb95fa4584febd0d942e9c3cd1.php
│  │     ├─ 8c22dbb8f437a4604c835f63ba4f3753.php
│  │     ├─ 8d9ff147fa6566f298c62c0f136ee333.php
│  │     ├─ 8ec04f10da89afcd90e7d4fd816ee0a7.php
│  │     ├─ 8f345c0baf3a6edb5dcda11247321e61.php
│  │     ├─ 9281d961d37fed106e2ff2d0b982c3dd.php
│  │     ├─ 97f8223b6b4b6323dc9844237ed1f811.php
│  │     ├─ 980cfada030d22f5dc8804a666537ca6.php
│  │     ├─ 9b063ccbfdb62b9e817bd01c9524ecdb.php
│  │     ├─ 9def7ecc831d7f02bbe114e2aec4fa6e.php
│  │     ├─ a017f9df63972cde466562e9e4344938.php
│  │     ├─ a9e5b92e2c5ae158332322df1faab2b3.php
│  │     ├─ ac307ab04eb167050c7217c00f318871.php
│  │     ├─ b063d3d73cd96e7901dbfa47cb5115da.php
│  │     ├─ b575dfff9abcc48340f0b51423c8447c.php
│  │     ├─ b6ae7c682a53bb933b254d51fd108885.php
│  │     ├─ b8335a6adb1dc94503876d384652be12.php
│  │     ├─ bcc2fbd688d9eba9d0f6f5cdd37e4d7a.php
│  │     ├─ bdc7161c3c44d5183d09536d66b7f863.php
│  │     ├─ c4134f1d50c31a4a8027b0bfd2b4f46b.php
│  │     ├─ c6464e2d5908fa5463c094befdc8519d.php
│  │     ├─ ccd01306c6dea64fb3520b9b86eec912.php
│  │     ├─ ce4e0bfd90916e662a9ae4a352a0d370.php
│  │     ├─ cf2419bb7d8286b77e6a7b3372c3324b.php
│  │     ├─ d391d154d2eab300675f2d802a37080b.php
│  │     ├─ d5229103e56bc84b2ec2c82da6773c6a.php
│  │     ├─ d6e82cbac320562158448b6b6491822f.php
│  │     ├─ d6ee49eb545d34e4c50a24e87648cce1.php
│  │     ├─ d71f282449271a052341c7acac58be9f.php
│  │     ├─ d8af57c58f6aba4b8464ec166d641925.php
│  │     ├─ d91be0f102f234adde66f03620bf1e7b.php
│  │     ├─ dcc26d112832e9ba69f29e2f41c7a406.php
│  │     ├─ de30a98e0ea6764de6ca44eac075b385.php
│  │     ├─ df9c2791b3dc3ab99ec217c200bf9cc6.php
│  │     ├─ dfe797008e5a996ac3fb4f916151181c.php
│  │     ├─ e38464d00704fc3bed273d5b5208d01a.php
│  │     ├─ e4f377b0cdb06d04bb6f305054f15114.php
│  │     ├─ e61cd15da60e83e976d10d6554137db7.php
│  │     ├─ e83d2af37ef8435fc68457f1e5647e84.php
│  │     ├─ e8b7e1655a841fb9ab2b7adf61b30b1b.php
│  │     ├─ e8fc26c23d4b34c91a4185fac49926f9.php
│  │     ├─ e917efb38a8bb627d0bb396ac2395719.php
│  │     ├─ edea78d6afb04053f5ac1a4c5de83b89.php
│  │     ├─ ee798dbcb97c8f34f667de5e8e121d84.php
│  │     ├─ f0fe1a83712dec8457404da4ebde6dee.php
│  │     ├─ f183f958842a9feebd4c7dbcd1843a77.php
│  │     ├─ f1bedbca226e0fbf2702b81baeaef56e.php
│  │     ├─ f697728624680448f5402e02adadd50b.php
│  │     ├─ fbc5132097710ae4b002c71b9e3a82cd.php
│  │     └─ fce3df855b278783e9bd77f1b4f7f3ea.php
│  └─ logs
├─ tailwind.config.js
├─ tests
│  ├─ Feature
│  │  ├─ Auth
│  │  │  ├─ AuthenticationTest.php
│  │  │  ├─ EmailVerificationTest.php
│  │  │  ├─ PasswordConfirmationTest.php
│  │  │  ├─ PasswordResetTest.php
│  │  │  ├─ PasswordUpdateTest.php
│  │  │  └─ RegistrationTest.php
│  │  ├─ ExampleTest.php
│  │  └─ ProfileTest.php
│  ├─ Pest.php
│  ├─ TestCase.php
│  └─ Unit
│     └─ ExampleTest.php
└─ vite.config.js

```