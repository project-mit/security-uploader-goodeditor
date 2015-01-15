// 파일 첨부 함수
process.prototype.file = {
	version : '0.1',
	// 모듈 활성화 여부
	active : true,
	action : function(obj, sTapRows)
	{
		var kb = getKB(document, 'div', 'fileinfoByte');
		//if ( kb >= 3072) {
		//	alert('최대 3M이상 업로드 하실수 없습니다.');
		//} else {
			openWindow(getJsBasePath() + 'plugin/fileUpload/lib/file_upload.php', 350, 140);
		//}
	}
};
