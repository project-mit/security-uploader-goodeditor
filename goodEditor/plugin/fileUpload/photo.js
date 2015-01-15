// 이미지 첨부 함수
process.prototype.photo = {
	version : '1.3',
	// 모듈 활성화 여부
	active : true,
	// 업로드 가능한 최대 KB
	maxKBytes : 10240,
	action : function(obj, sTapRows)
	{
		var kb = getKB(document, 'div', 'fileinfoByte');
		if ( kb >= this.maxKBytes) {
			alert('최대 ' + maxKBytes + 'KB 이상 업로드 하실수 없습니다.');
		} else {
			openWindow(getJsBasePath() + 'plugin/fileUpload/lib/imageEditor.php', 800, 539);
		}
	}
};
