<?php
$URLS = array(
   'car' => 'http://www.wdcdn.net/rss/presentation/library/client/robotrepair/id/8dbfdcc479b8d646f71bb40a1c97cacb'
);

/* set up base dir */
$basePath = realpath(dirname(__FILE__) . '/../../');
set_include_path(get_include_path() . PATH_SEPARATOR . $basePath);

/* load dependencies */
require_once('src/dependency.php');
date_default_timezone_set('America/Los_Angeles');

//try and GET the feed key being requested
$feed = filter_input(INPUT_GET, 'feed', FILTER_SANITIZE_STRING);
$url = null;

if (array_key_exists($feed, $URLS)) {
    $url = $URLS[$feed];
} else if (!is_null($feed)) {
    //request for a specific feed that isn't in our whitelist. Error.
    header('Feed not found', true, 400);
    exit;
} else {
    //No `feed` givin. Default to the (ahem) "default" feed
    $url = $URLS['default'];
}

/*
    See if there is a callback. If there is, then we are returning JSONP instead of just JSON.
    
    is_valid_callback function provided by:
        http://www.geekality.net/2010/06/27/php-how-to-easily-provide-json-and-jsonp/

    This validator does NOT conform to the ideal padding rules specified by http://www.json-p.org.
    It can not namespace (the regex does not allow period characters, quotes, or brakets. It only
    allows callback strings that are valid variable names in JavaScript (accounting for non-latin
    characters)
*/
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

/* config options to send to the manager */
$config = array(
    'feedUrl'   => $url,
    'format'    => 'json', // <-- we want JSON data from the feed manager
);

/* get the feed */
$feedManager = new Feed_Manager($config);
$output = $feedManager->process();

/* determine the expires time for this feed */   
$ttl = $feedManager->getParser()->getProperty('ttl');
$expires = gmdate("r", strtotime('+'. $ttl .' minutes'));    

/* send 304 headers if the client cache is not stale */
if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE'])) {
    $modifiedSince = strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']);
    if ((time() - $ttl ) <= $modifiedSince) {
        header($_SERVER['SERVER_PROTOCOL'].' 304 Not Modified', true, 304);
        exit;
    }
} 

/*
 * check if the client will accept it gzip using the server headers
 * and if the server has gzip installed
 */
$HTTP_ACCEPT_ENCODING = NULL;
if (isset($_SERVER['HTTP_ACCEPT_ENCODING'])
        && function_exists('gzencode') ) {
    $HTTP_ACCEPT_ENCODING = $_SERVER['HTTP_ACCEPT_ENCODING'];
}


/*
 * Check if the client wants x-gzip or gzip headers
 */      
$encoding = FALSE;
if( strpos($HTTP_ACCEPT_ENCODING, 'x-gzip') !== FALSE ) {
    $encoding = 'x-gzip';
} elseif( strpos($HTTP_ACCEPT_ENCODING,'gzip') !== FALSE ) {
    $encoding = 'gzip';
}    

/*
    If there is a callback, then we want to send back JSONP.
    JSONP is **not** the same as JSON, so in order to comply with
    RFC 4329 and RFC 4627, we will change the Content-type header
    to be correct.
*/
if ($callback) {
    //There is a callback, which means we intend to send back JSONP.
    //JSONP is **not** JSON, so we must set the Content-type header
    //according to RFC 4329: http://tools.ietf.org/html/rfc4329
    header('Content-type: application/javascript');

    //add the padding the output
    $output = $callback . '(' . $output . ');';
} else {
    header('Content-type: application/json');
}

/*
 * gzip compress the output and send header if gzip encoding 
 * is possible
 */
if ($encoding != FALSE) {
    header('Content-Encoding: '. $encoding); 
    $output = gzencode($output, 9);
} 

header("Content-Length: ". strlen($output));

/* send cache headers based on the ttl */
header("Expires: $expires");
header('Cache-Control: max-age=86400, public');
header("Last-Modified: " . gmdate("r"));

echo $output;
