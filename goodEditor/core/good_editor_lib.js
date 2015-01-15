/**
 * @ CopyRight (C) PJ-ROOM.COM. All Rights Reserved.
 * @brief  goodEditor Library
 **/

// page loading ... -> execute <script>...</script>
// Ajax Namespace
var ajax = {
	// Create Ajax Object
	create : function()
	{
		try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {} //IE5.5
		try { return new ActiveXObject("Msxml2.XMLHTTP");    } catch(e) {} //IE6
		try { return new ActiveXObject("Msxml2.XMLHTTP.3.0");} catch(e) {} //IE
		try { return new ActiveXObject("Msxml2.XMLHTTP.6.0");} catch(e) {} //IE
		try { return new XMLHttpRequest();                   } catch(e) {} //IE7, Firefox
		return false;
	},

	// ajax.get(string[, function[, function]]);
	//
	// url : GET url address
	//		 ex) index.html?get1=data1&get2=data2&get3=data3
	// playFunc : execute functions
	//			- [Skip] xmlhttp Object Variables
	// loadingFunc : execute functions
	//			- [Skip] xmlhttp Object Variables
	get : function(url, playFunc, loadingFunc)
	{
		var xmlhttp = this.create();
		var urlData = url.split('?');
		var sUrl = urlData[0];
		if (urlData[1] != null)
			var sData = '?' + urlData[1].split('&amp;').join('&');
		else
			var sData = '';

		var t = new Date();
		xmlhttp.open('GET', sUrl + encodeURI(sData) + '&cnt=' + t.getTime(), true);
		xmlhttp.setRequestHeader("Request-Ajax-Type", "good-editor/get");
		xmlhttp.send(null);

		// display loading...
		if (typeof loadingFunc != 'undefined')
			loadingFunc(xmlhttp);

		xmlhttp.onreadystatechange = function()
		{
			if(xmlhttp.readyState == '4')
			{
				if(xmlhttp.status == 200)
				{
					// xmlhttp.responseText
					if (typeof playFunc != 'undefined')
						playFunc(xmlhttp);
				}
			}
		};
	},

	// ajax.post(string[, function[, function]]);
	//
	// url : POST url address
	//		 ¿¹) index.html?get1=data1&get2=data2&get3=data3
	// playFunc : execute functions
	//			- [Skip] xmlhttp Object Variables
	// loadingFunc : execute functions
	//			- [Skip] xmlhttp Object Variables
	post : function(url, playFunc, loadingFunc)
	{
		var xmlhttp = this.create();
		var urlData = url.split('?');
		var sUrl = urlData[0];
		if (urlData[1] != null)
			var sData = urlData[1].split('&amp;').join('&');
		else
			var sData = '';

		xmlhttp.open('POST', sUrl, true);
		xmlhttp.setRequestHeader("Request-Ajax-Type", "good-editor/post");
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlhttp.send(encodeURI(sData));

		// show loading ...
		if (typeof loadingFunc != 'undefined')
			loadingFunc(xmlhttp);

		xmlhttp.onreadystatechange = function()
		{
			if(xmlhttp.readyState == '4')
			{
				if(xmlhttp.status == 200)
				{
					// xmlhttp.responseText
					if (typeof playFunc != 'undefined')
						playFunc(xmlhttp);
				}
			}
		};
	}
};

// change 16number = hexcode
var number = {
	h16 : function (r) {
		var ar = this.dec(r);
		var br = this.ced(r);

		if ( ar >= 16 ) {
			var n16f = this.h16(ar);
		} else {
			var n16f = this.hex(ar);
		}
		var rn16f = '';
			rn16f += n16f;
			rn16f += this.hex(br);

		return rn16f;
	},

	// div
	dec : function (v) {
		return Math.floor(v / 16);
	},

	// div -> etc...
	ced : function (v) {
		return (v % 16);
	},

	// if (0 <= x < 16) then change hexcode
	hex : function (v) {
		if ( v >= 16 ) {
			return v;
		} else {
			if ( v < 10 ) {
				return v;
			} else {
				switch (v) {
					case 10: return 'A'; break;
					case 11: return 'B'; break;
					case 12: return 'C'; break;
					case 13: return 'D'; break;
					case 14: return 'E'; break;
					case 15: return 'F'; break;
				}
			}
		}
	}
};

// default object NameSpace
//
// information! : `e` is default library
var e = {
	// IE?FF
	IE : (document.all)?1:0,

	// createElement
	$c : function(v){
		return document.createElement(v);
	},

	// getElementById - Style Option
	$s : function(v){
		if ( typeof(e.$g(v)) != 'undefined' )
		{
			return e.$g(v).style;
		}
		else
		{
			return false;
		}
	},

	// getElementById
	$g : function(v){
		return document.getElementById(v);
	},

	// getElementsByTagName
	$gTn : function(v){
		return document.getElementsByTagName(v);
	},

	// removeElement
	$d : function(v){
		var obj = e.$g(v);
		if ( obj )
		{
			obj.parentNode.removeChild(obj);
		}
	},

	getPxNumber : function(objId, styleType){
		var styleValue = null;
		if ( e.$g(objId) )
		{
			eval('styleValue = e.$g(\'' + objId + '\').style.' + styleType + '.replace(\'px\', \'\')');

			return new Number(styleValue);
		}
		else
		{
			return 0;
		}
	},

	getBounds : function(objId){
		var techbug = new Object();
		var tag = document.getElementById(objId);

		if(tag != null && tag != undefined)
		{
			var borderPX = 0;
			if ( document.getElementById(objId).style.border )
			{
				borderPX = new Number(document.getElementById(objId).style.border.replace(/#[a-zA-Z]* ([0-9]*)px solid/, '$1'));
			}

			if(tag.getBoundingClientRect)
			{
				//IE, FF3
				var rect = tag.getBoundingClientRect();
				techbug.left = rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft);
				techbug.top = rect.top + (document.documentElement.scrollTop || document.body.scrollTop);
				techbug.width = rect.right - rect.left;
				techbug.height = rect.bottom - rect.top + 1; // +1 = Moz
			}
			else if (document.getBoxObjectFor)
			{
				// gecko engine
				var box = document.getBoxObjectFor(tag);
				techbug.left = box.x;
				techbug.top = box.y;
				techbug.width = box.width;
				techbug.height = box.height;
			}
			else
			{
				techbug.left = tag.offsetLeft;
				techbug.top = tag.offsetTop + 1;
				techbug.width = tag.offsetWidth;
				techbug.height = tag.offsetHeight + 3; // +1 = Moz
				var parent = tag.offsetParent;
				if (parent != tag)
				{
					while (parent)
					{
						techbug.left += parent.offsetLeft;
						techbug.top += parent.offsetTop;
						parent = parent.offsetParent;
					}
				}

				var ua = navigator.userAgent.toLowerCase();
				if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && tag.style.position == 'absolute'))
				{
					techbug.top -= 1;
				}
			}

			techbug.width -= (borderPX * 2);
			techbug.height -= (borderPX * 2);

			return techbug;
		}
	},

	// No Selected, Drag, ContextMenu...
	noDrag : function(v){
		if (v == true){
			document.oncontextmenu	= new Function ("return false");
			document.ondragstart	= new Function ("return false");
			document.onselectstart	= new Function ("return false");
		}
	},

	// addEvent
	event : function (obj, type, fn){
		if(obj.addEventListener){
			obj.addEventListener(type, fn, false);
		}else if (obj.attachEvent){
			obj["e"+type+fn] = fn;
			obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
			obj.attachEvent("on"+type, obj[type+fn]);
		}
	}
};

// rgb to hex color code
function rgb(r, g, b) {
	var nxr = number.h16(r);
	var nxg = number.h16(g);
	var nxb = number.h16(b);

	return nxr + nxg + nxb;
}

// HSV -> RGB
function hsv2rgb(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;

	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));

	s = s / 100;
	v = v / 100;

	if ( s == 0 ) {
		r = g = b = v;
		return rgb(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
	} else {
		h = h / 60;
		i = Math.floor(h);
		f = h - i;
		p = v * (1 - s);
		q = v * (1 - s * f);
		t = v * (1 - s * (1 - f));

		switch(i) {
			case 0:
				return rgb(Math.round(v * 255), Math.round(t * 255), Math.round(p * 255));
			case 1:
				return rgb(Math.round(q * 255), Math.round(v * 255), Math.round(p * 255));
			case 2:
				return rgb(Math.round(p * 255), Math.round(v * 255), Math.round(t * 255));
			case 3:
				return rgb(Math.round(p * 255), Math.round(q * 255), Math.round(v * 255));
			case 4:
				return rgb(Math.round(t * 255), Math.round(p * 255), Math.round(v * 255));
			default:
				return rgb(Math.round(v * 255), Math.round(p * 255), Math.round(q * 255));
		}
	}
}

//-------------------------------------------------------------------------------
// selected sTapObj group
function sTap(sTapRows, sTapImageName){
	for(var i = 0; i < goodEditor.editor.createGroupObjRows; i++){
		if(i == sTapRows){
			e.$g('group_' + i).style.display = 'block';
		}else{
			e.$g('group_' + i).style.display = 'none';
		}
	}
	goodEditor.editor.cTapObject = sTapRows;
	goodEditor.editor.selectedTap(sTapRows, sTapImageName);

	// ToolObject Init
	goodEditor.editor.toolsObjectsInit();
	goodEditor.editor.setDesignMode();
}

// show tooltip
function tooltip(ToolTipTitleText, ToolTipText){
	e.$g(goodEditor.obj + '_stateBar').innerHTML = '<strong>' + ToolTipTitleText + '</strong> : ' + ToolTipText;
}

// hide tooltip
function tooltipHide(){
	e.$g(goodEditor.obj + '_stateBar').innerHTML = goodEditor.editor.config.stateText;
}
//-------------------------------------------------------------------------------

// searching tag -> all claName -> KB
function getKB(oj, tag, claName) {
	var kb = 0;
	var obj = oj.getElementsByTagName(tag);
	for (var i = 0; i < obj.length; i++) {
		if (obj[i].className == claName) {
			var v = obj[i].innerHTML;
			if (!v.replace(/([0-9\.]+)[\s]B/, '')) {
				// byte -> kb
				var b = Number(v.replace(/([0-9\.]+)[\s]B/, '$1'));
				var o = Math.round((b / 1024) * 10)/10;
			} else if (!v.replace(/([0-9\.]+)[\s]KB/, '')) {
				// kb -> kb
				var b = Number(v.replace(/([0-9\.]+)[\s]KB/, '$1'));
				var o = Math.round(b * 10)/10;
			} else if (!v.replace(/([0-9\.]+)[\s]MB/, '')) {
				// mb -> kb
				var b = Number(v.replace(/([0-9\.]+)[\s]MB/, '$1'));
				var o = Math.round((1024 * b) * 10)/10;
			}
			kb += o;
		}
	}
	return Math.round(kb * 10) / 10;
}

// kb
// @param	[number] (B/KB/MB)
function getMBtoKB(bytes)
{
	var v = bytes;
	if (!v.replace(/([0-9\.]+)[\s]B/, '')) {
		// byte -> kb
		var b = Number(v.replace(/([0-9\.]+)[\s]B/, '$1'));
		var o = Math.round((b / 1024) * 10)/10;
	} else if (!v.replace(/([0-9\.]+)[\s]KB/, '')) {
		// kb -> kb
		var b = Number(v.replace(/([0-9\.]+)[\s]KB/, '$1'));
		var o = Math.round(b * 10)/10;
	} else if (!v.replace(/([0-9\.]+)[\s]MB/, '')) {
		// mb -> kb
		var b = Number(v.replace(/([0-9\.]+)[\s]MB/, '$1'));
		var o = Math.round((1024 * b) * 10)/10;
	}
	return (Math.round(o * 10) / 10) + ' KB';
}

// open windows
function openWindow(path, w, h, toolbar, resizeable, locat, menubar, scrollbar) {
	toolbar = (toolbar == true)?'yes':'no';
	resizeable = (resizeable == true)?'yes':'no';
	locat = (locat == true)?'yes':'no';
	menubar = (menubar == true)?'yes':'no';
	scrollbar = (scrollbar == true)?'yes':'no';

	window.open(path, '', 'toolbar=' + toolbar + ', resizable=' + resizeable + ', location=' + locat + ', menubar=' + menubar + ', scrollbars=' + scrollbar + 
		', width=' + w + ', height=' + h);
}

String.prototype.trim = function()
{
	return this.replace(/^[\s\t]/, '').replace(/[\s\t]$/, '');
}

// Flash Action Class
function flash(obj){
	var self = this;
	var funObj = new Array();
	funObj['alpha']	= function() {  };

	var plyObj = new Array();
	plyObj['alpha']	= function() {  };

	var strObj = new Array();
	strObj['alpha']	= function() {  };

	this.obj = obj;
	// flash java library NameSpace
	this.alpha = {
		// count
		i		: 0,
		// default
		pas		: 0,
		obj		: null,
		time	: 0,
		stopAp	: false,
		// speed
		aSpeed	: 0,
		// now alpha
		nAlpha	: 0,
		// start alpha
		sAlpha	: 0,
		// middle alpha
		mAlpha	: new Array(),
		// end alpha
		eAlpha	: 0,
		delay	: 0,

		// Object Setting
		setSymbol : function(obj){
			this.obj = obj;
		},

		startFunction : function(fun){
			strObj['alpha']	= fun;
		},

		playFunction : function(fun){
			plyObj['alpha'] = fun;
		},

		endFunction : function(fun){
			funObj['alpha'] = fun;
		},

		setAlpha : function(alpha){
			e.$g(this.obj).style.filter = 'alpha(opacity='+alpha+')';
			e.$g(this.obj).style.opacity = (alpha / 100);
			e.$g(this.obj).style.MozOpacity = (alpha / 100);
		},

		getAlpha : function(_obj){
			var alpha = e.$g(_obj).style.opacity * 100;
			return alpha;
		},

		setTimer : function(time){
			this.time = time;
		},

		setDelay : function(time){
			this.delay = time;
		},

		speed : function(aSpeed){
			this.aSpeed = aSpeed;
		},

		start : function(sAlpha){
			this.obj = (this.obj == null)?self.obj:this.obj;
			this.nAlpha = sAlpha;
			this.sAlpha = sAlpha;
			this.setAlpha(sAlpha);
		},

		pass : function(mAlpha){
			this.mAlpha[this.pas] = mAlpha;
			this.pas++;
		},

		end : function(eAlpha){
			this.eAlpha = eAlpha;
		},

		run : function(){
			var self = this;
			if(this.obj != null){
				e.$g(this.obj).style.display = 'block';
				if(this.i == 0 && this.pas > 0){
					var sA = this.sAlpha;
					var eA = this.mAlpha[this.i];
					var nA = this.nAlpha;
				}else if(this.i == 0 && this.pas == 0){
					var sA = this.sAlpha;
					var eA = this.eAlpha;
					var nA = this.nAlpha;
				}else if(this.i == this.pas && this.pas > 0){
					var sA = this.mAlpha[this.i - 1];
					var eA = this.eAlpha;
					var nA = this.nAlpha;
				}else{
					var sA = this.mAlpha[this.i - 1];
					var eA = this.mAlpha[this.i];
					var nA = this.nAlpha;
				}

				if(sA < eA && nA < eA){
					this.nAlpha += this.aSpeed;
					this.stopAp = false;
				}else if(sA > eA && nA > eA){
					this.nAlpha -= this.aSpeed;
					this.stopAp = false;
				}else{
					this.stopAp = true;
				}

				this.setAlpha(this.nAlpha);

				if(this.stopAp == true && this.pas >= this.i){
					funObj['alpha']();
					this.i++;
				} else {
					plyObj['alpha']();
				}

				var pas	= this.pas;
				var i	= this.i;
				if (pas >= i) {
					setTimeout(function(){ self.run(); }, this.time);
				}
			}
		},

		play : function(){
			var self = this;
			setTimeout(function(){ strObj['alpha'](); self.run(); }, this.delay);
		}
	};

	this.run = function(){
		//self.move.play();
		self.alpha.play();
		//self.size.play();
	}
}
