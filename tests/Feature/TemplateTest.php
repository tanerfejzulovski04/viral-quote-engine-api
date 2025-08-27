<?php

use App\Models\Template;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TemplateTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_global_templates()
    {
        // Create global templates
        Template::factory()->create(['user_id' => null, 'name' => 'Global Template']);
        
        $user = User::factory()->create();
        
        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/templates?scope=global');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'config', 'user_id', 'created_at', 'updated_at']
                ]
            ]);
    }

    public function test_can_get_user_templates()
    {
        $user = User::factory()->create();
        Template::factory()->create(['user_id' => $user->id, 'name' => 'User Template']);
        
        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/templates?scope=mine');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'config', 'user_id', 'created_at', 'updated_at']
                ]
            ]);
    }

    public function test_can_create_template()
    {
        $user = User::factory()->create();
        
        $templateData = [
            'name' => 'Test Template',
            'config' => ['background' => '#ffffff', 'text_color' => '#000000']
        ];

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/templates', $templateData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'name', 'config', 'user_id', 'created_at', 'updated_at']
            ]);

        $this->assertDatabaseHas('templates', [
            'name' => 'Test Template',
            'user_id' => $user->id
        ]);
    }

    public function test_cannot_update_global_template()
    {
        $user = User::factory()->create();
        $globalTemplate = Template::factory()->create(['user_id' => null]);

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/templates/{$globalTemplate->id}", ['name' => 'Updated Name']);

        $response->assertStatus(403)
            ->assertJson([
                'error' => [
                    'code' => 'readonly_template',
                    'message' => 'Global templates are read-only for normal users'
                ]
            ]);
    }

    public function test_can_update_own_template()
    {
        $user = User::factory()->create();
        $template = Template::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/templates/{$template->id}", ['name' => 'Updated Name']);

        $response->assertStatus(200);
        
        $this->assertDatabaseHas('templates', [
            'id' => $template->id,
            'name' => 'Updated Name'
        ]);
    }

    public function test_cannot_delete_global_template()
    {
        $user = User::factory()->create();
        $globalTemplate = Template::factory()->create(['user_id' => null]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/templates/{$globalTemplate->id}");

        $response->assertStatus(403);
    }

    public function test_can_delete_own_template()
    {
        $user = User::factory()->create();
        $template = Template::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/templates/{$template->id}");

        $response->assertStatus(200);
        
        $this->assertDatabaseMissing('templates', ['id' => $template->id]);
    }
}