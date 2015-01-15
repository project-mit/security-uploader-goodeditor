/**
 * @ CopyRight (C) PJ-ROOM.COM. All Rights Reserved.
 * @author M_FireFox (quddnr145@naver.com)
 * @brief  goodEditor include file
 **/

// JS include 절대경로 구하기
var rootDir = '';
function getJsBasePath() {
	if (rootDir == '') {
		var document_script = document.getElementsByTagName('script');
		for (var i = 0; i < document_script.length; i++) {
			var script_src = document_script[i].src;
			var script_src_check = script_src.replace('goodEditor.js', '');
			var rootDirCheck = !(script_src == script_src_check);
			if (rootDirCheck == true) {
				rootDir = script_src_check;
			}
		}
	}
	return rootDir;
}

// js library include
function include(path) {
	var headerObj = document.getElementsByTagName('head')[0];
	var fileType = path.substring(path.lastIndexOf('.') + 1, path.length);
		fileType = fileType.replace(/\?(.*)/, '');
	var libObj = '';
	var t = new Date();
	switch (fileType.toLowerCase())
	{
		case 'js':
		case 'php':
			libObj = '<script type="text/javascript" src="' + path + '?' + t.getTime() + '"></script>';
			break;
		case 'css':
			libObj = '<link rel="stylesheet" type="text/css" href="' + path + '?' + t.getTime() + '" />';
			break;
	}
	document.write(libObj);
}

// GoodEditor 필수 라이브러리 추가
include(getJsBasePath() + 'core/good_editor_lib.js');
include(getJsBasePath() + 'core/good_editor.js.php');
include(getJsBasePath() + 'core/good_editor.css');
