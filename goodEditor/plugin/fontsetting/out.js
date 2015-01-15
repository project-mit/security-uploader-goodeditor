// 글꼴 내어쓰기 함수
process.prototype.out = {
	version : '0.1',
	// 모듈 활성화 여부
	active : true,
	action : function(obj, sTapRows)
	{
		e.$g(goodEditor.obj + '_iframe').contentWindow.document.execCommand('Outdent', false, null);
	}
};
