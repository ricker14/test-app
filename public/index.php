<?php

session_start();

require '../vendor/autoload.php';

$config = require 'config.php';
$app = new \Slim\App($config);

// Add DIC
$container = $app->getContainer();

// Register Twig
$container['twig'] = function () {
    $loader = new \Twig\Loader\FilesystemLoader('../App/Views/');
    $twig = new \Twig\Environment($loader, array(
        'cache' => false,
    ));
    return $twig;
};

$container['logger'] = function() {
    $logger = new \Monolog\Logger('testApp');
    $file_handler = new \Monolog\Handler\StreamHandler('../log/app.log');
    $logger->pushHandler($file_handler);
    return $logger;
};

// Register DB Connection
$container['db'] = function ($container) {
    $capsule = new \Illuminate\Database\Capsule\Manager;
    $capsule->addConnection($container['settings']['db']);
    $capsule->setAsGlobal();
    $capsule->bootEloquent();
    return $capsule;
};

// Register routes
require __DIR__ . '/../App/Routes/Routes.php';

$app->run();
