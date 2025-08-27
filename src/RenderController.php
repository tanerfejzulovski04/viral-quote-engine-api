<?php

namespace App;

use Spatie\Browsershot\Browsershot;
use Exception;

class RenderController
{
    public function render()
    {
        try {
            // Get and validate input
            $input = $this->getInput();
            $this->validateInput($input);
            
            // Generate unique filename
            $filename = $this->generateFilename();
            $filePath = __DIR__ . '/../public/renders/' . $filename;
            
            // Create browsershot instance
            $browsershot = Browsershot::html($input['html'])
                ->windowSize($input['width'], $input['height'])
                ->setScreenshotType('png', 100);
            
            // Add watermark if provided
            if (!empty($input['watermark'])) {
                $htmlWithWatermark = $this->addWatermark($input['html'], $input['watermark']);
                $browsershot = Browsershot::html($htmlWithWatermark)
                    ->windowSize($input['width'], $input['height'])
                    ->setScreenshotType('png', 100);
            }
            
            // Save the screenshot
            $browsershot->save($filePath);
            
            // Return the public URL
            $imageUrl = $this->getBaseUrl() . '/public/renders/' . $filename;
            
            http_response_code(200);
            echo json_encode(['image_url' => $imageUrl]);
            
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    private function getInput()
    {
        // For testing purposes, check if global test input is set
        if (isset($GLOBALS['test_input'])) {
            $input = json_decode($GLOBALS['test_input'], true);
        } else {
            $input = json_decode(file_get_contents('php://input'), true);
        }
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON input');
        }
        
        return $input;
    }
    
    private function validateInput($input)
    {
        if (empty($input['html'])) {
            throw new Exception('HTML content is required');
        }
        
        if (empty($input['width']) || !is_numeric($input['width']) || $input['width'] <= 0) {
            throw new Exception('Valid width is required');
        }
        
        if (empty($input['height']) || !is_numeric($input['height']) || $input['height'] <= 0) {
            throw new Exception('Valid height is required');
        }
        
        // Width and height limits for security
        if ($input['width'] > 4000 || $input['height'] > 4000) {
            throw new Exception('Width and height cannot exceed 4000 pixels');
        }
    }
    
    private function generateFilename()
    {
        return 'render_' . uniqid() . '_' . time() . '.png';
    }
    
    private function addWatermark($html, $watermarkText)
    {
        $watermarkStyle = '
        <style>
        .watermark {
            position: fixed;
            bottom: 10px;
            right: 10px;
            color: rgba(128, 128, 128, 0.7);
            font-family: Arial, sans-serif;
            font-size: 12px;
            z-index: 9999;
            pointer-events: none;
        }
        </style>';
        
        $watermarkDiv = '<div class="watermark">' . htmlspecialchars($watermarkText) . '</div>';
        
        // Insert watermark style and div before closing body tag
        if (stripos($html, '</body>') !== false) {
            $html = str_ireplace('</body>', $watermarkStyle . $watermarkDiv . '</body>', $html);
        } else {
            // If no body tag, append to the end
            $html .= $watermarkStyle . $watermarkDiv;
        }
        
        return $html;
    }
    
    private function getBaseUrl()
    {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        
        return $protocol . '://' . $host;
    }
}