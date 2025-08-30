<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get current authenticated user profile (GET /api/auth/me)
     */
    public function profile(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'timezone' => $user->timezone,
                'plan' => $user->plan,
                'trial_ends_at' => $user->trial_ends_at?->format('Y-m-d H:i:s'),
            ]
        ]);
    }

    /**
     * Update user profile (PUT /api/me)
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'timezone' => 'sometimes|string|max:255',
        ]);

        if (empty($validated)) {
            return response()->json([
                'error' => 'At least one field (name or timezone) is required'
            ], 400);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'timezone' => $user->timezone,
                'plan' => $user->plan,
                'trial_ends_at' => $user->trial_ends_at?->format('Y-m-d H:i:s'),
            ]
        ]);
    }
}