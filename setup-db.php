<?php

/**
 * Manual setup script for Sanctum authentication
 */

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

// Database setup
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'sqlite',
    'database' => __DIR__ . '/database/database.sqlite',
    'prefix' => '',
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

echo "Setting up database...\n";

// Create users table if it doesn't exist
if (!$capsule->schema()->hasTable('users')) {
    $capsule->schema()->create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->timestamp('email_verified_at')->nullable();
        $table->string('password');
        $table->string('remember_token')->nullable();
        $table->timestamps();
    });
    echo "Users table created.\n";
} else {
    echo "Users table already exists.\n";
}

// Create personal access tokens table for Sanctum
if (!$capsule->schema()->hasTable('personal_access_tokens')) {
    $capsule->schema()->create('personal_access_tokens', function (Blueprint $table) {
        $table->id();
        $table->string('tokenable_type');
        $table->unsignedBigInteger('tokenable_id');
        $table->string('name');
        $table->string('token', 64)->unique();
        $table->text('abilities')->nullable();
        $table->timestamp('last_used_at')->nullable();
        $table->timestamp('expires_at')->nullable();
        $table->timestamps();
        
        $table->index(['tokenable_type', 'tokenable_id']);
    });
    echo "Personal access tokens table created.\n";
} else {
    echo "Personal access tokens table already exists.\n";
}

echo "Database setup complete!\n";