<?php

include_once('inc/tb-acf.php');
include_once ('inc/tb-plugins.php');

if ( ! class_exists( 'Timber' ) ) {
	add_action( 'admin_notices', function() {
			echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
		} );
	return;
}
define('THEME_URL', get_template_directory_uri());

class StarterSite extends TimberSite {

	function __construct() {
		add_theme_support( 'post-formats' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'menus' );
		add_filter( 'timber_context', array( $this, 'add_to_context' ) );
		add_filter( 'get_twig', array( $this, 'add_to_twig' ) );
		add_action('wp_enqueue_scripts', array($this, 'load_scripts'));	
		add_action('wp_enqueue_scripts', array($this, 'load_styles'));
		add_action('init', array($this,  'removeHeadLinks'));
		parent::__construct();
	}

	function add_to_context( $context ) {
		$context['menu'] = new TimberMenu('Overlay Menu');
		$context['work_main'] = new TimberMenu('Work Menu');
		$context['work_sub'] = new TimberMenu('Work Sub-Menu');
		$context['site'] = $this;
		return $context;
	}

	function load_scripts(){
		wp_enqueue_script('jquery');
		wp_enqueue_script( 'modernizr', THEME_URL . '/js/vendor/modernizr-2.8.3.min.js', array('jquery'), false, false);
		wp_enqueue_script( 'main-compressed', THEME_URL . '/js/main.min.js', array('jquery'), '', true);
	}
	function load_styles() {
		wp_enqueue_style( 'robotrepair', THEME_URL . '/css/main.css'); 
	}

	function removeHeadLinks() {
    	remove_action('wp_head', 'rsd_link');
    	remove_action('wp_head', 'wlwmanifest_link');
    	remove_action('wp_head', 'wp_generator');
    }

	function add_to_twig( $twig ) {
		/* this is where you can add your own fuctions to twig */
		$twig->addExtension( new Twig_Extension_StringLoader() );
		$twig->addFilter( 'myfoo', new Twig_Filter_Function( 'myfoo' ) );
		return $twig;
	}

}

new StarterSite();

function myfoo( $text ) {
	$text .= ' bar!';
	return $text;
}
