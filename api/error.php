<?php

$appError = [];

$appError['4001'] = ['result' => '4001', 'error' => 'Required parameter missing'];
$appError['4002'] = ['result' => '4002', 'error' => 'Required JSON Body missing'];
$appError['4003'] = ['result' => '4003', 'error' => 'JSON Body Error'];
$appError['4004'] = ['result' => '4004', 'error' => 'Required Key missing in JSON Body'];
$appError['4005'] = ['result' => '4005', 'error' => 'Invalid Key value JSON Body'];
$appError['4006'] = ['result' => '4006', 'error' => 'Forbidden. Not privileged to access data'];

$appError['1001'] = ['result' => '1001', 'error' => 'Authentication failed'];
$appError['1002'] = ['result' => '1002', 'error' => 'Requested Data not found'];
$appError['1003'] = ['result' => '1003', 'error' => 'Mailing Error'];
$appError['1004'] = ['result' => '1004', 'error' => 'Data Error'];

$appError['5001'] = ['result' =>'5001', 'error' => 'Invalid HTTP Request'];
$appError['5002'] = ['result' =>'5002', 'error' => 'System Settings/DB Setup Issues'];
