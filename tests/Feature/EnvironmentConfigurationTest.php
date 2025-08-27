<?php

namespace Tests\Feature;

use Tests\TestCase;

class EnvironmentConfigurationTest extends TestCase
{
    /**
     * Test that required environment variables are available.
     */
    public function test_required_environment_variables_exist(): void
    {
        // Test FRONTEND_URL is available
        $this->assertNotNull(env('FRONTEND_URL'));
        $this->assertEquals('http://localhost:5173', env('FRONTEND_URL'));
    }

    /**
     * Test that the application name is properly set.
     */
    public function test_application_name_is_set(): void
    {
        $this->assertEquals('Viral Quote Engine API', config('app.name'));
    }

    /**
     * Test that PostgreSQL database configuration is available in config files.
     */
    public function test_postgresql_database_configuration_exists(): void
    {
        // We need to test the actual config files, not the test-overridden values
        $databaseConfig = config('database.connections.pgsql');
        
        $this->assertEquals('pgsql', $databaseConfig['driver']);
        $this->assertEquals('127.0.0.1', $databaseConfig['host']);
        $this->assertEquals(5432, $databaseConfig['port']);
        
        // The database name and username will be overridden during testing,
        // but we can verify the connection configuration exists
        $this->assertArrayHasKey('database', $databaseConfig);
        $this->assertArrayHasKey('username', $databaseConfig);
        $this->assertArrayHasKey('password', $databaseConfig);
    }

    /**
     * Test that .env.example contains the required database configuration.
     */
    public function test_env_example_contains_required_configuration(): void
    {
        $envExamplePath = base_path('.env.example');
        $this->assertFileExists($envExamplePath);
        
        $envExampleContent = file_get_contents($envExamplePath);
        
        // Check for required database environment variables
        $this->assertStringContainsString('DB_CONNECTION=pgsql', $envExampleContent);
        $this->assertStringContainsString('DB_HOST=127.0.0.1', $envExampleContent);
        $this->assertStringContainsString('DB_PORT=5432', $envExampleContent);
        $this->assertStringContainsString('DB_DATABASE=viral_quote_engine', $envExampleContent);
        $this->assertStringContainsString('DB_USERNAME=postgres', $envExampleContent);
        
        // Check for required app configuration
        $this->assertStringContainsString('FRONTEND_URL=http://localhost:5173', $envExampleContent);
        $this->assertStringContainsString('APP_NAME="Viral Quote Engine API"', $envExampleContent);
    }
}