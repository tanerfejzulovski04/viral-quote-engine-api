<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $globalTemplates = [
            [
                'name' => 'Classic Quote',
                'config' => [
                    'background' => '#ffffff',
                    'text_color' => '#000000',
                    'font_family' => 'Arial',
                    'font_size' => '24px',
                    'text_align' => 'center',
                    'padding' => '40px',
                    'border' => 'none',
                    'quote_style' => 'quotation_marks',
                ],
            ],
            [
                'name' => 'Modern Gradient',
                'config' => [
                    'background' => 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    'text_color' => '#ffffff',
                    'font_family' => 'Roboto',
                    'font_size' => '28px',
                    'text_align' => 'center',
                    'padding' => '50px',
                    'border_radius' => '15px',
                    'quote_style' => 'clean',
                ],
            ],
            [
                'name' => 'Minimalist Dark',
                'config' => [
                    'background' => '#1a1a1a',
                    'text_color' => '#f5f5f5',
                    'font_family' => 'Helvetica',
                    'font_size' => '26px',
                    'text_align' => 'left',
                    'padding' => '35px',
                    'border_left' => '4px solid #ff6b6b',
                    'quote_style' => 'dash',
                ],
            ],
        ];

        foreach ($globalTemplates as $template) {
            Template::create([
                'user_id' => null, // Global template
                'name' => $template['name'],
                'config' => $template['config'],
            ]);
        }
    }
}