<?php
/*
 * Template Name: Wiredrive Feed
 * 
 */

$context = Timber::get_context();
$post = new TimberPost();

$wpfields = get_field( "wiredrive_mrss" );
$url = urlencode($wpfields);
$context['apiUrl'] = $url;

$context['post'] = $post;
Timber::render(array('page-feed.twig'), $context);
