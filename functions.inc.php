<?php
/******************************************************************************
 * functions.inc.php
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

/************** DO NOT MODIFY CODE BELOW THIS LINE *******************/
/************** UNLESS YOU KNOW WHAT YOU ARE DOING *******************/

// fix up global variables
$postKeys = array('act', 'u', 'p');
$getKeys = array('act', 'name', 'shout', 'k', 'lk', 'q');
foreach($postKeys as $key) if (!isset($_POST[$key])) $_POST[$key] = '';
foreach($getKeys as $key) if (!isset($_GET[$key])) $_GET[$key] = '';

function show_smiley($item1, $key, $prefix) {
	echo '<sm t="'.htmlspecialchars($key, ENT_QUOTES).'" s="'.htmlspecialchars($prefix.$item1, ENT_QUOTES).'" />';
}
function show_smiley2($item1, $key, $prefix) {
	echo '<sm t="'.htmlspecialchars($key, ENT_QUOTES).'" s="" />';
}
function alter_smiley(&$item1, $key, $prefix) {
	$item1 = '<img alt="'.htmlspecialchars($key).'" src="'.$prefix.$item1.'" align="middle" border="0" />';
}
function alter_smiley2(&$item1, $key, $prefix) {
	$item1 = htmlspecialchars($key);
}
function containsRestrictedWords(&$text) {
	global $restrictedwords;
	for ($i=0;$i<count($restrictedwords);$i++)
	if (!(stripos($text, $restrictedwords[$i]) === false))
	return true;
	return false;
}
function removeBadWords(&$text, $replace = '[:)]') {
	global $badwords;
	// add bad words to your filter here
	for ($i=0;$i<count($badwords);$i++)
	$text = preg_replace('/\b'.$badwords[$i].'\b/i', $replace, $text);
}
function convertChars($m) {
	return '&#'.intval(substr($m[0],2),16).';';
}

if (!function_exists('cshout_is_admin')) :
function cshout_is_admin() {
	global $cshout_config;
	return $cshout_config['adminname'] != ''
	&& $cshout_config['adminpassword'] != ''
	&& $_SESSION['u'] == sha1($cshout_config['adminname'])
	&& $_SESSION['p'] == sha1($cshout_config['adminpassword']);
}
endif;

if (!function_exists('cshout_get_shouter')) :
function cshout_get_shouter() {
	global $cshout_jsconfig;
	return $cshout_jsconfig['username'] ? $cshout_jsconfig['username'] : $_GET['name'];
}
endif;

function showError($error) {
	cshout_header();
	echo '<cshout>';
	echo '<fe>'.htmlspecialchars($error, ENT_QUOTES).'</fe>';
	echo '</cshout>';
	die;
}

/*
 * Print header
 */
function cshout_header() {
	global $cshout_config;
	if ($cshout_config['header_sent']) return;
	//header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
	header('Content-Type: text/xml');
	echo '<?xml version="1.0" encoding="iso-8859-1" standalone="yes" ?>';
	$cshout_config['header_sent'] = true;
}

/*
 * Process loggig in/out
 */
function cshout_process_login() {
	global $cshout_config;
	if($_POST['act']=='login') {
		$_SESSION['u'] = '';
		$_SESSION['p'] = '';
		if ($cshout_config['adminname']=='' || $cshout_config['adminpassword']=='') {
			showError($cshout_config['error_noadmin']);
		} else if (empty($_POST['u']) || empty($_POST['p'])) {
			showError($cshout_config['error_nousrpass']);
		} else if ($_SESSION['lasttry'] > time()) {
			showError($cshout_config['error_templock']);
		} else if ($_POST['u']!=sha1($cshout_config['adminname']) || $_POST['p']!=sha1($cshout_config['adminpassword'])) {
			$_SESSION['tries']++;
			if ($_SESSION['tries']>$cshout_config['maxtries']) {
				$_SESSION['lasttry'] = time() + $cshout_config['failedbantime'];
				$_SESSION['tries'] = 0;
			}
			showError($cshout_config['error_wrongup']);
		} else {
			$errorMsg = 'ok';
			$_SESSION['lasttry'] = time();
			$_SESSION['tries'] = 0;
			$_SESSION['u'] = $_POST['u'];
			$_SESSION['p'] = $_POST['p'];
			showError('ok');
		}
	} else if($_POST['act']=='logout') {
		$_SESSION['u'] = '';
		$_SESSION['p'] = '';
		showError('ok');
	}

	$cshout_config['isAdmin'] = cshout_is_admin();
}

function cshout_return_smileys() {
	global $cshout_config;
	if($_GET['act']=='smileys'){
		cshout_header();
		echo '<cshout>';
		if ($cshout_config['smileydir']=='' || !is_dir($cshout_config['smileydir']))
		array_walk($cshout_config['smileys'], 'show_smiley2', $cshout_config['url'].$cshout_config['smileydir']);
		else
		array_walk($cshout_config['smileys'], 'show_smiley', $cshout_config['url'].$cshout_config['smileydir']);
		echo '</cshout>';
		die;
	}
}

function cshout_check_datafile() {
	global $cshout_config;
	if (!file_exists($cshout_config['filename'])) {
		if (!is_writable('./')) {
			echo '<cshout><info islogged="0" pages="1" /><e>';
			$cshout_config['datafilewarning'] .= '<div id="sb_error">';
			$cshout_config['datafilewarning'] .= 'The data file ('.$cshout_config['filename'].') does not exist.<br>';
			$cshout_config['datafilewarning'] .= 'Create one or provide write permission to the shoutbox\'s directory ';
			$cshout_config['datafilewarning'] .= 'by running the following command in that directory:<br>';
			$cshout_config['datafilewarning'] .= '<b>chmod 777 .</b><br>';
			$cshout_config['datafilewarning'] .= 'This will allow it to create new data file automatically.</div>';
			echo htmlspecialchars($cshout_config['datafilewarning'], ENT_QUOTES);
			echo '</e></cshout>';
			die;
		} else {
			$handle = fopen($cshout_config['filename'], 'w') or die('<cshout><info islogged="0" pages="1" /><e>'.htmlspecialchars('<div id="sb_error">Can\'t create file.</div>', ENT_QUOTES).'</e></cshout>');
			fclose($handle);
		}
	}
	if (!is_writable($cshout_config['filename'])) {
		$cshout_config['datafilewarning'] .= 'The data file ('.$cshout_config['filename'].') is not writeable. ';
		$cshout_config['datafilewarning'] .= 'Run<br><b>chmod 666 '.$cshout_config['filename'].'</b><br>to make it writeable on linux.<br>';
		$cshout_config['datafilewarning'] .= 'People cannot shout!';
		$cshout_config['datafilewarning']  = '<e>'.htmlspecialchars($cshout_config['datafilewarning'], ENT_QUOTES).'</e>';
	}
}

/*
 * Save the shout once the submit button is clicked
 */
function cshout_save_shout() {
	global $cshout_config;
	if($_GET['act']!='shout') return;

	if (!is_writable($cshout_config['filename'])) {
		showError($cshout_config['error_cantshout']);
	} else if(time()-$cshout_config['lasttime']<$cshout_config['delayshout']) {
		// flooding control here
		showError(str_replace('{#}', $cshout_config['delayshout'], $cshout_config['error_wait']));
	} else if(containsRestrictedWords($_GET['shout'])) {
		showError($cshout_config['restrictedmsg']);
	} else {
		$name = trim(cshout_get_shouter());
		$name = str_replace("\r", '', $name);
		$name = str_replace("\n", '', $name);
		$shout = trim($_GET['shout']);
		$shout = str_replace("\r", '', $shout);
		$shout = str_replace("\n", '', $shout);
		$shout = substr($shout, 0, $cshout_config['shoutlen']);
		if(!$name || $name=='' || strtolower($name)=='name') showError($cshout_config['error_noname']);
		elseif(!$cshout_config['isAdmin'] && strcasecmp($name, $cshout_config['adminname'])==0) showError($cshout_config['error_namereserved']);
		elseif(trim($shout)=='' || strtolower($shout)=='message') showError($cshout_config['error_noshout']);
		// Good, now the essentials are taken care of!
		// Let's make the name display a link if there is a site specified.
		else {
			$name = str_replace('|', '&#124;',$name);
			$shout = str_replace('|', '&#124;',trim($shout));
			$name = preg_replace_callback('/%u[0-9A-F]{4}/', 'convertChars', $name);
			$shout = preg_replace_callback('/%u[0-9A-F]{4}/', 'convertChars', $shout);

			$handle = fopen($cshout_config['filename'],'a');
			$yourtimezone = floor($cshout_config['yourtimezone']);
			if ($yourtimezone<-12 || $yourtimezone>12) $yourtimezone = 0;

			// Date...
			$date = gmdate('d/m/Y', time() + 3600*($yourtimezone+(date('I')==1?0:1)));
			$time = gmdate('H:i:s', time() + 3600*($yourtimezone+(date('I')==1?0:1)));

			$ipaddr = $_SERVER['REMOTE_ADDR'];

			removeBadWords($name, '***');
			removeBadWords($shout, '***');

			// Let's make all of the data one string now!
			$data = "$name | $date | $time | $ipaddr | $shout\n";
			fwrite($handle,$data);
			fclose($handle);

			$_SESSION['lastip'] = $ipaddr;
			$_SESSION['lasttime'] = time();
		}
	}
}

function cshout_main() {
	global $cshout_jsconfig,$cshout_config;

	cshout_header();

	$shouts = file($cshout_config['filename']);
	$count = 0;
	$totalshouts = count($shouts)-1;

	/************* DELETE SELECTED SHOUT *****************/
	if($_GET['act']=='del' && !empty($_GET['k'])) { // delete a shout
		if (!is_writable($cshout_config['filename'])) {
			showError($error_cantdelete);
		} else if ($cshout_config['isAdmin']) {
			for ($count = 0; $count<=$totalshouts; $count++) {
				if (md5($shouts[$count])==$_GET['k']) unset($shouts[$count]);
			}
			$handle = fopen($cshout_config['filename'],'w');
			fwrite($handle, implode('', $shouts));
			fclose($handle);
			$shouts = file($cshout_config['filename']);
			$totalshouts = count($shouts)-1;
		}
	}

	$pages = ceil($totalshouts / $cshout_config['shoutsperpage']);
	if ($pages<1) $pages=1;
	$page = $_GET['page'];
	if (!$page) $page=1;
	if ($page<0) $page = 1;
	if ($page>$pages) $page = $pages;

	if ($cshout_config['smileydir']=='' || !is_dir($cshout_config['smileydir']))
	array_walk ($cshout_config['smileys'], 'alter_smiley2', $cshout_config['url'].$cshout_config['smileydir']);
	else
	array_walk ($cshout_config['smileys'], 'alter_smiley', $cshout_config['url'].$cshout_config['smileydir']);

	$countmin = $cshout_config['shoutsperpage']*($page-1);
	$countmax = $cshout_config['shoutsperpage']*$page - 1;
	if ($countmax > $totalshouts) $countmax = $totalshouts;

	if (!empty($_GET['lk']) && $_GET['lk'] == md5($shouts[$totalshouts])) {
		showError('uc'); // unchanged code
	}

	// invert order of the shouts, last shout will go first
	arsort($shouts);

	$link_search = array('/\</',
                    '/\>/',
                    '#([\n ])([a-z0-9\-_.]+?)@([^, \n\r]+)#i',
               '#([\n ])www\.([a-z0-9\-]+)\.([a-z0-9\-.\~]+)((?:/[^, \n\r]*)?)#i',
               '/(?<!<a href=")((http|ftp)+(s)?:\/\/[^<>\s]+)/i');
	if ($usemask)
	$link_replace = array('&lt;',
                    '&gt;',
               '\\1<a href="mailto:\\2@\\3">'.$email_mask.'</a>',
               '\\1<a href="http://www.\\2.\\3\\4" target="_blank">'.$link_mask.'</a>',
               '<a href="\\0" target="_blank">'.$link_mask.'</a>');
	else
	$link_replace = array('&lt;',
                    '&gt;',
               '\\1<a href="mailto:\\2@\\3">\\2@\\3</a>',
               '\\1<a href="http://www.\\2.\\3\\4" target="_blank">www.\\2.\\3\\4</a>',
               '<a href="\\0" target="_blank">\\0</a>');

	$delbutton = '';
	if ($_GET['act']=='search') {
		$q = $_GET['q'];
		echo '<cshout><info islogged="'.($cshout_config['isAdmin']?1:0).'" pages="'.$pages.'" />'.$cshout_config['datafilewarning'];
		if($q!='' && $q!=$cshout_config['str_searchfor']) {
			$q = preg_replace_callback('/%u[0-9A-F]{4}/', 'convertChars', $q);
			$found = 0;
			$str = '';
			for ($count = 0; $count<=$totalshouts; $count++) {
				list($auth,$date,$time,$ipaddr,$shout) = explode(' | ', $shouts[$totalshouts-$count]);
				if (!(stristr($shouts[$totalshouts-$count], $q)===false)) {
					$shout = strip_tags($shout);
					$shout = stripslashes($shout);
					$shout = preg_replace($link_search, $link_replace, $shout);
					$shout = strtr($shout, $cshout_config['smileys']);
					$shout = htmlspecialchars($shout, ENT_QUOTES);
					echo '<s k="'.md5($shouts[$totalshouts-$count]).'" ip="'.$ipaddr.'" n="'.htmlspecialchars($auth, ENT_QUOTES).'" d="'.$date.'" t="'.$time.'">'.$shout.'</s>';
					$found++;
				}
			}
			if ($found>0) {
				$str_found = str_replace('{#}', $found, $cshout_config['str_found']);
				$str_found = str_replace('{Q}', $q, $str_found);
				echo '<e>'.htmlspecialchars($str_found, ENT_QUOTES).'</e>';
				echo $str;
				echo '</cshout>';
				die;
			} else {
				$str_nofound = str_replace('{Q}', $q, $cshout_config['str_nofound']);
				echo '<e>'.htmlspecialchars($str_nofound, ENT_QUOTES).'</e>';
			}
		} else {
			echo '<e>'.htmlspecialchars($cshout_config['str_noquery'], ENT_QUOTES).'</e>';
		}
	}

	echo '<cshout><info islogged="'.($cshout_config['isAdmin']?1:0).'" pages="'.$pages.'" />'.$cshout_config['datafilewarning'];
	for ($count = $countmin; $count <= $countmax; $count++) {
		list($auth,$date,$time,$ipaddr,$shout) = explode(' | ', $shouts[$totalshouts-$count]);
		$shout = strip_tags($shout);
		$shout = stripslashes($shout);
		$shout = preg_replace($link_search, $link_replace, $shout);
		$shout = strtr($shout, $cshout_config['smileys']);
		$shout = htmlspecialchars($shout, ENT_QUOTES);
		echo '<s k="'.md5($shouts[$totalshouts-$count]).'" ip="'.$ipaddr.'" n="'.htmlspecialchars($auth, ENT_QUOTES).'" d="'.$date.'" t="'.$time.'">'.$shout.'</s>';
	}
	echo '</cshout>';
}