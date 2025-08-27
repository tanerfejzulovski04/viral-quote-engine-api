<?php

namespace App\Http\Controllers;

use App\Models\BrandKit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BrandKitController extends Controller
{
    /**
     * Display the specified user's brand kit.
     */
    public function show(Request $request)
    {
        $userId = $request->query('user_id', 1); // Default to user_id 1 for testing
        
        $brandKit = BrandKit::where('user_id', $userId)->first();
        
        if (!$brandKit) {
            return response()->json(['message' => 'Brand kit not found'], 404);
        }

        return response()->json($brandKit);
    }

    /**
     * Create or update the specified user's brand kit.
     */
    public function upsert(Request $request)
    {
        $userId = $request->input('user_id', 1); // Default to user_id 1 for testing

        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable|integer',
            'primary_color' => 'required|string',
            'secondary_color' => 'required|string',
            'accent_color' => 'required|string',
            'font_family' => 'required|string|max:255',
            'logo_url' => 'nullable|string',
            'watermark_text' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $brandKit = BrandKit::updateOrCreate(
            ['user_id' => $userId],
            $request->only([
                'primary_color',
                'secondary_color', 
                'accent_color',
                'font_family',
                'logo_url',
                'watermark_text'
            ])
        );

        return response()->json($brandKit);
    }
}