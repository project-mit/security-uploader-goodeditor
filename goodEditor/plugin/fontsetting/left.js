// 글꼴 왼쪽 정렬 함수
process.prototype.left = {
	version : '0.1',
	// 모듈 활성화 여부
	active : true,
	action : function(obj, sTapRows)
	{
		e.$g(goodEditor.obj + '_iframe').contentWindow.document.execCommand('justifyleft', false, null);
	}
};
