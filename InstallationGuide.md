# Step 0: Copyright #

```
******************************************************************************
  CShout licensing conditions
  (c) 2001-2006 Tien D. Tran (coolersport@yahoo.com)
******************************************************************************
  CShout shoutbox is free software under the terms of the GNU General Public
  License. See GPL.txt or http://www.gnu.org/copyleft/gpl.html
  for GNU/GPL license.
  
  Visit CShout home page at http://coolersport.info
******************************************************************************
```
The following text must be remained as it is wherever it appears
```
/******************************************************************************
 * <filename>
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
```

# Step 1: Uploading #

  * Upload all files into your web root folder and it should look like this:
```
      <html_root>/cshout/
      -- images/
      -- config.inc.php
      -- cshout.css
      -- cshout.packed.js
      -- cshout.php
      -- cshout.txt
      -- functions.inc.php
      -- index.php
```
  * The data file (cshout.txt) must be present in the cshout folder and has write permission set to everyone. Deselect read-only flag for this file on Windows server or run the following command on Linux (`<html_root>/cshout/` has to be the current directory):
```
      chmod 666 cshout.txt
```

# Step 2: Customisation #

  * Review and adjust config.inc.php and cshout.css
  * View index.php file for a quick sample

# Step 3: Testing #

  * Now open your site using a browser or open the shoutbox directly at `http://<your domain>/cshout/index.php` (make sure you have modified the code appropriately)

# Step 4: Thanks #

Hope you enjoy this shoutbox and thank you for supporting it. All suggestions and comments are very appreciated.

Cheers,
Tien D. Tran