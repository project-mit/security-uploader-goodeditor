// 글꼴 기울기 설정 함수
process.prototype.Italic = {
	version : '0.1',
	// 모듈 활성화 여부
	active : true,
	action : function(obj, sTapRows)
	{
		e.$g(goodEditor.obj + '_iframe').contentWindow.document.execCommand('italic', false, null);
	}
};
