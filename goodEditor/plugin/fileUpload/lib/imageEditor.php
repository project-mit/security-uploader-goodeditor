<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=euc-kr" />
	<title> 이미지 에디터 - GoodEditor </title>

	<script type="text/javascript" src="../../../goodEditor.js"></script>
	<script type="text/javascript">
	//<![CDATA[
	include(getJsBasePath() + 'plugin/fileUpload/lib/product_library.js');
	include(getJsBasePath() + 'plugin/fileUpload/lib/product_editor.js');
	//]]>
	</script>
	<style type="text/css">
	a img {border:0;}
	/* productEditor object class */
	.p_object {width:790px; height:490px; margin:5px; font-size:11px; font-family:'돋움', arial, verdana, sans-serif;}
	/* productEditor image list class */
	.p_list {position:relative; float:left; width:100px; height:100%; border:1px solid #777; overflow:hidden;}
	.p_list_upload {position:absolute; z-index:20; top:0;}
	.p_list_upload_btn_bg {position:relative; z-index:10; background:#fff;}
	/* productEditor up & down button을 제외한 실제 이미지 미리보기 목록 class */
	.p_list_list {float:left; clear:both; height:430px; overflow:hidden;}
	/* productEditor 이미지 수정영역 class */
	.p_edit {position:relative; float:left; width:681px; height:100%; border:1px solid #777; margin-left:5px;}
	.p_edit_area {position:absolute; float:left; overflow:hidden; z-index:5; width:681px; height:455px; margin:0; background:#000; color:#fff;}
	.p_edit_area.top {z-index:10;}
	/* 멀티 이미지 업로드시 업로드 진행상황을 표시할 progress bar 관련 */
	.p_list_progress_body {width:100px; height:75px; margin:1px 0 0 0;}
	.p_list_progress_psnt {width:0; height:100%; background:#32af00; text-align:center; color:#fff;}
	/* productEditor 툴바 영역 관련 */
	.p_edit_tool {height:35px; background:#efefef;}
	.p_edit_edit {}
	/* productEditor 이미지 수정시 관련정보 미리보기용 class */
	.p_status {position:fixed; top:0; left:0; text-align:left; padding:5px; background:#000; display:none;}

	/* button 태그 관련 class */
	.button {width:100%; height:30px; font-size:11px;}
	.button_2 {float:left; clear:both; width:100%; height:15px; margin:0; padding:0;}

	/* product_library.js - 이미지 크기 조절바 관련 class */
	.reRight {background:#e0e0e0; border:1px solid #ccc; cursor:e-resize; position:fixed;}
	.reBottom {background:#e0e0e0; border:1px solid #ccc; cursor:s-resize; position:fixed; text-align:center; padding:0;}
	.reBoth {background:#e0e0e0; border:1px solid #ccc; border-top:0; border-left:0; cursor:se-resize; position:fixed;}
	</style>
</head>
<body>
	<!-- 제목 -->
	<div style="background:#ff7200 url(../../../images/layout_header_bg.jpg) repeat-x left top; color:#fff; padding:8px; font-size:12px; border:1px solid #ff9966;">
		<span style="color:#f8cb0d; font-family:small fonts; font-size:8px;">▶</span>&nbsp;&nbsp;&nbsp;이미지 에디터
	</div>

	<div id="productArea"></div>
	<script type="text/javascript">
	//<![CDATA[
	var pEditor = new productEditor();

	pEditor.setObject(document.getElementById('productArea'));
	pEditor.action();
	//]]>
	</script>
</body>
</html>
