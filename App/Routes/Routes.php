<?php

use App\Controllers\Controller as controller;

$app->get('/', function ($request, $response) {
    $this->logger->addInfo('Home page, /, route called');
    $template = $this->twig->load('home.twig');
    return $template->render(array(
                            'name' => 'Home'
                        ));
})->setName('index');
