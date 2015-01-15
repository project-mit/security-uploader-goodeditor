// 문서 레이아웃 변경 함수
process.prototype.layout = {
	version : '0.1',
	// 모듈 활성화 여부
	active : true,
	init : function(sTapRows)
	{
		var thisobj = e.$g('layoutDiv_' + sTapRows);
		if (thisobj != null)
		{
			thisobj.style.display = 'none';
		}
	},
	action : function(obj, sTapRows)
	{
		if (!e.$g('layoutDiv_' + sTapRows)) {
			var layoutObj = e.$c('div');
				layoutObj.id = 'layoutDiv_' + sTapRows;
				layoutObj.className = 'colorPlug';
				layoutObj.style.position = 'absolute';
				layoutObj.style.width = 195 + 'px';
				layoutObj.style.height = 170+ 'px';
				layoutObj.style.display = 'block';
				layoutObj.style.overflow = 'hidden';
				layoutObj.innerHTML =	'<div class="layoutLink">' +
										'	<a href="javascript:void(0);" onclick="buttonEvent.setTemplate(1, \'layout\');">' +
										'		<table border="0" cellpadding="0" cellspacing="0" style="width:100%; font-size:1px;"><tr><td colspan="2" style="height:10px;"></td></tr><tr><td style="height:30px;"></td><td></td></tr><tr><td colspan="2" style="height:10px;"></td></tr></table>' +
										'		레이아웃 1' +
										'	</a>' +
										'</div>' +
										'<div class="layoutLink">' +
										'	<a href="javascript:void(0);" onclick="buttonEvent.setTemplate(2, \'layout\');">' +
										'		<table border="0" cellpadding="0" cellspacing="0" style="width:100%; font-size:1px;"><tr><td rowspan="2" style="height:52px;"></td><td></td></tr><tr><td></td></tr></table>' +
										'		레이아웃 2' +
										'	</a>' +
										'</div>' +
										'<div class="layoutLink">' +
										'	<a href="javascript:void(0);" onclick="buttonEvent.setTemplate(3, \'layout\');">' +
										'		<table border="0" cellpadding="0" cellspacing="0" style="width:100%; font-size:1px;"><tr><td colspan="3" style="height:10px;"></td></tr><tr><td style="height:30px;"></td><td></td><td></td></tr><tr><td colspan="3" style="height:10px;"></td></tr></table>' +
										'		레이아웃 3' +
										'	</a>' +
										'</div>' +
										'<div class="layoutLink">' +
										'	<a href="javascript:void(0);" onclick="buttonEvent.setTemplate(4, \'layout\');">' +
										'		<table border="0" cellpadding="0" cellspacing="0" style="width:100%; font-size:1px;"><tr><td style="height:52px;"></td><td></td></tr></table>' +
										'		레이아웃 4' +
										'	</a>' +
										'</div>' +
										'<div class="layoutLink">' +
										'	<a href="javascript:void(0);" onclick="buttonEvent.setTemplate(5, \'layout\');">' +
										'		<table border="0" cellpadding="0" cellspacing="0" style="width:100%; font-size:1px;"><tr><td style="height:52px;"></td><td></td><td></td></tr></table>' +
										'		레이아웃 5' +
										'	</a>' +
										'</div>' +
										'<div class="layoutLink">' +
										'	<a href="javascript:void(0);" onclick="buttonEvent.setTemplate(6, \'layout\');">' +
										'		<table border="0" cellpadding="0" cellspacing="0" style="width:100%; font-size:1px;"><tr><td rowspan="3" style="height:52px;"></td><td></td></tr><tr><td></td></tr><tr><td></td></tr></table>' +
										'		레이아웃 6' +
										'	</a>' +
										'</div>';

			e.$g('insertObj_' + sTapRows).appendChild(layoutObj);
		} else {
			if (e.$g('layoutDiv_' + sTapRows).style.display == 'none') {
				e.$g('layoutDiv_' + sTapRows).style.display = 'block';
			} else {
				e.$g('layoutDiv_' + sTapRows).style.display = 'none';
			}
		}
	}
};

// 해당 기능을 담당하는 액션 함수
button.prototype.setTemplate = function(num, type)
{
	var obj = e.$g(goodEditor.obj + '_iframe');

	ajax.get(goodEditor.editor.config.template_dir + '/' + type + '/template' + num + '.html', function(x){
		var v = x.responseText;

		obj.contentWindow.document.open();
		obj.contentWindow.document.write(v);
		obj.contentWindow.document.close();

		goodEditor.editor.setDesignMode();
		goodEditor.editor.toolbarTextareaSave(goodEditor.obj);

		v = null;
	});
	goodEditor.editor.toolsObjectsInit();
}
