<?php
/******************************************************************************
 * cshout.php
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

session_start();

require_once('config.inc.php');
require_once('functions.inc.php');

cshout_process_login();

cshout_return_smileys();
cshout_check_datafile();
cshout_save_shout();

cshout_main();