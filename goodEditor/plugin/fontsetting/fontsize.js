// 글꼴 크기제어 함수
process.prototype.fontsize = {
	version : '0.2',
	// 모듈 활성화 여부
	active : true,
	// fontFamily List
	fontSizeArray	: [7, 8, 9, 10, 11, 12, 15, 20, 25, 38],
	// fontSize 단위
	fontSizeWords	: 'pt',
	init : function(sTapRows)
	{
		var thisobj = e.$g('fontSizeDiv_' + sTapRows);
		if (thisobj != null)
		{
			thisobj.style.display = 'none';
		}
	},
	action : function(obj, sTapRows)
	{
		if(!e.$g('fontSizeDiv_' + sTapRows)){
			// 글꼴 크기 선택 상자
			var fontSizeDiv = e.$c('div');
				fontSizeDiv.id = 'fontSizeDiv_' + sTapRows;
				fontSizeDiv.style.clear = 'both';
				fontSizeDiv.style.top = 30 + 'px';
				fontSizeDiv.style.left = 65 + 'px';
				fontSizeDiv.style.position = 'absolute';
				fontSizeDiv.style.border = '1px solid #ddd';
				fontSizeDiv.style.background = '#fff';
				fontSizeDiv.style.width = 80 + 'px';
				//fontSizeDiv.style.height = 130 + 'px';
				//fontSizeDiv.style.overflow = 'auto';
				fontSizeDiv.style.fontSize = 11 + 'px';
				fontSizeDiv.style.fontFamily = '돋움';
				fontSizeDiv.style.display = 'block';
				for(var i=0; i < this.fontSizeArray.length; i++){
					fontSizeDiv.innerHTML +=	'<div style="cursor:default; margin:1px;" '+
												'onmouseover="this.style.background=\'#eee\';this.style.color=\'#555\';" '+
												'onmouseout="this.style.background=\'\';this.style.color=\'#000\';">'+
												'	<a href="javascript:void(0);" style="display:block; padding:3px;" onclick="buttonEvent.setSize(\''+this.fontSizeArray[i]+'\');">'+
												this.fontSizeArray[i] + this.fontSizeWords +
												'	</a>'+
												'</div>';
				}
				e.$g('insertObj_' + sTapRows).appendChild(fontSizeDiv);
			e.$g('fontSizeDiv_' + sTapRows).focus();
			e.event(e.$g('fontSizeDiv_' + sTapRows), "click", function(){ e.$g('fontSizeDiv_' + sTapRows).style.display = 'none'; });
		}else if(e.$g('fontSizeDiv_' + sTapRows).style.display == 'block'){
			e.$g('fontSizeDiv_' + sTapRows).style.display = 'none';
		}else{
			e.$g('fontSizeDiv_' + sTapRows).style.display = 'block';
			e.$g('fontSizeDiv_' + sTapRows).focus();
		}
	}
};

// 해당 기능을 담당하는 액션 함수
button.prototype.setSize = function(fontSize)
{
	if(e.IE == 1){
		var sel = e.$g(goodEditor.obj + '_iframe').contentWindow.document.selection;
		var rang = sel.createRange();
		var selected = '<span style="font-size:' + fontSize + controller.fontsize.fontSizeWords + '">' + rang.text + '</span>';

		rang.select();
		if ( goodEditor.cPosition != null ) {
			// 선택한 영역에 대한 북마크로 이동
			rang.moveToBookmark(goodEditor.cPosition);
		}

		rang.pasteHTML(selected);
	}else{
		var rang = new Object();
		var obj = e.$g(goodEditor.obj + '_iframe').contentWindow;
		var sel = obj.getSelection();
		if (sel.rangeCount > 0 && obj.XMLSerializer){
			sel = sel.getRangeAt(0);
			rang.text = new XMLSerializer().serializeToString(sel.cloneContents());
		}
		var selected = '<span style="font-size:' + fontSize + goodEditor.editor.config.fontSizeWords + '">' + rang.text + '</span>';

		e.$g(goodEditor.obj + '_iframe').contentWindow.document.execCommand('InsertHTML', false, selected);
	}
}
