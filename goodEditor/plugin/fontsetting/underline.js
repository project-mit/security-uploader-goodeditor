// 글꼴 밑줄 설정 함수
process.prototype.underline = {
	version : '0.1',
	// 모듈 활성화 여부
	active : true,
	action : function(obj, sTapRows)
	{
		e.$g(goodEditor.obj + '_iframe').contentWindow.document.execCommand('underline', false, null);
	}
};
