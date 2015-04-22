<?php
/*
 * Template Name: API
 * 
 */

if (isset($_GET['url'])) {
    $wpfields =  $_GET['url'];
    $URLS = array(
    'default' => $wpfields
);

$basePath = realpath(dirname(__FILE__) . '/');
set_include_path(get_include_path() . PATH_SEPARATOR . $basePath);

require_once('src/dependency.php');
date_default_timezone_set('America/New_York');

$feed = filter_input(INPUT_GET, 'feed', FILTER_SANITIZE_STRING);
$url = null;

if (array_key_exists($feed, $URLS)) {
    $url = $URLS[$feed];
} else if (!is_null($feed)) {
    header('Feed not found', true, 400);
    exit;
} else {
    $url = $URLS['default'];
}

function is_valid_callback($subject) {
    $identifier_syntax = '/^[$_\p{L}][$_\p{L}\p{Mn}\p{Mc}\p{Nd}\p{Pc}\x{200C}\x{200D}]*+$/u';

    $reserved_words = array('break', 'do', 'instanceof', 'typeof', 'case',
      'else', 'new', 'var', 'catch', 'finally', 'return', 'void', 'continue',
      'for', 'switch', 'while', 'debugger', 'function', 'this', 'with',
      'default', 'if', 'throw', 'delete', 'in', 'try', 'class', 'enum',
      'extends', 'super', 'const', 'export', 'import', 'implements', 'let',
      'private', 'public', 'yield', 'interface', 'package', 'protected',
      'static', 'null', 'true', 'false');

    return preg_match($identifier_syntax, $subject)
        && ! in_array(mb_strtolower($subject, 'UTF-8'), $reserved_words);
}

$callback = null;

if (isset($_GET['callback']) && is_valid_callback($_GET['callback'])) {
    $callback = $_GET['callback'];
}

$config = array(
    'feedUrl'   => $url,
    'format'    => 'json', 
);

$feedManager = new Feed_Manager($config);
$output = $feedManager->process();

$ttl = $feedManager->getParser()->getProperty('ttl');
$expires = gmdate("r", strtotime('+'. $ttl .' minutes'));    

if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])) {
    $modifiedSince = strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']);
    if ((time() - $ttl ) <= $modifiedSince) {
        header($_SERVER['SERVER_PROTOCOL'].' 304 Not Modified', true, 304);
        exit;
    }
} 

$HTTP_ACCEPT_ENCODING = NULL;
if (isset($_SERVER['HTTP_ACCEPT_ENCODING'])
        && function_exists('gzencode') ) {
    $HTTP_ACCEPT_ENCODING = $_SERVER['HTTP_ACCEPT_ENCODING'];
}

     
$encoding = FALSE;
if( strpos($HTTP_ACCEPT_ENCODING, 'x-gzip') !== FALSE ) {
    $encoding = 'x-gzip';
} elseif( strpos($HTTP_ACCEPT_ENCODING,'gzip') !== FALSE ) {
    $encoding = 'gzip';
}    

if ($callback) {
    header('Content-type: application/javascript');
    $output = $callback . '(' . $output . ');';
} else {
    header('Content-type: application/json');
}


if ($encoding != FALSE) {
    header('Content-Encoding: '. $encoding); 
    $output = gzencode($output, 9);
} 

header("Content-Length: ". strlen($output));

header("Expires: $expires");
header('Cache-Control: max-age=86400, public');
header("Last-Modified: " . gmdate("r"));

echo $output;
}else{
    // Fallback behaviour goes here
}


