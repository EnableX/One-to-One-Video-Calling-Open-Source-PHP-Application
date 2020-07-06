<?php

// GET api/get-room/{room_id}
// To get information of a given room
//
// URL Pattern: room_id appended at the end of URL
// Return: Returns Room Meta

require '../error.php';
require '../utils.php';

header('Content-type: application/json');

$error = [];
if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    $error = $appError['5001'];					// Invalid request method
    $error['desc'] = 'HTTP GET Requests only';
    print json_encode($error);
    exit;
}

/* Process Query String */
$roomId	= $_GET['roomId'];
if (!$roomId) {
    $error = $appError['4004'];					// Required input param is missing
    $error['desc'] = 'Failed to get roomId from URL';
    print json_encode($error);
    exit;
}

// get information of a given room
$ret = getRoom($roomId);
if ($ret) {
    print $ret;
    exit;
}
