<?php

return [
    'settings' => [
        // Slim Settings
        'determineRouteBeforeAppMiddleware' => false,
        'displayErrorDetails' => true,
        'db' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'test',
            'username' => 'test_user',
            'password' => 'egkQuUZP2CtpaPha',
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
            'options' => [
                PDO::MYSQL_ATTR_SSL_CA => '/etc/pki/tls/certs/mysql-ssl-ca-cert.pem'
            ]
        ]
    ]
];
