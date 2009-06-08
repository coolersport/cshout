/*******************************************************************************
 * ajaxcs.js
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

ajaxCS = function() {
   this.id = ajaxCS.ajaxObjects.length;
   this.httpObj = this.createHttpRequestObject();
   this.cache = new Array();
   this.isProcessing = false;
   this.waitfor = 50;
   this.statusId = '';
   this.statusLoad = '';
   this.statusFinish = '';
};

ajaxCS.httpObjVersion = '';
/*
 * Create an instance of XMLHttpRequest based on client browser type
 */
ajaxCS.prototype.createHttpRequestObject = function() {
   var httpObj;
   try {
      httpObj = new XMLHttpRequest();
   } catch(e) {
      if (ajaxCS.httpObjVersion!='') {
         try {
            httpObj = new ActiveXObject(ajaxCS.httpObjVersion);
         } catch (e) {}
      } else {
         var XmlHttpVersions = new Array('MSXML2.XMLHTTP.6.0','MSXML2.XMLHTTP.5.0','MSXML2.XMLHTTP.4.0','MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP','Microsoft.XMLHTTP','MSXML2.XMLHTTP');
         for (var i=0; i<XmlHttpVersions.length && !httpObj; i++) {
            try {
               httpObj = new ActiveXObject(XmlHttpVersions[i]);
               ajaxCS.httpObjVersion = XmlHttpVersions[i];
            } catch (e) {}
         }
      }
   }
   if (!httpObj)
      alert("Error creating the XMLHttpRequest object. Your browser may not support this application.");
   else
      return httpObj;
};

/*
 * Wrapper to make AJAX requests
 * DO NOT call directly
 */
ajaxCS.prototype.CDownloadUrl = function() {
   if (this.cache.length<4) {
      this.isProcessing = false;
      return;
   } else {
      this.isProcessing = true;
   }
   if (this.httpObj) {
      this.httpObj.abort();
   } else {
      return;
   }
   var method = this.cache.shift().toUpperCase();
   var url = this.cache.shift();
   var parameters = this.cache.shift();
   var func = this.cache.shift();
   var _this = this;
   if (this.statusId) {
      try {
         document.getElementById(this.statusId).innerHTML = this.statusLoad;
      } catch(e) {}
   }
   this.httpObj.onreadystatechange = function() {
      if(_this.httpObj.readyState == 4){
         if (_this.httpObj.status == 200) {
            try {
               var contenttype = _this.httpObj.getResponseHeader('Content-Type');
               if (contenttype.indexOf('xml')>-1) {
                  func(_this.httpObj.responseXML);
               } else {
                  func(_this.httpObj.responseText);
               }
            } catch(e) {
               alert('Error retrieving response data.\nMethod: '+method+'\nURL: '+url+'\nError message: ' + e.message);
            }
         } else {
            try {
               func('Error: '+_this.httpObj.status);
            } catch(e) {
               alert('Bad handler function.\nMethod: '+method+'\nURL: '+url+'\nError message: ' + e.message);
            }
         }
         if (_this.cache.length<4) {
            _this.isProcessing = false;
            if (_this.statusId) {
               try {
                  document.getElementById(_this.statusId).innerHTML = _this.statusFinish;
               } catch(e) {}
            }
         } else {
            _this.isProcessing = true;
            setTimeout('ajaxCS.ajaxObjects['+_this.id+'].CDownloadUrl()', _this.waitfor);
         }
      }
   };
   try {
      this.httpObj.open(method, url, true);
      if (parameters!=null) {
         this.httpObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
         this.httpObj.setRequestHeader("Content-length", parameters.length);
         this.httpObj.setRequestHeader("Connection", "close");
         this.httpObj.send(parameters);
      } else {
         this.httpObj.send('');
      }
   } catch(e) {
      alert('Error connecting to server: ' + e.message);
   }
};

/*
 * AJAX requests queue
 */
ajaxCS.prototype.load = function(method, url, parameters, func) {
   this.cache.push(method, url, parameters, func);
   if (!this.isProcessing) this.CDownloadUrl();
};

/*
 * Set waiting time between ajax calls
 */
ajaxCS.prototype.setWait = function(waitfor) {
   this.waitfor = waitfor;
};

/*
 * Set loading status
 */
ajaxCS.prototype.setStatus = function(statusId, statusLoad, statusFinish) {
   this.statusId = statusId;
   this.statusLoad = statusLoad;
   this.statusFinish = statusFinish;
};

/*
 * ajaxCS objects collection
 */
ajaxCS.ajaxObjects = new Array();

ajaxCS.createInstance = function() {
   var c = new ajaxCS();
   ajaxCS.ajaxObjects.push(c);
   return c;
};

/*
 * Usage: ajaxcs = ajaxCS.createInstance();
 *        ajaxcs.load( method, url, parameters, function(xmldoc) {});
 */

String.prototype.escape = function() {
   return escape(this).replace(/\+/g,'%2B');
};

String.prototype.htmlquote = function() {
   return this.replace(/\'/g,'&#39;').replace(/\"/g,'&#34;');
};

String.prototype.unquote = function() {
   return this.replace(/\'/g,'\\u0027').replace(/\"/g,'\\u0022');
};

String.prototype.unhtml = function() {
   return this.replace(/</g,'&lt;').replace(/>/g,'&gt;');
};

String.prototype.trim = function() {
   return this.replace(/^\s*|\s*$/g, '');
};

