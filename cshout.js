/*******************************************************************************
 * cshout.js
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

function CShout() {
	/********************** CONFIGURATIONS **********************/
	this.script_url = '/cshout/cshout.php';
	this.username = '';
	this.width = '100%';
	this.height = '400px';
	this.layout = '{controls}<div style="height:300px;overflow:scroll">{shouts}</div>';
	this.layout_controls = '<div class="cs_formarea"><div>{name}</div><div>{message}</div>{shout}{help}<br/>{show_smileys}{show_search}{show_login}{show_pages}{show_navigator}</div>{panel_smileys}{panel_search}{panel_login}{panel_pages}{panel_help}';
	this.placeholder = 'cshout3';
	this.order = 'topdown';
	this.shouterlength = 12;
	this.adminColor = [ '#415274', '#AA0000' ];
	this.buttonColor = [ '#415274', '#808080' ];
	/** ***************** END OF CONFIGURATIONS ****************** */

	/** ******** DO NOT MODIFY THE CODE BELOW THIS LINE ********** */
	/** **************** UNLESS YOU UNDERSTAND IT **************** */
	this.cache = new Array();
	this.instance = 0;
	this.isProcessing = false;
	this.page = 1;
	this.pages = 1;
	this.smileys = null;
	this.ajaxcs = ajaxCS.createInstance();
	this.ef = {
		value : '',
		disabled : '',
		innerHTML : '',
		focus : function() {
		},
		style : {
			display : '',
			color : ''
		},
		parentNode : {
			scrollTop : 0
		}
	};
	this.dump = {
		value : ''
	};
};

/*
 * Show shoutbox form entry
 */
CShout.prototype.setup = function() {
	var html = this.layout.replace('{controls}', this.layout_controls);
	html = html
			.replace('{shouts}', '<div id="cs_shouts" class="shouts"></div>');
	var txt = '<input type="text" id="cs_name" size="16" value="Name" maxlength="64" title="Name" class="cs_inputs">';
	if (this.username.trim().length > 0)
		txt = '<input type="text" id="cs_name" size="16" value="' + this.username + '" maxlength="64" title="Name" class="cs_inputs" style="display:none">';
	html = html.replace('{name}', txt);
	txt = '<input type="text" id="cs_shout" size="16" value="Message" maxlength="1024" title="Message" class="cs_inputs">';
	html = html.replace('{message}', txt);
	txt = '<input type="button" id="cs_shoutit" title="Send message" value=".: Send :." class="cs_buttons">';
	html = html.replace('{shout}', txt);
	txt = '<input type="button" id="cs_help" title="Help" value="?" class="cs_buttons">';
	html = html.replace('{help}', txt);
	txt = '<input type="button" id="cs_show_smileys" title="Show smileys panel" value=":)" class="cs_buttons">';
	html = html.replace('{show_smileys}', txt);
	txt = '<input type="button" id="cs_show_search" title="Show search entry" value="S" class="cs_buttons">';
	html = html.replace('{show_search}', txt);
	txt = '<input type="button" id="cs_show_login" title="Show administration login form" value="@" class="cs_buttons">';
	html = html.replace('{show_login}', txt);
	txt = '<input type="button" id="cs_show_pages" title="Show pages navigation" value="P" class="cs_buttons">';
	html = html.replace('{show_pages}', txt);
	txt = '<input type="button" id="cs_prev_page" title="Previous page" value="&lsaquo;" class="cs_buttons">';
	txt += '<span id="cs_pageno">1</span>';
	txt += '<input type="button" id="cs_next_page" title="Next page" value="&rsaquo;" class="cs_buttons">';
	html = html.replace('{show_navigator}', txt);

	txt = '<div id="cs_smileylist" class="cs_panel"></div>';
	html = html.replace('{panel_smileys}', txt);
	txt = '<div id="cs_searchquery" class="cs_panel"><input type="text" id="q" name="q" size="16" class="cs_inputs" value="Search for..." maxlength="1024" title="Search for..." class="SB_input" onkeydown="if(event.keyCode==13) cshout.searchIt();" onfocus="if(this.value==\'Search for...\') this.value=\'\';" onblur="if(this.value==\'\') this.value=\'Search for...\';"></div>';

	html = html.replace('{panel_search}', txt);
	txt = '<div id="cs_loginform" class="cs_panel">';
	txt += '<input type="text" id="u" name="u" size="3" value="name" title="Username" class="cs_inputs" onfocus="if(this.value==\'name\') this.value=\'\';" onblur="if(this.value==\'\') this.value=\'name\';">';
	txt += '<input type="password" id="p" name="p" size="3" value="pass" title="Password" class="cs_inputs" onfocus="if(this.value==\'pass\') this.value=\'\';" onblur="if(this.value==\'\') this.value=\'pass\';" onkeydown="if(event.keyCode==13) cshout.doLogin();">';
	txt += '<input type="button" id="cs_login" name="login" title="Login" value="OK" class="cs_buttons">';
	txt += '<input type="button" id="cs_logout" name="logout" title="Logout" value="Logout" class="cs_buttons" style="display:none">';
	txt += '</div>';

	html = html.replace('{panel_login}', txt);
	txt = '<div id="cs_pagenav" style="display:none;"></div>';
	html = html.replace('{panel_pages}', txt);
	txt = '<div id="cs_helppanel" class="cs_panel" style="text-align:left;">';
	txt += '<div id="cs_helpcaption">Make a shout</div>';
	txt += '<div id="cs_helptext">Enter your name in the first text box and your message in the second one then click <b style="white-space:nowrap">.: Send :.</b> button.</div>';
	txt += '<div id="cs_helpcaption">Insert emoticons</div>';
	txt += '<div id="cs_helptext">Place the cursor in the second text box where you want to insert an emoticon then click <b>:)</b> button and click on appropriate icon.</div>';
	txt += '<div id="cs_helpcaption">Search old messages</div>';
	txt += '<div id="cs_helptext">Click <b>S</b> button and enter your search query. You can search by date, time, shouter, message or even ip address.</div>';
	txt += '<div id="cs_helpcaption">Page navigation</div>';
	txt += '<div id="cs_helptext">Use <b>&lsaquo;</b> or <b>&rsaquo;</b> buttons to move to previous or next page respectively. Or click <b>P</b> button to jump to any page.</div>';
	txt += '</div>';
	html = html.replace('{panel_help}', txt);
	return html;
};

CShout.prototype.setupEvents = function() {
	var comp = document.getElementById('cs_name');
	if (comp) {
		comp.onkeydown = function(event) {
			if (event.keyCode == 13)
				this.getElement('cs_shout').focus();
		};
		comp.onfocus = function() {
			if (this.value == 'Name')
				this.value = '';
		};
		comp.onblur = function() {
			if (this.value == '')
				this.value = 'Name';
		};
	}
	comp = document.getElementById('cs_shout');
	if (comp) {
		comp.onkeydown = function(event) {
			if (event.keyCode == 13)
				cshout.shoutIt();
		};
		comp.onfocus = function() {
			if (this.value == 'Message')
				this.value = '';
		};
		comp.onblur = function() {
			if (this.value == '')
				this.value = 'Message';
		};
	}
	comp = document.getElementById('cs_shoutit');
	if (comp) {
		comp.onclick = function() {
			cshout.shoutIt()
		};
	}
	comp = document.getElementById('cs_help');
	if (comp) {
		comp.onclick = function() {
			cshout.showPanel('cs_helppanel');
		};
	}
	comp = document.getElementById('cs_show_smileys');
	if (comp) {
		comp.onclick = function() {
			cshout.showPanel('cs_smileylist');
		};
	}
	comp = document.getElementById('cs_show_search');
	if (comp) {
		comp.onclick = function() {
			cshout.showPanel('cs_searchquery');
		};
	}
	comp = document.getElementById('cs_show_login');
	if (comp) {
		comp.onclick = function() {
			cshout.showPanel('cs_loginform');
		};
	}
	comp = document.getElementById('cs_show_pages');
	if (comp) {
		comp.onclick = function() {
			cshout.showPanel('cs_pagenav');
		};
	}
	comp = document.getElementById('cs_prev_page');
	if (comp) {
		comp.onclick = function() {
			cshout.getPageContent('prev');
		};
	}
	comp = document.getElementById('cs_next_page');
	if (comp) {
		comp.onclick = function() {
			cshout.getPageContent('next');
		};
	}
	comp = document.getElementById('cs_login');
	if (comp) {
		comp.onclick = function() {
			cshout.doLogin()
		};
	}
	comp = document.getElementById('cs_logout');
	if (comp) {
		comp.onclick = function() {
			cshout.doLogout()
		};
	}
};

/*
 * Toggle panels
 */
CShout.prototype.showPanel = function(id) {
	if (this.getElement(id).style.display == 'block') {
		this.getElement(id).style.display = 'none';
	} else {
		this.getElement('cs_smileylist').style.display = 'none';
		this.getElement('cs_searchquery').style.display = 'none';
		this.getElement('cs_loginform').style.display = 'none';
		this.getElement('cs_pagenav').style.display = 'none';
		this.getElement('cs_helppanel').style.display = 'none';
		this.getElement(id).style.display = 'block';
	}
};

/*
 * Toggle login form's elements
 */
CShout.prototype.showLogin = function(isLogged) {
	var isIn = 'none', isOut = 'none';
	if (isLogged == 1)
		isOut = 'inline';
	else
		isIn = 'inline';
	this.getElement("u").style.display = isIn;
	this.getElement("p").style.display = isIn;
	this.getElement("cs_login").style.display = isIn;
	this.getElement("cs_logout").style.display = isOut;
};

/*
 * Show the shoutbox on the page
 */
CShout.prototype.show = function() {
	if (this.instance > 0)
		return;
	var cshout_ph = this.getElement(this.placeholder);
	if (this.ajaxcs.httpObj) {
		cshout_ph.innerHTML = this.setup();
		this.getSmileys();
		this.getPageContent(1);
		this.setupEvents();
		this.instance++;
	} else {
		cshout_ph.innerHTML = 'Your browser doesn\t support Ajax';
	}
};

/*
 * Update page navigation panel
 */
CShout.prototype.updatePages = function() {
	var str = '';
	for ( var i = 1; i < this.pages + 1; i++) {
		if (i == this.page)
			str += '<span>' + i + '</span> ';
		else
			str += '<a href="" onclick="cshout.getPageContent(' + i
					+ ');return(false);">' + i + '</a> ';
	}
	this.getElement('cs_pagenav').innerHTML = str;
};

/*
 * Check for valid number
 */
CShout.prototype.isNumeric = function(val) {
	var numChars = "0123456789";
	var retVal = true;
	if (val == "") {
		return false;
	}
	for (i = 0; i < val.length && retVal == true; i++) {
		if (numChars.indexOf(val.charAt(i)) < 0) {
			retVal = false;
		}
	}
	return retVal;
};

/*
 * Show loading progress
 */
CShout.prototype.showProgress = function(status) {
	var disableit = false;
	var cs_shoutit = document.getElementById('cs_shoutit');
	if (!cs_shoutit)
		return;
	if (status) {
		cs_shoutit.value = status;
		cs_shoutit.style.color = this.buttonColor[1];
		disableit = true;
	} else {
		cs_shoutit.value = '.: Send :.';
		cs_shoutit.style.color = this.buttonColor[0];
	}
	ids = [ 'cs_shoutit', 'cs_show_smileys', 'cs_show_search', 'cs_show_login',
			'cs_show_pages', 'cs_prev_page', 'cs_next_page' ];
	for (i = 0; i < ids.length; i++) {
		this.getElement(ids[i]).disabled = disableit;
	}
};

/*
 * Load a page from the server
 */
CShout.prototype.getPageContent = function(p) {
	if (this.isNumeric(p)) {
		this.page = p;
	} else if (p == 'prev') {
		this.page--;
	} else {
		this.page++;
	}
	if (this.page < 1) {
		this.page = 1;
	} else if (this.page > this.pages) {
		this.page = this.pages;
	}
	this.showProgress('Loading...');
	this.ajaxcs.load('get', this.script_url + '?page=' + this.page, null,
			this.handleContent);
};

/*
 * Process data loaded from the server
 */
CShout.prototype.handleContent = function(xmldoc) {
	if (!xmldoc || !xmldoc.documentElement) return;
	try {
		var ferror = xmldoc.documentElement.getElementsByTagName('fe'); // fatal
		// error
		if (ferror.length == 0) {
			var error = xmldoc.documentElement.getElementsByTagName('e');
			var shouts = xmldoc.documentElement.getElementsByTagName('s');
			var info = xmldoc.documentElement.getElementsByTagName('info')[0];
			var isadmin = (info.getAttribute('islogged') == '1') ? true : false;
			var buttons = '';
			var rowidx = 0;
			var html = '';

			for (i = 0; i < error.length; i++) {
				html += '<div id="cs_error">' + error[i].childNodes[0].nodeValue + '</div>';
			}
			cshout.getElement('cs_show_login').style.color = cshout.adminColor[parseInt(info
					.getAttribute('islogged'))];
			cshout.showLogin(parseInt(info.getAttribute('islogged')));
			cshout.pages = parseInt(info.getAttribute('pages'));
			cshout.getElement('cs_pageno').innerHTML = cshout.page;
			(document.getElementById('cs_shout') || this.dump).value = 'Message';
			for (i = 0; i < shouts.length; i++) {
				k = shouts[i].getAttribute('k');
				n = shouts[i].getAttribute('n');
				d = shouts[i].getAttribute('d');
				t = shouts[i].getAttribute('t');
				ip = shouts[i].getAttribute('ip');
				s = shouts[i].childNodes[0].nodeValue;
				if (isadmin)
					buttons = '<a class="cs_delete" href="" onclick="cshout.deleteIt(\''
							+ k
							+ '\');return(false);" title="Delete this shout">x</a><a class="cs_delete" href="" onclick="cshout.checkIP(\''
							+ ip
							+ '\');return(false);" title="Check ip location">ip</a>';
				if (n.length > cshout.shouterlength)
					html += '<div class="cs_shouter" title="' + n + '">'
							+ buttons
							+ n.substring(0, cshout.shouterlength - 3)
							+ '&hellip;';
				else
					html += '<div class="cs_shouter">' + buttons + n;
				html += '<a href="#" onclick="alert(\'Shouter: ' + n.unquote()
						+ '\\nWhen: ' + t + ' ' + d + '\\nFrom IP: ' + ip
						+ '\');return(false)">on ' + d.substring(0, 5) + ' at '
						+ t.substring(0, 5) + '</a></div>';
				html += '<div class="cs_row' + rowidx + '" title="' + t + ' '
						+ d + ' ' + ip + '">' + s + '</div>';
				rowidx = (rowidx == 0) ? 1 : 0;
			}
			var shouts_div = cshout.getElement('cs_shouts');
			shouts_div.innerHTML = html;
			if (cshout.order == 'topdown')
				shouts_div.parentNode.scrollTop = 0;
			else
				shouts_div.parentNode.scrollTop = 99999;
			cshout.updatePages();
		} else {
			alert(ferror[0].childNodes[0].nodeValue);
		}
		cshout.showProgress();
	} catch (e) {
		alert('Error occurred while processing data.\nError message:\n'
				+ e.message + '\n' + xmldoc);
	}
};

/*
 * Get and print smileys panel
 */
CShout.prototype.getSmileys = function() {
	this.getElement('cs_smileylist').innerHTML = '<div style="text-align:center;margin-top:10px;">Loading smileys...</div>';
	this.ajaxcs
			.load(
					'get',
					this.script_url + '?act=smileys',
					null,
					function(xmldoc) {
						try {
							if (!xmldoc || !xmldoc.documentElement)
								return;
							var xmlsmileys = xmldoc.documentElement
									.getElementsByTagName('sm');
							var html = '';
							cshout.smileys = new Array();
							for (i = 0; i < xmlsmileys.length; i++) {
								src = xmlsmileys[i].getAttribute('s');
								text = xmlsmileys[i].getAttribute('t').replace(
										/\'/, '\\u0027').replace(/\"/,
										'\\u0022');
								if (src) {
									str = '<div title="'
											+ text
											+ '" class="cs_smiley" style="background-image:url('
											+ src
											+ ');" onclick="cshout.addSmiley(\''
											+ text + '\');"></div>';
								} else {
									str = '<span title="' + text
											+ '" onclick="cshout.addSmiley(\''
											+ text + '\');">' + text
											+ '</span> ';
								}
								html += str;
								cshout.smileys.push(new Array(text, str));
							}
							cshout.getElement('cs_smileylist').innerHTML = '<div><table align="center" border="0"><tr><td>' + html + '</td></tr></table></div>';
						} catch (e) {
							alert('Error occurred while getting smileys.\nError message:\n'
									+ e.message + '\n' + xmldoc);
						}
					});
};

/*
 * Submit a shout
 */
CShout.prototype.shoutIt = function() {
	cshout.showProgress('Shouting...');
	this.ajaxcs.load('get', this.script_url + '?act=shout&name='
			+ Escape(this.getElement('cs_name').value) + '&shout='
			+ Escape(this.getElement('cs_shout').value), null,
			this.handleContent);
};

/*
 * Perform a search
 */
CShout.prototype.searchIt = function() {
	this.showProgress('Searching...');
	this.ajaxcs.load('get', this.script_url + '?act=search&q='
			+ Escape(this.getElement('q').value), null, this.handleContent);
};

/*
 * Login procedure
 */
CShout.prototype.doLogin = function() {
	this.showProgress('Logging in...');
	this.ajaxcs
			.load(
					'post',
					this.script_url,
					'act=login&u=' + hex_sha1(this.getElement('u').value)
							+ '&p=' + hex_sha1(this.getElement('p').value),
					function(xmldoc) {
						cshout.getElement('p').value = 'pass';
						var ferror = xmldoc.documentElement
								.getElementsByTagName('fe'); // fatal error
						if (ferror.length > 0) {
							if (ferror[0].childNodes[0].nodeValue == 'ok') {
								cshout.getPageContent(cshout.page);
								cshout.getElement('cs_show_login').style.color = cshout.adminColor[0];
								cshout.showPanel('cs_loginform');
							} else {
								alert(ferror[0].childNodes[0].nodeValue);
							}
						} else {
							alert('Unexpected error.');
						}
						cshout.showProgress();
					});
};

/*
 * Logout procedure
 */
CShout.prototype.doLogout = function() {
	this.showProgress('Logging out...');
	this.ajaxcs
			.load(
					'post',
					this.script_url,
					'act=logout',
					function(xmldoc) {
						var ferror = xmldoc.documentElement
								.getElementsByTagName('fe'); // fatal error
						if (ferror.length > 0) {
							if (ferror[0].childNodes[0].nodeValue == 'ok') {
								cshout.getPageContent(cshout.page);
								cshout.getElement('cs_show_login').style.color = cshout.adminColor[1];
								cshout.showPanel('cs_loginform');
							} else {
								alert(ferror[0].childNodes[0].nodeValue);
							}
						} else {
							alert('Unexpected error.');
						}
						cshout.showProgress();
					});
};

/*
 * Delete a shout
 */
CShout.prototype.deleteIt = function(k) {
	this.showProgress('Deleting...');
	this.ajaxcs.load('get', this.script_url + '?act=del&k=' + k, null,
			function(data) {
				cshout.getPageContent(cshout.page);
				cshout.showProgress();
			});
};

/*
 * Check location of an ip address
 */
CShout.prototype.checkIP = function(ip) {
	window
			.open('http://www.geobytes.com/IpLocator.htm?GetLocation&ipaddress=' + ip);
};

/*
 * Add a smiley into current message
 */
CShout.prototype.addSmiley = function(s) {
	if (this.getElement('cs_shout').value == 'Message')
		(document.getElementById('cs_shout') || this.dump).value = s;
	else
		(document.getElementById('cs_shout') || this.dump).value += s;
};

/*
 * get dom object
 */
CShout.prototype.getElement = function(id) {
	return document.getElementById(id) || this.ef;
};

/*
 * Escape a string before submitting
 */
function Escape(s) {
	return escape(s).replace(/\+/, '%2B');
};

/*
 * Singleton instance
 */
cshout = new CShout();
