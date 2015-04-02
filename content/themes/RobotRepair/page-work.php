<?php
/*
 * Template Name: Work Feed
 * 
 */


$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
Timber::render(array('page-work.twig'), $context);