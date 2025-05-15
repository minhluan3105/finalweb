<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_middleware', 'jetstream')
])->group(function () {
    Route::get('/user', function () {
        return response()->json(auth()->user());
    });
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Email Verification Routes

// The verification route that Laravel will send in the email
// This route should be protected by `signed` middleware and ideally `auth:sanctum` if the user is expected to be logged in.
// However, activation links are often clicked when not logged in or in a different browser.
// For MustVerifyEmail trait, Laravel's default notification sends a signed URL like: 
// http://your-app.com/api/email/verify/{id}/{hash}?expires={timestamp}&signature={signature}
// If this URL is hit directly by the browser (user clicks link), and it's an API route, 
// it will verify and then show a JSON response. This is not ideal UX.
// A better UX is to have the link go to a frontend page, which then calls this backend API.
// Or, this backend API, upon success, redirects to a frontend page.

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill(); // Marks the email as verified
    // Instead of JSON, redirect to a frontend page indicating success
    // The frontend URL should be configurable, e.g., from .env
    return redirect(config('app.frontend_url', '/') . '/email-verified-successfully'); 
})->middleware(['signed'])->name('verification.verify'); // Removed 'auth:sanctum' to allow verification without being logged in via API token for this specific link.

// Route for the user to request a new verification email
Route::post('/email/verification-notification', function (Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email already verified.'], 400);
    }
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification link sent!']);
})->middleware(['auth:sanctum', 'throttle:6,1'])->name('verification.send'); 