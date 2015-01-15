// 글꼴 색상 설정 함수
process.prototype.color = {
	version : '1.1',
	// 모듈 활성화 여부
	active : true,
	init : function(sTapRows)
	{
		var thisobj = e.$g('fontColorDiv_' + sTapRows);
		if (thisobj != null)
		{
			thisobj.style.display = 'none';
		}
	},
	action : function(obj, sTapRows)
	{
		var obj_iframe = e.$g(goodEditor.obj + '_iframe');
			obj_iframe.focus();

		var sel = obj_iframe.contentWindow.document.selection;
		var rang = null;
		if (typeof sel != 'undefined') rang = sel.createRange();

		// 색상표
		var _w = 170;
		var _h = 170;
		if (!e.$g('fontColorDiv_' + sTapRows)) {
			var H = 1;
			var S = 0;
			var V = 0;
			var drag = false;
			var colorDiv = e.$c('div');
				colorDiv.id = 'fontColorDiv_' + sTapRows;
				colorDiv.className = 'colorPlug';
				colorDiv.style.position = 'absolute';
				colorDiv.style.width = 206 + 'px';
				colorDiv.style.height = 200 + 'px';
				colorDiv.innerHTML =	'<div id="fontColor_Area_' + sTapRows + '" style="margin:5px 0 0 5px; float:left; position:relative; width:' + _w + 'px; height:' + _h + 'px; background:#f00 url(' + obj.config.img_dir + '/nColorPlug.png) no-repeat;">' +
										'	<div id="fontColor_XY_' + sTapRows + '" style="position:absolute; width:11px; height:11px; top:' + (11 / 2 * -1) + 'px; left:' + (11 / 2 * -1) + 'px; background:url(' + obj.config.img_dir + '/select.gif) no-repeat;"></div>' +
										'</div>' +
										'<div id="fontColor_Box_' + sTapRows + '" style="margin:5px 0 0 0; float:left; width:19px; height:' + _h + 'px; overflow:hidden; margin-left:5px;"></div>' +
										'<div id="fontColor_' + sTapRows + '" style="margin:0 0 3px 5px; clear:both; padding-top:4px; text-align:center;">' +
										'	<div style="float:left; width:56px; height:11px; margin-right:3px; border:1px solid #777; padding:2px;">' +
										'		<div id="fontColor_' + sTapRows + '_view" style="width:100%; height:100%; background:#ffffff;"></div>' +
										'	</div>' +
										'	<input type="text" id="fontColor_' + sTapRows + '_text" value="#FFFFFF" style="float:left; width:66px; font-size:11px; font-family:verdana, arial, sans-serif; margin-right:3px;" />' +
										'	<input type="button" value="입력" style="float:left; width:31px; font-size:11px; font-family:돋움; border:1px solid #777; padding:0 2px 0 2px;" onclick="buttonEvent.setColor(e.$g(\'fontColor_' + sTapRows + '_text\').value); goodEditor.editor.toolsObjectsInit();" />' +
										'</div>';

				e.$g('insertObj_' + sTapRows).appendChild(colorDiv);

				//---------------------------------------------------------------------
				// Color (H:X, S:O, V:O)
				e.event(e.$g('fontColor_Area_' + sTapRows), 'mousedown', function(event){
					drag = true;
					obj_iframe.focus();

					sel = obj_iframe.contentWindow.document.selection;
					rang = sel.createRange();
				});
				e.event(e.$g('fontColor_Area_' + sTapRows), 'mousemove', function(event){
					if (drag == true) {
						var thisBounds = e.getBounds(this.id);
						S = ((thisBounds.left + e.$gTn('body')[0].scrollLeft) - event.clientX) * -1;
						V = ((thisBounds.top - e.$gTn('body')[0].scrollTop) - event.clientY) * -1;
						var cRGB = hsv2rgb(360 - H, Math.round(S / _w * 100), 100 - Math.round(V / _h * 100));

						e.$g('fontColor_' + sTapRows + '_view').style.background = '#' + cRGB;
						e.$g('fontColor_' + sTapRows + '_text').value = '#' + cRGB;
						if (V <= _h && S <= _w && V >= 0 && S >= 0) {
							e.$g('fontColor_XY_' + sTapRows).style.top = (V - 11 / 2) + 'px';
							e.$g('fontColor_XY_' + sTapRows).style.left = (S - 11 / 2) + 'px';
						}
						if (e.IE == 1) {
							rang.select();
						}
					}
				});
				e.event(e.$g('fontColor_Area_' + sTapRows), 'mouseup', function(event){
					drag = false;

					if (e.IE == 1) {
						rang.select();
					}
				});
				//---------------------------------------------------------------------
				// Color (H:O, S:X, V:X)
				var img_dir = obj.config.img_dir;
				e.event(e.$g('fontColor_Box_' + sTapRows), 'mousedown', function(event){
					drag = true;
					obj_iframe.focus();

					sel = obj_iframe.contentWindow.document.selection;
					rang = sel.createRange();
				});
				e.event(e.$g('fontColor_Box_' + sTapRows), 'mousemove', function(event){
					if (drag == true) {
						var thisBounds = e.getBounds(this.id);
						H = ((thisBounds.top - e.$gTn('body')[0].scrollTop) - event.clientY) * -2.2;

						var cRGB = hsv2rgb(360 - H, 100, 100);
						var c2RGB = hsv2rgb(360 - H, Math.round(S / _w * 100), 100 - Math.round(V / _h * 100));
						e.$g('fontColor_Area_' + sTapRows).style.background = '#' + cRGB + ' url(' + img_dir + '/nColorPlug.png) no-repeat';

						e.$g('fontColor_' + sTapRows + '_view').style.background = '#' + c2RGB;
						e.$g('fontColor_' + sTapRows + '_text').value = '#' + c2RGB;
						if (e.IE == 1) {
							rang.select();
						}
					}
				});
				e.event(e.$g('fontColor_Box_' + sTapRows), 'mouseup', function(){
					drag = false;

					if (e.IE == 1) {
						rang.select();
					}
				});
				//---------------------------------------------------------------------

				var innStr = '';
				var o = e.$g('fontColor_Box_' + sTapRows);
				for(var i = 360; i >= 0; i-=4.2) {
					innStr += '<div style="background:#' + hsv2rgb(i, 100, 100) + '; height:2px; font-size:1px;"></div>';
				}
				o.innerHTML = innStr;
		} else {
			if (e.$g('fontColorDiv_' + sTapRows).style.display == 'block') {
				e.$g('fontColorDiv_' + sTapRows).style.display = 'none';
			} else {
				e.$g('fontColorDiv_' + sTapRows).style.display = 'block';
			}
		}
	}
};

// 해당 기능을 담당하는 액션 함수
button.prototype.setColor = function(fontColor)
{
	var obj = e.$g(goodEditor.obj + '_iframe');
		obj.focus();
	if(e.IE == 1){
		var sel = obj.contentWindow.document.selection;
		var rang = sel.createRange();

		rang.select();
		if ( goodEditor.cPosition != null ) {
			// 선택한 영역에 대한 북마크로 이동
			rang.moveToBookmark(goodEditor.cPosition);
		}

		rang.execCommand('forecolor', false, fontColor);
		obj.contentWindow.focus();
	}else{
		obj.contentWindow.document.execCommand('forecolor', false, fontColor);
	}
}
