// 글꼴 들여쓰기 함수
process.prototype['in'] = {
	version : '0.1',
	// 모듈 활성화 여부
	active : true,
	action : function(obj, sTapRows)
	{
		e.$g(goodEditor.obj + '_iframe').contentWindow.document.execCommand('Indent', false, null);
	}
};
