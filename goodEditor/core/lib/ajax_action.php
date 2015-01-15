<?php
if (getenv('HTTP_REQUEST_AJAX_TYPE') == 'good-editor/post')
{
	// 파일 제거기능을 수행
	$root = str_replace('\\', '/', getenv('DOCUMENT_ROOT'));
	$fil = '';
	$dir = '';
	if (isset($_POST['f']) && !empty($_POST['f'])) $fil = $_POST['f'];
	if (isset($_POST['d']) && !empty($_POST['d'])) $dir = str_replace('http://pj-room.com/', '', $_POST['d']);

	$fil = str_replace('..', '', $fil);
	$fil = str_replace('/', '', $fil);

	if (file_exists($root.$dir.'/'.$fil)) unlink($root.$dir.'/'.$fil);
}
?>
