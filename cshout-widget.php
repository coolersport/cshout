<?php
/*
Plugin Name: CShout Plugin
Plugin URI: http://coolersport.info/
Description: CShout Plugin
Author: Tien D. Tran
Version: 3.0
Author URI: http://coolersport.info/
*/

function cshout_placeholder_setup()
{
	global $cshout_jsconfig, $cshout_config;
	include_once('config.inc.php');
	cshout_includes();
	echo '<div id="cshout3"></div>';
	cshout_show();
}

function widget_cshout($args) {
  extract($args);
  echo $before_widget;
  echo $before_title;?>CShout<?php echo $after_title;
  cshout_placeholder_setup();
  echo $after_widget;
}

function cshout_init()
{
  register_sidebar_widget(__('CShout 2.1'), 'widget_cshout');
}
add_action("plugins_loaded", "cshout_init");
