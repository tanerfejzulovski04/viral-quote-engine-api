<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class TemplateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $scope = $request->get('scope', 'global');
        
        $query = Template::query();
        
        if ($scope === 'global') {
            $query->global();
        } elseif ($scope === 'mine') {
            $query->forUser(auth()->id());
        } else {
            return response()->json([
                'error' => [
                    'code' => 'invalid_scope',
                    'message' => 'Scope must be either "global" or "mine"'
                ]
            ], 400);
        }
        
        $templates = $query->orderBy('created_at', 'desc')->get();
        
        return response()->json([
            'data' => $templates
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'config' => 'required|array',
        ]);

        $template = Template::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'config' => $validated['config'],
        ]);

        return response()->json([
            'data' => $template
        ], 201);
    }

    public function update(Request $request, Template $template): JsonResponse
    {
        // Check if template is global and user is not admin (simplified check)
        if ($template->isGlobal()) {
            return response()->json([
                'error' => [
                    'code' => 'readonly_template',
                    'message' => 'Global templates are read-only for normal users'
                ]
            ], 403);
        }

        // Check if template belongs to current user
        if ($template->user_id !== auth()->id()) {
            return response()->json([
                'error' => [
                    'code' => 'unauthorized',
                    'message' => 'You can only update your own templates'
                ]
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'config' => 'sometimes|array',
        ]);

        $template->update($validated);

        return response()->json([
            'data' => $template
        ]);
    }

    public function destroy(Template $template): JsonResponse
    {
        // Check if template is global and user is not admin (simplified check)
        if ($template->isGlobal()) {
            return response()->json([
                'error' => [
                    'code' => 'readonly_template',
                    'message' => 'Global templates are read-only for normal users'
                ]
            ], 403);
        }

        // Check if template belongs to current user
        if ($template->user_id !== auth()->id()) {
            return response()->json([
                'error' => [
                    'code' => 'unauthorized',
                    'message' => 'You can only delete your own templates'
                ]
            ], 403);
        }

        $template->delete();

        return response()->json([
            'data' => [
                'message' => 'Template deleted successfully'
            ]
        ]);
    }
}