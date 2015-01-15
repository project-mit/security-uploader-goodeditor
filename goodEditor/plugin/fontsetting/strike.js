// 글꼴 취소선 설정 함수
process.prototype.strike = {
	version : '0.1',
	// 모듈 활성화 여부
	active : true,
	action : function(obj, sTapRows)
	{
		e.$g(goodEditor.obj + '_iframe').contentWindow.document.execCommand('StrikeThrough', false, null);
	}
};
