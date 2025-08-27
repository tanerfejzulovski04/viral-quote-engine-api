<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CorsConfigurationTest extends TestCase
{
    /**
     * Test that CORS headers are properly set for actual requests from allowed origin.
     */
    public function test_cors_actual_request_from_frontend_origin(): void
    {
        $response = $this->get('/api/health', [
            'Origin' => 'http://localhost:5173',
        ]);

        $response->assertStatus(200);
        $response->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        $response->assertHeader('Access-Control-Allow-Credentials', 'true');
        $response->assertJson([
            'status' => 'ok',
            'message' => 'Viral Quote Engine API is running'
        ]);
    }

    /**
     * Test that the API health endpoint returns correct response.
     */
    public function test_api_health_endpoint_works(): void
    {
        $response = $this->get('/api/health');

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'ok',
            'message' => 'Viral Quote Engine API is running'
        ]);
    }

    /**
     * Test that CORS configuration exists and contains required settings.
     */
    public function test_cors_configuration_is_properly_set(): void
    {
        $corsConfig = config('cors');
        
        // Check paths include API
        $this->assertContains('api/*', $corsConfig['paths']);
        
        // Check allowed methods include required ones
        $allowedMethods = $corsConfig['allowed_methods'];
        $requiredMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
        
        foreach ($requiredMethods as $method) {
            $this->assertContains($method, $allowedMethods, "Method {$method} should be allowed");
        }
        
        // Check that frontend URL is in allowed origins
        $allowedOrigins = $corsConfig['allowed_origins'];
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $this->assertContains($frontendUrl, $allowedOrigins, 'Frontend URL should be in allowed origins');
        
        // Check credentials are supported
        $this->assertTrue($corsConfig['supports_credentials'], 'CORS should support credentials');
        
        // Check max age is set
        $this->assertGreaterThan(0, $corsConfig['max_age'], 'Max age should be greater than 0');
    }
}