<?php

namespace App\Controllers;

use Illuminate\Database\Capsule\Manager as DB;

class first
{
    private $app;
    
    public function __construct($app)
    {
        $this->app = $app;
        $this->app->db->connection('db');
    }
}
