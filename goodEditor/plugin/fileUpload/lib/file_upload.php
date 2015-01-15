<?php
?>
<!--
/**
 * CopyRight (C) WSCSX.COM. All Rights Reserved.
 *
 * 제작자 : 김병욱
 * 홈페이지 : http://www.wscsx.com/
 * 라이센스 : http://www.wscsx.com/license.php
 * 이메일 : quddnr145@naver.com
 * 주의 : 저작권 관련부분을 제거하지 마시고 사용하시기 바랍니다.
 **/
 -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=euc-kr" />
	<title> 파일 업로드 - GoodEditor </title>
	<script type="text/javascript" src="../../../goodEditor.js"></script>
	<style type="text/css">
		div.inputfile { position:relative; }
		div.inputfack { position:absolute; top:0px; left:0px; z-index:1; height:100%; }
		.file { position:relative; top:0px; left:0px; z-index:2; width:350px; text-align:right; }
	</style>
</head>
<body>

<?php
if (isset($_FILES['file_upload'])) {
	$file		= $_FILES['file_upload']['tmp_name'];
	$fileName	= $_FILES['file_upload']['name'];
	
	if ($fileName) {
		// 파일 업로드 처리
		$fileNameE = strrev($fileName);
		$fileNameX = explode('.', $fileNameE);
		$fileNa = strrev($fileNameX[1]);
		$fileEx = strtolower(strrev($fileNameX[0]));

		$fileSize = filesize($file);
		$mkdir = '../../../upload/';

		// 확장자 필터링 처리
		switch ($fileEx) {
		case 'htaccess':
		case 'ini':
		case 'conf':
			?>
			<script type="text/javascript">
			//<![CDATA[
				alert('업로드 폴더가 존재하지 않습니다.');
				history.go(-1);
			//]]
			</script>
			<?php
			exit;
			break;
		}
		if (!file_exists($mkdir)) {
			?>
			<script type="text/javascript">
			//<![CDATA[
				alert('업로드 폴더가 존재하지 않습니다.');
				history.go(-1);
			//]]
			</script>
			<?php
		} else {
			if (!is_writeable($mkdir)) {
				?>
				<script type="text/javascript">
				//<![CDATA[
					alert('업로드 폴더에 쓰기권한이 부여할 수 없습니다.');
					history.go(-1);
				//]]
				</script>
				<?php
			} else {
				if ($fileSize <= 0)
				{
					?>
					<script type="text/javascript">
					//<![CDATA[
						alert('10MB 이하의 파일만 업로드 할 수 있습니다.');
						history.go(-1);
					//]]
					</script>
					<?php
				} else {
					// 업로드 된 파일일 경우
					if (is_uploaded_file($file)) {
						// 파일 업로드
						move_uploaded_file($file, $mkdir.$fileNa.'.'.$fileEx);
					}
					?>
					<script type="text/javascript">
					//<![CDATA[
						top.opener.goodEditor.upload.addList('<?php echo $fileNa.'.'.$fileEx; ?>', '<?php echo $fileSize; ?> B', 'file');
						window.close();
					//]]
					</script>
					<?php
				}
			}
		}
	}
}
?>

	<!-- 제목 -->
	<div style="background:#ff7200 url(../../../images/layout_header_bg.jpg) repeat-x left top; color:#fff; padding:8px; font-size:12px; border:1px solid #ff9966;">
		<span style="color:#f8cb0d; font-family:small fonts; font-size:8px;">▶</span>&nbsp;&nbsp;&nbsp;파일 올리기
	</div>
	<form id="upload_f" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" enctype="multipart/form-data">
		<fieldset style="border:0; background:#eee; margin:5px; border:1px solid #ccc;">
			<div class="inputfile" style="overflow:hidden; height:30px; margin-top:7px; margin-left:17px;">
				<input type="file" id="file_upload" name="file_upload" class="file" value="" style="float:left; width:300px; height:21px;" onchange="e.$g('showFilePath').value=this.value; this.blur();" />
				<div class="inputfack">
					<!-- (w - 75) -->
					<input type="text" id="showFilePath" name="showFilePath" class="input_skin1" value="" style="float:left; width:225px; *height:23px; margin-right:5px; padding:4px; font-size:11px;" />
					<img src="../../../images/filefind_btn.gif" alt="" style="float:left;" />
				</div>
				<script type="text/javascript">
				//<![CDATA[
				var fls = new flash('file_upload');
					fls.alpha.start(0);
				//]]>
				</script>
			</div>
		</fieldset>
		<div style="text-align:center; padding:3px;">
			최대 10M까지만 업로드 하실수 있습니다.
			<div style="margin-top:10px;">
				<input type="image" src="../../../images/ok_btn.gif" alt="확인" />
				<a href="#." onclick="window.close();"><img src="../../../images/no_btn.gif" alt="취소" /></a>
			</div>
		</div>
	</form>

</body>
</html>
