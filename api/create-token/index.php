<?php

// POST api/create-token
// To create a Token for a given room
//
// Parameter: None 
// Raw Body: Yes
// Return: Returns Token 

require '../error.php';
require '../utils.php';

header('Content-type: application/json');

$error = [];
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    $error = $appError['5001'];					// Invalid request method
    $error['desc'] = 'HTTP POST Requests only';
    print json_encode($error);
    exit;
}

$data = file_get_contents('php://input');
if (!$data) {	
	print json_encode($appError['4001']);		// JAW JSON Body missing
	exit;
}

$data = json_decode($data);
$json_error = json_last_error();
if ($json_error) {	
    $error = $appError['4003'];					// JSON Format issues
	$error['desc'] = getJSONError($json_error);
	print json_encode($error);
	exit;
}

if ($data->name && $data->role && $data->roomId) {
	// create a Token for a given data
	$ret = CreateToken($data);
	if ($ret) {	
        print $ret;
		exit;
	}	
} else {	 		
	$error = $appError['4004'];					// Required JSON Key missing
	$error['desc'] = 'JSON keys missing: name, role or roomId';	
	print json_encode($error);
	exit;
}
