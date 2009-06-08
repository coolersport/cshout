<?php
/******************************************************************************
 * config.inc.php
 * ----------------------------------------------------------------------------
 * DO NOT MODIFY OR REMOVE THIS COPYRIGHT SECTION
 * ----------------------------------------------------------------------------
 * Author       : Tien D. Tran (http://coolersport.info)
 * Copyright    : 2009 (c) Tien D. Tran
 * Application  : CShout
 * Version      : 3.0
 * Date Started : 2005/01/01
 * Last Modified: 2009/06/08
 *
 * This is a shoubox written in php and uses text file as database
 *
 * INSTALLATION:
 *             View installation.html
 * HOW TO USE THE SHOUTBOX:
 *             After installing successfully, click on ? button on the shoutbox
 *
 * Visit http://coolersport.info for any update of this shoutbox
 *
 ******************************************************************************/

/******* FRONTEND CONFIG *******/
$cshout_jsconfig['placeholder']     = 'cshout3'; // id of the div container
$cshout_jsconfig['layout']          = ''; // any html code, eg: <div style="height:300px;overflow:scroll">{shouts}</div>{controls}
$cshout_jsconfig['layout_controls'] = ''; // any html code
// eg: <div class="cs_formarea">{name}<br/>{message}<br/>{shout}{help}<br/>{show_smileys}{show_search}{show_login}{show_pages}{show_navigator}</div>{panel_smileys}{panel_search}{panel_login}{panel_pages}{panel_help}
$cshout_jsconfig['width']           = '200px'; // shoutbox width
$cshout_jsconfig['height']          = '500px'; // shoutbox height
$cshout_jsconfig['script_url']      = (substr(strtolower($_SERVER['SERVER_PROTOCOL']),0,5)=='https'?'https':'http').'://'.$_SERVER['SERVER_NAME'].substr($_SERVER['SCRIPT_NAME'],0,strlen(basename($_SERVER['SCRIPT_NAME']))*-1) . '/cshout.php';
$cshout_jsconfig['username']        = ''; // pre-populated username
$cshout_jsconfig['order']           = 'topdown';                     // bottomup: latest shout at bottom, topdown: latest shout on top

/******* BACKEND CONFIG *******/
$cshout_config['theme']           = 'default';
$cshout_config['adminname']       = 'cool';                     // leave blank to disable admin login
$cshout_config['adminpassword']   = '1q2w3e4r';                     // leave blank to disable admin login
$cshout_config['maxtries']        = 6;                      // number of failed login allowed
$cshout_config['failedbantime']   = 3600;                      // waiting time after $maxtries failed login (seconds)
$cshout_config['yourtimezone']    = 10;                     // your timezone from -12 to +12
$cshout_config['filename']        = 'cshout.txt';           // database text file
$cshout_config['shouternamelen']  = 12;
$cshout_config['shoutlen']        = 255;
$cshout_config['shoutsperpage']   = 30;                     // show 30 shouts per page
$cshout_config['delayshout']      = 15;                     // number of seconds between two shouts
// error messages
$cshout_config['error_noname']    = 'You need to input a name!';
$cshout_config['error_noshout']   = 'Slacker! Say something mate.';
$cshout_config['error_wait']      = 'Please wait for '.$cshout_config['delayshout'].' seconds between your shouts.';
$cshout_config['error_cantshout'] = 'You cannot shout at the moment. This shoutbox is readonly.';
$cshout_config['error_cantdelete']= 'You cannot delete shout. This shoutbox is readonly.';
$cshout_config['error_namereserved'] = 'You cannot use this name as it is reserved.';
$cshout_config['error_noadmin']   = 'Admin features are disabled';
$cshout_config['error_nousrpass'] = 'Username and password are required';
$cshout_config['error_templock']  = 'Admin features are temporarily disabled';
$cshout_config['error_wrongup']   = 'Username and password are incorrect';
// string constants
$cshout_config['str_searchfor']   = 'Search for...';
$cshout_config['str_found']       = 'Found {#} shouts contain <b>{Q}</b>';
$cshout_config['str_nofound']     = 'No shout contains <b>{Q}</b>';
$cshout_config['str_noquery']     = 'Search for nothing?';

$cshout_config['usemask']         = true;                   // use mask for links and emails, true or false
$cshout_config['link_mask']       = '[link]';               // link mask
$cshout_config['email_mask']      = '[email]';              // email mask
$cshout_config['smileydir']       = 'images/emoticons/';    // the smiley directory. Must ends with a forward slash
                                           // make it empty to disable emoticons
$cshout_config['smileys']         = array (                 // smileys definition
      '[:)]'     => 'icon_smile.gif',
      '[:D]'     => 'icon_biggrin.gif',
      '[:))]'    => 'icon_lol.gif',
      '[=))]'    => 'icon_ngakak.gif',
      '[:p]'     => 'icon_razz.gif',
      '[;)]'     => 'icon_wink.gif',
      '[:D~]'    => 'icon_slurp.gif',
      '[:")]'    => 'icon_redface.gif',
      '[:l]'     => 'icon_mmm.gif',
      '[:(]'     => 'icon_sad.gif',
      '[:o]'     => 'icon_surprised.gif',
      '[:s]'     => 'icon_worried.gif',
      '[:((]'    => 'icon_cry.gif',
      '[zzz]'    => 'icon_zzz.gif',
      '[8)]'     => 'icon_cool.gif',
      '[:*]'     => 'icon_kiss.gif',
      '[:x]'     => 'icon_wek.gif',
      '[mad]'    => 'icon_mad.gif',
      '[evil]'   => 'icon_evil.gif',
      '[roll]'   => 'icon_rolleyes.gif',
      '[:tt]'    => 'icon_applause.gif',
      '[:v]'     => 'icon_pis.gif',
      '[hihi]'   => 'icon_hihihi.gif',
      '[:$]'     => 'icon_duit.gif',
      '[:!]'     => 'icon_exclaim.gif',
      '[:?]'     => 'icon_question.gif',
      '[idea]'   => 'icon_idea.gif',
      '[@};-]'   => 'icon_rose.gif',
      '[~:)]'    => 'icon_chick.gif',
      '[:()]'    => 'icon_monkey.gif'
);
$cshout_config['badwords'] = array(                  // bad words filter
       "fuck",
       "crack",
       "hack",
       "shit",
       "dick"
);
$cshout_config['restrictedmsg'] = "Dude, no more spam!";
$cshout_config['restrictedwords'] = array(                  // restrict shout contains those phrases
       "blogspot.com",
       ".lycos.",
       "trumba.com",
       "volleyballmag",
       "tramadol",
       "showhype",
       "esnips.com",
       "mediamedicine",
       ".arm.com",
       "cialis",
       "dezinedepot",
       ".hi5.",
       ".1up.",
       "mograph",
       "groups.adobe.com",
       "riffs.",
       "sproutit",
       "cctlds.",
       "fitness.com",
       "footballforum.",
       "thesite.",
       "gomedia.",
       "godiscussions.",
       "playayou.",
       "viagra",
       "Hi! http:"
);

$cshout_config['isAdmin']         = false;
$cshout_config['lastip']          = $_SESSION['lastip']            ? $_SESSION['lastip']        : '0.0.0.0';
$cshout_config['lasttime']        = $_SESSION['lasttime']          ? $_SESSION['lasttime']      : time() - $cshout_config['delayshout'] - 2;
$cshout_config['tries']           = intval($_SESSION['tries']) > 0 ? intval($_SESSION['tries']) : 0;
$cshout_config['lasttry']         = $_SESSION['lasttry']           ? $_SESSION['lasttry']       : time();
$cshout_config['url']             = (substr(strtolower($_SERVER['SERVER_PROTOCOL']),0,5)=='https'?'https':'http').'://'.$_SERVER['SERVER_NAME'].substr($_SERVER['SCRIPT_NAME'],0,strlen(basename($_SERVER['SCRIPT_NAME']))*-1);
$cshout_config['datafilewarning'] = '';

/******* BACKEND CONFIG ENDS - DO NOT MODIFY ANY FURTHER TO AVOID BREAKING STUFF *******/

if ($cshout_config['theme'] && file_exists(dirname(__FILE__) . '/themes/' . $cshout_config['theme'] . '/theme.conf.php'))
	include_once(dirname(__FILE__) . '/themes/' . $cshout_config['theme'] . '/theme.conf.php');

function cshout_includes() {
	global $cshout_config;
?>
<link rel="stylesheet" type="text/css" href="<?php echo $cshout_config['url'],'themes/',$cshout_config['theme'],'/',$cshout_config['theme'] ?>.css" />
<script type="text/javascript" src="<?php echo $cshout_config['url'] ?>cshout.packed.js"></script>
<?php }

function cshout_show($placeholder = false) {
	global $cshout_jsconfig;
	if ($placeholder !== false) $cshout_jsconfig['placeholder'] = $placeholder;
?>
<script type="text/javascript">
<?php foreach($cshout_jsconfig as $key => $value) if ($value) echo 'cshout.',$key,'=\'',$value,'\';' ?>
window.onload = function () {
	cshout.show();
}
</script>
<?php }
