/**
 * @ CopyRight (C) PJ-ROOM.COM. All Rights Reserved.
 * @author 김병욱 (quddnr145@naver.com)
 * @brief  goodEditor Core
 **/
<?php
error_reporting(E_ALL ^ E_NOTICE);

$base_dir = dirname(__FILE__);

// xmlParse Library Required
require($base_dir.'/lib/xmlParse.class.php');
require($base_dir.'/lib/xmlParse.php');

// init variables
$output = '';
$selectTapName = '';
$selectTap = 0;

ob_start();
// load - modules
$plugin_dir = dirname($base_dir).'/plugin';
$pluginList = setXmlModuleData($plugin_dir, $output, $selectTap, $selectTapName);
$pluginFuncs = ob_get_contents();
ob_end_clean();

// 인코딩이 UTF-8이 아닌경우 아래 주석을 알맞게 수정
$output = iconv('UTF-8', 'CP949', $output);
$pluginList = iconv('UTF-8', 'CP949', $pluginList);
?>
//////////////////////////////////////////////////
// Code Highlighter
// <script type="text/javascript">
//////////////////////////////////////////////////
// Process class function
function process()
{
}

// Button Action class function
function button()
{
}

// Create Controller
var controller = new process();
// Create Button Controller
var buttonEvent = new button();

// plugin List & functions setting
<?=$pluginFuncs?>

// GoodEditor Namespace
var goodEditor = {
	// goodEditor Object Setting
	obj			: null,
	cPosition	: null,
	createObject: false,
	// 2013-09-29 add by M_FireFox
	htmlMode	: false,

	// goodEditor - Textarea setting
	create : function(obj) {
		if (goodEditor.createObject == true)
		{
			alert('`' + goodEditor.obj + '` 객체가 이미 에디터로 변환되어 있습니다.');
			return false;
		}

		goodEditor.createObject = true;
		// init
		goodEditor.editor.clickPlugRows = null;
		goodEditor.editor.createTapRows = 0;
		goodEditor.editor.cTapObject = 0;
		goodEditor.editor.createGroupObjRows = 0;
		goodEditor.editor.insertTitleObjRows = 0;
		goodEditor.editor.size = 0;

		// init setting
		var cfg = this.editor.config;
		cfg.version		= 'V.1.3.2';
		cfg.root_dir	= getJsBasePath();
		cfg.template_dir	= cfg.root_dir + 'template';
		cfg.upload_dir	= cfg.root_dir + 'upload';
		cfg.img_dir		= cfg.root_dir + 'images';
		cfg.plugin_dir	= cfg.root_dir + 'plugin';
		cfg.template	= cfg.template_dir + '/template.html';
		cfg.eBtn		= 'eBtn';
		cfg.stateText	= '똑똑한 웹 편집기 - Good Editor';
		cfg.w_		= 450;//에디터 가로 사이즈
		cfg.h_		= 100;//에디터 세로 사이즈
		// 업로드 가능한 용량
		cfg.totalUploadBytes = 10240;

		// fileUpload 플러그인의 photo 클래스 환경 설정값을 셋팅
		if (cfg.totalUploadBytes == 0) cfg.totalUploadBytes	= controller.photo.maxKBytes;

		var editObject = e.getBounds(obj);

		goodEditor.obj = obj;
		// 기본 설정값보다 <textarea>...</textarea>의 크기가 클 경우
		if (editObject.width > goodEditor.editor.config.w_ && editObject.height > goodEditor.editor.config.h_)
		{
			// 현재의 <textarea> 크기와 동일하게 goodEditor를 생성
			goodEditor.editor.config.w_ = editObject.width;
			goodEditor.editor.config.h_ = editObject.height;
		}

		editObject = null;
	},

	// Editor NameSpace
	editor : {
		// editor setting
		config : {
			// editor version
			version				: '',
			// goodEditor init directory
			root_dir			: '',
			// goodEditor init Template
			template			: '',
			// goodEditor template directory
			template_dir		: '',
			// goodEditor upload directory
			upload_dir			: '',
			// goodEditor image directory
			img_dir				: '',
			// goodEditor plugin directory
			plugin_dir			: '',
			// goodEditor ToolBar Button image
			eBtn				: '',
			// state Default text
			stateText			: '',
			// goodEditor width, height setting
			// default goodEditor Size
			w_					: 0,
			h_					: 0,
			totalUploadBytes	: 0
		},

		// 해당 TEXTAREA 에디터의 생성여부를 체크
		editorLoadingCheck : function() {
			if (e.$g(goodEditor.obj + '_iframe')) {
				return true;
			} else {
				return false;
			}
		},

		// toolbar 랜더링 함수
		insertToolbar : function() {
			/*font toolbar buttonSetting*/
			<?php echo $output; ?>

			/*init selected tap*/
			sTap(<?php echo $selectTap; ?>, '<?php echo $selectTapName; ?>');
		},

		// goodEditor Loading
		loading : function(){
			// 2013-09-29 add by M_FireFox
			goodEditor.htmlMode = false;
			// 에디터 생성을 위한 부분
			if (!this.editorLoadingCheck()) {
				// textarea를 에디터로 변환 시 기존에 있던 내용이 적용되지
				// 않는 버그 수정
				// 2014-01-02 edit by M_FireFox
				var editorText = e.$g(goodEditor.obj).value;

				// goodEditor Layout
				this.layout();
				this.insertToolbar();

				// textarea를 에디터로 변환 시 기존에 있던 내용이 적용되지
				// 않는 버그 수정
				// 2014-01-02 edit by M_FireFox
				e.$g(goodEditor.obj).value = editorText;

				// Set Text
				e.event(e.$g(goodEditor.obj + '_iframe').contentWindow, 'load', function(){
					if ( e.$g(goodEditor.obj).value != '' ) {
						goodEditor.editor.setContents(e.$g(goodEditor.obj), e.$g(goodEditor.obj + '_iframe'));
					} else {
						goodEditor.editor.toolbarTextareaSave(goodEditor.obj);
					}
					// set designMode
					goodEditor.editor.setDesignMode();
					goodEditor.editor.loading();
				});
			} else {
				e.$g(goodEditor.obj).style.display = 'none';
				e.$g(goodEditor.obj + '_iframe').style.display = 'block';
				if (e.$g(goodEditor.obj + '_textMode')) {
					e.$d(goodEditor.obj + '_textMode');
				}
				this.setContents(e.$g(goodEditor.obj), e.$g(goodEditor.obj + '_iframe'));
				this.setDesignMode();
			}
		},

		// write goodEditor
		layout : function(){
			// create bodyDiv
			//goodEditor.editor.config.w_ = e.getBounds(goodEditor.obj).width;
			var _divBody				= e.$c('div');
				_divBody.id				= goodEditor.obj + '_divBody';
				_divBody.className		= 'divBody';
				_divBody.style.width	= goodEditor.editor.config.w_ + 10 + 'px';
				//_divBody.style.height	= goodEditor.editor.config.h_ + 30 + 'px';
				// create inputTag
				var _input				= e.$c('input');
					_input.type			= 'hidden';
					_input.id			= goodEditor.obj + '_modifyTF';
					_input.name			= goodEditor.obj + '_modifyTF';
					_input.value		= 'false';
					// insert inputObject
					_divBody.appendChild(_input);
				// create tapAreaDiv
				var _divTitleTap				= e.$c('div');
					_divTitleTap.id				= goodEditor.obj + '_divTitleTapArea';
					_divTitleTap.className		= 'divTitleTapArea';
					//_divTitleTap.style.height	= 26 + 'px';
					var _editSmallLogo				= e.$c('div');
						_editSmallLogo.className	= 'editSmallLogo';
						_editSmallLogo.innerHTML	= '<a href="http://www.pj-room.com/"><img src="' + goodEditor.editor.config.img_dir + '/editor_small_title.png" alt="똑똑한 웹 편집기 GoodEditor" /></a>';
						_divTitleTap.appendChild(_editSmallLogo);
					// insert tapAreaDiv
					_divBody.appendChild(_divTitleTap);
				// create titleDiv
				var _divTitle					= e.$c('div');
					_divTitle.id				= goodEditor.obj + '_divTitle';
					_divTitle.className			= 'divTitle';
					_divTitle.style.background	= 'url('+goodEditor.editor.config.img_dir+'/bTitle_bg.gif) repeat-x';
					//_divTitle.style.height		= 31 + 'px';
					// insert titleDiv
					_divBody.appendChild(_divTitle);
				var _divEditArea				= e.$c('div');
					_divEditArea.id				= goodEditor.obj + '_divEditArea';
					_divEditArea.style.width	= goodEditor.editor.config.w_ + 8 + 'px';
					//_divEditArea.style.height	= goodEditor.editor.config.h_ - 31 + 'px';
					_divEditArea.className		= 'divEditArea';
					// insert editAreaDiv
					_divBody.appendChild(_divEditArea);
				// 상태표시줄
				var _divEditStateView			= e.$c('div');
					_divEditStateView.id		= goodEditor.obj + '_stateBar';
					_divEditStateView.className	= 'state_view';
					_divEditStateView.innerHTML = goodEditor.editor.config.stateText;
					// insert StateBar
					_divBody.appendChild(_divEditStateView);
				// upload 관련
				var _uploadInput				= e.$c('input');
					_uploadInput.type			= 'hidden';
					_uploadInput.id				= goodEditor.obj + '_fileRows';
					_uploadInput.name			= goodEditor.obj + '_fileRows';
					_uploadInput.value			= 0;
					// insert upload rows
					_divBody.appendChild(_uploadInput);
				// upload list object
				var _uploadArea					= e.$c('div');
					_uploadArea.className		= 'file_info';
					var _uploadBody					= e.$c('ul');
						_uploadBody.id				= goodEditor.obj + '_file_info';
						_uploadBody.className		= 'file_info_ul';
						// upload List
						var _uploadList					= e.$c('li');
							_uploadList.className		= 'file_content';
							// insert upload Contents
							_uploadBody.appendChild(_uploadList);
							// file information
							var _upload_fileinfo			= e.$c('div');
								_upload_fileinfo.id			= goodEditor.obj + '_fileinfo';
								_upload_fileinfo.className	= 'fileinfo';
								// insert file information
								_uploadList.appendChild(_upload_fileinfo);
							// show upload file KB persent
							var _upload_fileinfo_body			= e.$c('div');
								_upload_fileinfo_body.className	= 'fileinfo_body';
								_upload_fileinfo_body.innerHTML	=	'<div class="file_KB_persent">' +
																	'	<div id="' + goodEditor.obj + '_KB_persent" class="KB_persent"></div>' +
																	'</div>' +
																	'<div class="file_KB_text">' +
																	'	<span id="' + goodEditor.obj + '_fileKB" class="file_KB">0</span> KB <span style="color:#999;">/</span> ' + goodEditor.editor.config.totalUploadBytes + ' KB' +
																	'</div>';
								_uploadList.appendChild(_upload_fileinfo_body);
						_uploadArea.appendChild(_uploadBody);
					_divBody.appendChild(_uploadArea);

			// create editIframe
			var _iframe_src = '';
			var _iframe						= e.$c('iframe');
				// iframe setting
				_iframe.id					= goodEditor.obj + '_iframe';
				_iframe.className			= 'editorIframe';
				_iframe.frameBorder			= 0;
				// goodEditor Template
				_iframe.src					= goodEditor.editor.config.template + _iframe_src;
				_iframe.style.marginLeft	= 5 + 'px';
				_iframe.style.width			= goodEditor.editor.config.w_ + 3 + 'px';
				_iframe.style.height		= goodEditor.editor.config.h_ - 30 + 'px';
				_iframe.style.overflowX		= 'hidden';
				// insert iframe
				_divEditArea.appendChild(_iframe);

			// Move to Hidden Textarea
			var _text_area = '';
				_text_area					= e.$c('textarea');
				_text_area.id				= goodEditor.obj + '_tmpTextArea';
				_text_area.name				= e.$g(goodEditor.obj).name;
				_text_area.cols				= e.$g(goodEditor.obj).cols;
				_text_area.rows				= e.$g(goodEditor.obj).rows;
				_text_area.className		= e.$g(goodEditor.obj).className;
				_text_area.style.display	= 'none';
				_text_area.style.width		= goodEditor.editor.config.w_ - 2 + 'px';
				_text_area.style.height		= goodEditor.editor.config.h_ - 40 + 'px';
				_text_area.style.fontSize	= 11 + 'px';
				_text_area.style.border		= 0;
				_text_area.value			= e.$g(goodEditor.obj).value;
				// Move hidden textarea
				_divEditArea.appendChild(_text_area);

			// textarea hidden
			e.$g(goodEditor.obj).style.display	= 'none';
			// insert divBody
			e.$g(goodEditor.obj).parentNode.appendChild(_divBody);

			// move hidden textarea
			e.$d(goodEditor.obj);
			e.$g(goodEditor.obj + '_tmpTextArea').id = goodEditor.obj;

			// init memory
			_text_area = null;
			_iframe = null;
			_iframe_src = null;

			_upload_fileinfo_body = null;
			_upload_fileinfo = null;
			_uploadList = null;
			_uploadBody = null;
			_uploadArea = null;
			_uploadInput = null;
			_divEditArea = null;
			_divTitle = null;
			_editSmallLogo = null;
			_divTitleTap = null;
			_input = null;
			_divBody = null;
		},

		// editorTitle innerHTML
		createGroupObjRows : 0,
		insertTitleObjRows : 0,
		// create group object
		createGroup : function(){
			var gp = e.$c('div');
				gp.id	= 'group_' + this.createGroupObjRows;
				// default setting : display:none;
				gp.style.display	= 'none';

			// add group
			this.cTapObject = this.createGroupObjRows;
			this.createGroupObjRows++;
			// insert EditorToolBar
			e.$g(goodEditor.obj + '_divTitle').appendChild(gp);
		},

		// insert button or text
		size : 0,
		insertTitleButton : function(insertText, ToolTipTitleText, ToolTipText, ToolTipStyle, boolen, boolenTF, showText){
			this.insertTitleObjRows = insertText;
			// init : display
			for(var i = 0; i < this.createGroupObjRows; i++){
				e.$g('group_' + i).style.display = 'none';
			}
			// setting : display:block;
			if(e.$g('group_' + this.cTapObject).style.display == 'none'){
				e.$g('group_' + this.cTapObject).style.display = 'block';
			}
			var obj = e.$c('div');
				obj.id			= 'insertObj_' + this.insertTitleObjRows;
				obj.className	= 'divTitleObj';
				if(boolen == true){
					// print image button
					obj.innerHTML	=	'<a id="toolbarAction_'+this.insertTitleObjRows+'" href="javascript:void(0);"' +
										' onmouseover="e.$g(\'toolbarBtn_'+this.insertTitleObjRows+'\').src=\''+ goodEditor.editor.config.plugin_dir + '/' + this.createTapName + '/image/' + insertText + '_c_btn.gif\'"' +
										' onmouseout="e.$g(\'toolbarBtn_'+this.insertTitleObjRows+'\').src=\''+ goodEditor.editor.config.plugin_dir + '/' + this.createTapName + '/image/' + insertText + '_n_btn.gif\'"' +
										' onmousedown="e.$g(\'toolbarBtn_'+this.insertTitleObjRows+'\').src=\''+ goodEditor.editor.config.plugin_dir + '/' + this.createTapName + '/image/' + insertText + '_d_btn.gif\'"' +
										' onmouseup="e.$g(\'toolbarBtn_'+this.insertTitleObjRows+'\').src=\''+ goodEditor.editor.config.plugin_dir + '/' + this.createTapName + '/image/' + insertText + '_c_btn.gif\'"' +
										' title="' + ToolTipTitleText + '">' +
										'	<img id="toolbarBtn_'+this.insertTitleObjRows+'" src="' + goodEditor.editor.config.plugin_dir + '/' + this.createTapName + '/image/' + insertText + '_n_btn.gif' + '" alt="' + ToolTipTitleText + '" />' +
										'</a>';
				}else{
					// @edit by M_FireFox (quddnr145@naver.com)
					// module.xml 에서 <plugin ... action="false"> ... </plugin> action 속성이
					// 올바르게 작동되지 않는 버그 수정
					if (insertText == '&nbsp;') {
						// print text
						obj.innerHTML	= insertText;
					}
				}
			// {number} = this.cTapObject
			// insert into group_{number} values obj
			e.$g('group_' + this.cTapObject).appendChild(obj);
			var nu = this.insertTitleObjRows;
			if(boolenTF == true){
				// show tooltip
				var tTitleText = ToolTipTitleText;
				var tText = ToolTipText;
				e.event(e.$g('toolbarAction_' + this.insertTitleObjRows), "mouseover", function(){ tooltip(tTitleText, tText) });
				e.event(e.$g('toolbarAction_' + this.insertTitleObjRows), "mouseout", function(){ tooltipHide() });
			}

			if(boolen == true){
				// Click Event
				e.event(e.$g('toolbarAction_' + this.insertTitleObjRows), "click", function(){ goodEditor.editor.clickEvent(nu, insertText) });
			}
			//this.insertTitleObjRows++;
		},

		// textarea의 내용을 iframe으로 이동
		setContents : function(txtObj, obj) {
			var goodEditor = this;
			var documentTemplate = 
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
				'<html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">' +
				'<head>' +
				'	<title>Good Editor Document Page</title>' +
				'	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
				'	<style type="text/css">' +
				'		p { margin:0; padding:0; }' +
				'		body { margin:0; padding:0; font-size:12px; font-family:돋움, arial; line-height:18px; }' +
				'	</style>' +
				'</head>' +
				'<body style="cursor:text;">' +
				this.beautifyTags(txtObj.value) +
				'</body>' +
				'</html>';

			obj.contentWindow.document.open();
			obj.contentWindow.document.write(documentTemplate);
			obj.contentWindow.document.close();

			return true;
		},

		// now tapPluginName
		createTapName : '',
		// editTitle createTap
		createTapRows : 0,
		// selected Tap Object
		cTapObject : 0,
		createTap : function(TapRows, tapObjImage, tapObjTitle, tapObjText){
			// Show Title And Alt Options
			if ( typeof(tapObjTitle) == 'undefined' ) {
				tapObjTitle = '';
			}

			this.createTapName = tapObjImage;

			var tapStyle	= 'margin:10px;';
			var tapObj		= e.$c('div');
				tapObj.id			=	goodEditor.obj + '_tap' + this.createTapRows;
				// 2013-09-29 edit by M_FireFox
				// 텝 마우스 오버시 커서모양 설정
				tapObj.style.cursor = 'pointer';
				if(this.createTapRows == this.cTapObject)
				{
					tapStyle += 'margin-top:8px;';
					// selected tap style
					var tapObjTextImgSrc = 'tap_' + tapObjImage + '_text.gif';
					tapObj.style.background		= 'url(' + goodEditor.editor.config.img_dir + '/' + 'tap_bg_click.gif) repeat-x';
					tapObj.className	=	'divTitleTap on';
				}
				else
				{
					tapStyle += 'margin-top:5px;';
					// none selected tap style
					var tapObjTextImgSrc = 'tap_' + tapObjImage + '_text_none.gif';
					tapObj.style.background		= 'url(' + goodEditor.editor.config.img_dir + '/' + 'tap_bg_none.gif) repeat-x';
					tapObj.className	=	'divTitleTap off';
				}
				var author = '<a id="tapObj_author_' + this.createTapRows + '" href="" style="float:left; position:absolute; top:6px; right:5px; font-weight:bold;" title="플러그인 제작자">?</a>';

				tapObj.innerHTML	=	'<a href="javascript:void(0);" onclick="sTap(' + this.createTapRows + ', \'' + tapObjImage + '\');" title="' + tapObjTitle + '"><img id="imgText_'+this.createTapRows+'" src="' + goodEditor.editor.config.img_dir + '/' + tapObjTextImgSrc + '" alt="' + tapObjTitle + '" '+ 'style="' + tapStyle + '" /></a>';
			e.$g(goodEditor.obj + '_divTitleTapArea').appendChild(tapObj);

			// addEvent 'onClick'
			var tapRows = this.createTapRows;
			// ToolTip Setting
			e.event(e.$g(goodEditor.obj + '_tap' + this.createTapRows), "mouseover", function(){ tooltip(tapObjTitle, tapObjText) });
			e.event(e.$g(goodEditor.obj + '_tap' + this.createTapRows), "mouseout", function(){ tooltipHide() });
			// 2013-09-29 edit by M_FireFox
			// 이미지를 제외한 바탕 부분 클릭시 탭 활성화 처리
			e.event(e.$g(goodEditor.obj + '_tap' + this.createTapRows), "click", function(){
				sTap(tapRows, tapObjImage);
			});
			this.createTapRows++;
			// createToolBar Button
			this.createGroup();
		},

		// selected TapStyle setting
		selectedTap : function(cTapObject, sTapImageName){
			// plugin list
			var sTapImageArr = [<?php echo $pluginList; ?>];
			for(var i = 0; i < this.createTapRows; i++)
			{
				var tapObj = e.$g(goodEditor.obj + '_tap' + i);
				if(tapObj != null)
				{
					if(i == cTapObject)
					{
						tapMarginT = 8;
						// selected tap style
						var tapObjTextImgSrc		= 'tap_' + sTapImageArr[i] + '_text.gif';
						//tapObj.style.top			= 0 + 'px';
						//tapObj.style.height			= 25 + 'px';
						tapObj.style.background		= 'url(' + goodEditor.editor.config.img_dir + '/' + 'tap_bg_click.gif) repeat-x';
						//tapObj.style.paddingBottom	= 0 + 'px';
						//tapObj.style.borderBottom	= '1px solid #fff';
						tapObj.className = 'divTitleTap on';
					}
					else
					{
						tapMarginT = 5;
						// none selected tap style
						var tapObjTextImgSrc		= 'tap_' + sTapImageArr[i] + '_text_none.gif';
						//tapObj.style.top			= 5 + 'px';
						//tapObj.style.height			= 15 + 'px';
						tapObj.style.background		= 'url(' + goodEditor.editor.config.img_dir + '/' + 'tap_bg_none.gif) repeat-x';
						//tapObj.style.paddingBottom	= 5 + 'px';
						//tapObj.style.borderBottom	= '1px solid #d5d5d5';
						tapObj.className = 'divTitleTap off';
					}
					// setting tapTitle Image Options
					e.$g('imgText_' + i).src				= goodEditor.editor.config.img_dir + '/' + tapObjTextImgSrc;
					e.$g('imgText_' + i).style.marginTop	= tapMarginT + 'px';
					//e.$g('tapObj_author_' + i).style.top = tapMarginT - 2 + 'px';
				}
				else
				{
					// not find tapObj!
					alert("goodEditor.selectTap() - Error : " + i + "::" + cTapObject);
				}
			}
		},

		// editor 영역을 클릭시 전부 비활성화 되도록 설정
		toolsObjectsInit : function(){
			try
			{
				for (var pluginList in controller)
				{
					// 초기화 함수가 존재할 경우 실행
					if (typeof controller[pluginList].init != 'undefined')
					{
						// 2013-09-29 edit by M_FireFox
						// 비활성화 전 객체가 생성되지 않은경우 생성을 위해 action 함수 실행
						controller[pluginList].action(this, pluginList);
						// 해당 플러그인 기능들의 초기화 작업
						controller[pluginList].init(pluginList);
					}
				}
				//------------------------------------------------------------------
				// 2013-09-29 add by M_FireFox
				// @작성 완료후 에디터의 내용을 다른 페이지로 보낼시 iframe 내용과
				// @textarea 의 내용이 다른 버그 수정
				//------------------------------------------------------------------
				// 에디터 내용 저장
				this.toolbarTextareaSave(goodEditor.obj);
			}
			catch (e)
			{
				//alert('플러그인 초기화 오류 : ' + e);
			}
			finally
			{
				pluginList = null;
			}
		},

		// Click Event
		clickPlugRows : null,
		clickEvent : function(sTapRows, insertText){
			if (this.clickPlugRows != sTapRows) {
				this.toolsObjectsInit();
			}
			this.clickPlugRows = sTapRows;

			e.$g(goodEditor.obj + '_iframe').unselectable = 'on';
			if (typeof controller[sTapRows] == 'undefined')
			{
				//alert(sTapRows + '.js 라이브러리를 찾을 수 없습니다.');
				alert('해당 기능에 대한 라이브러리를 찾을 수 없습니다.');
			}
			else
			{
				if ( controller[sTapRows].active == true ) {
					controller[sTapRows].action(this, sTapRows);
				} else {
					alert('해당 기능은 비활성화 상태로 설정 되어있습니다.');
				}
			}

			// HIDDEN textarea에 적용
			this.toolbarTextareaSave(goodEditor.obj);
			//alert(sTapRows+'버튼을 클릭하였습니다.');
		},

		// Save Selected Area
		// 선택한 영역에 대하여 위치관련 북마크를 생성한다
		setSelectedArea : function() {
			var o = '';
			if (e.IE == 1)	// IE
				o = e.$g(goodEditor.obj + '_iframe').contentWindow.document;
			else			// if contentDocument.exists, W3C compliant (Mozilla)
				o = e.$g(goodEditor.obj + '_iframe').contentDocument;

			if ( o.selection ) {
				var rang = o.selection.createRange();

				if (rang) {
					rang.select();
					goodEditor.cPosition = rang.getBookmark();
				}
			}
		},

		// GoodEditor Area designMode Setting
		setKeyEvent : false,
		setDesignMode : function(){
			// designMode On
			var s = this;
			var drag = false;
			// if contentDocument.exists, W3C compliant (Mozilla)
			var editorObj = e.$g(goodEditor.obj + '_iframe').contentDocument;
			if (e.IE == 1) editorObj = e.$g(goodEditor.obj + '_iframe').contentWindow.document; // IE

			var editorIframeObj = editorObj.getElementsByTagName('body')[0];

			// set DesignMode 'On'
			editorObj.designMode = "On";

			// 함수 실행시 단 한번만 이벤트 등록
			if (typeof editorIframeObj != 'undefined')
			{
				e.event(editorIframeObj, 'keydown',		function(){ s.toolbarTextareaSave(goodEditor.obj); });
				e.event(editorIframeObj, 'keyup',		function(){ s.toolbarTextareaSave(goodEditor.obj); });
				e.event(editorIframeObj, 'keypress',	function(){ s.toolbarTextareaSave(goodEditor.obj); });
				// 드래그 할때마다 선택 영역 저장
				e.event(editorIframeObj, 'mousedown',	function(){ drag = true; s.cPosition = null; });
				e.event(editorIframeObj, 'mouseup',		function(){
					if (drag == true)
					{
						s.toolsObjectsInit();
						s.setSelectedArea();
					}
					drag = false;
				});
			}
		},

		// W3C규약에 알맞게 태그 변경
		w3cStrCode : '',
		beautifyTags : function(str) {
			if ( isNaN(str) ) {
				if (this.w3cStrCode == str) return this.w3cStrCode;

				// 태그 정리
				str = str.replace(/<(\/?)em>/gi, '<$1i>');
				str = str.replace(/<(\/?)(strong|b)>/gi, '<$1b>');
				// 강제 개행
				str = str.replace(/<br>/gi, '<br />');
				str = str.replace(/<p([^>]*)>/gi, '');
				str = str.replace(/<\/p>/gi, '<br />');
				// 기타 CSS 변경
				str = str.replace(/<img([^>]+)\/?>/gi, '<img$1 />');
				str = str.replace(/<(\/)?font([^>]*)>/gi, '<$1span$2>');
				str = str.replace(/color=\"?([^>]*)\"?/gi, 'style="color:$1');
				str = str.replace(/align=\"?([^>]*)\"?/gi, 'style="text-align:$1');
				str = str.replace(/face=\"?([^>]*)\"?/gi, 'style="font-family:$1');
				// 글씨 크기 설정 관련
				str = str.replace(/size=([^>]*)/gi, 'style="font-size:$1' + controller.fontsize.fontSizeWords + '"');
				str = str.replace(/style=[\"\']([a-zA-Z\-_]+)\:[\s\t\r\n]*([^;]+)(;?)[\"\']/gi, 'style="$1:$2$3"');

				// 모든 대문자태그들을 소문자로 변경
				//str = str.replace(/<[^>]*/g, function(match){ return match.toLowerCase(); });

				// 하나의 태그안의 여러개의 style옵션을 하나로 만든다
				var str2Arr = str.split('<');
				var tmpStr = str2Arr[0];
				for(var j = 1; j < str2Arr.length; j++) {
					var beautiTag = '';

					if (str2Arr[j][0] != '/') {
						str2ArrSplit = str2Arr[j].split('>');
						str2Arr[j] = str2ArrSplit[0];

						var bTags = '';
						var opts = '';
						var strArr = str2Arr[j].split('style="');
						if (strArr[1]) {
							bTags = 'style="';
							for(var i = 1; i < strArr.length; i++) {
								strArr[i] = strArr[i].split('"');

								var tbTags = strArr[i][0].trim();
								if (tbTags[tbTags.length - 1] != ';') tbTags += ';';
								bTags += tbTags;

								strArr[i][0] = null;
								if (strArr[i].length > 2) opts += strArr[i].join('"').replace(/^\"/, '');
							}
							bTags += '"';
						} 

						beautiTag = '<' + strArr[0] + bTags + opts + '>';
						if ( typeof(str2ArrSplit[1]) != 'undefined') {
							beautiTag += str2ArrSplit[1];
						}
						tmpStr += beautiTag;
					} else {
						tmpStr += '<' + str2Arr[j];
					}
				}
				str = tmpStr;
				this.w3cStrCode = str.trim();
			}
			else
			{
				return str;
			}

			return this.w3cStrCode;
		},

		// iframe의 소스 코드를 hidden textarea에 저장
		toolbarTextareaSave : function(obj) {
			if (e.$g(obj + '_iframe').contentWindow.document.getElementsByTagName('body')[0]) {
				var innerString = e.$g(obj + '_iframe').contentWindow.document.getElementsByTagName('body')[0].innerHTML;
				innerString = this.beautifyTags(innerString);
				e.$g(obj).value = innerString;

				// 내용이 수정됨을 알림
				e.$g(goodEditor.obj + '_modifyTF').value = 'true';
			}
		}
	},

	// Good Editor TextMode 관련
	text : {
		loading : function() {
			if (!goodEditor.editor.editorLoadingCheck()) {
				// goodEditor Layout
				goodEditor.editor.layout();
				goodEditor.editor.insertToolbar();
			}

			// 2013-09-29 add by M_FireFox
			goodEditor.htmlMode = true;

			// iframe내용을 textarea로 이동
			goodEditor.editor.toolbarTextareaSave(goodEditor.obj);

			e.$g(goodEditor.obj).style.display = 'block';
			e.$g(goodEditor.obj + '_iframe').style.display = 'none';

			if (!e.$g(goodEditor.obj + '_textMode')) {
				var disableObj = e.$c('div');
					disableObj.id = goodEditor.obj + '_textMode';
					disableObj.style.position = 'absolute';
					disableObj.style.background = '#fff';
					disableObj.style.top = 0;
					disableObj.style.left = 0;
					disableObj.style.zIndex = 30;
					disableObj.style.width = 100 + '%';
					disableObj.style.height = 29 + 'px';
				e.$g(goodEditor.obj + '_divTitle').appendChild(disableObj);

				var fls = new flash();
					fls.alpha.setSymbol(goodEditor.obj + '_textMode');
					fls.alpha.setAlpha(50);
			}
		}
	},

	mode : {
		get : function() {
			return goodEditor.htmlMode;
		},
		change : function() {
			if (goodEditor.htmlMode == true)
			{
				// textMode -> EditorMode
				goodEditor.editor.loading();
			}
			else
			{
				// editorMode -> TextMode
				goodEditor.text.loading();
			}
		}
	},

	// Good Editor Upload 기능 관련
	upload : {
		fileRows : 0,
		action : [],
        functions : {
            'e' : [],
            'i' : []
        },

		// 목록 관련 함수가 실행될때 마지막에 다시 한번 실행될 함수 설정
		//		목록 추가 : add
		//		목록 제거 : del
		setFunctionAddList : function(type, func)
		{
			this.action[type] = func;
		},

        closeFunctions : function()
        {
            var o = document.getElementsByClassName('fileinfo_funcs');
            for (var i = 0; i < o.length; i++) {
                o[i].style.display = 'none';
            }
        },

        toggleFunctions : function(objid)
        {
            var o = document.getElementsByClassName('fileinfo_funcs');
            for (var i = 0; i < o.length; i++) {
                o[i].style.display = 'none';
            }

            var imt_dll_list = this.functions.i;

            var funcs = [];
            var obj = e.$g(objid);
            if (obj.innerHTML == '') {
                for (var imt in imt_dll_list) {
                    if (objid.replace(imt, '') != objid) {
                        for (var imt_func in imt_dll_list[imt]) {
                            if (typeof imt_dll_list[imt][imt_func] == 'number') break;
                            var func_name = imt_dll_list[imt][imt_func].replace("\u0000", '');

                            funcs.push(func_name);
                        }
                    }
                }
                obj.innerHTML = funcs.join(', ');
            }

            if (obj.innerHTML != '') {
                if (obj.style.display == 'none')
                    obj.style.display = 'block';
                else
                    obj.style.display = 'none';
            }
        },

		// 업로드된 파일/이미지를 표시
		addList : function(fileName, size, type) {
			var s = this;
			var rows = this.fileRows;
			if (rows == 0) {
				e.$g(goodEditor.obj + '_file_info').style.display = 'block';
			}
			if (type == 'image') {
				var iconAlt = '사진 첨부';
				var typeListName = '	<input type="hidden" name="' + goodEditor.obj + '_fileImageName[]" value="' + fileName + '" />';
				var typeStr = '	<div style="float:right; font-family:verdana; font-size:10px; margin-top:4px; margin-right:5px; color:#31a4ff;">[ IMAGE ]</div>';
			} else {
				var iconAlt = '첨부 파일';
				var typeListName = '	<input type="hidden" name="' + goodEditor.obj + '_fileUploadName[]" value="' + fileName + '" />';
				var typeStr = '';

				ajax.get(goodEditor.editor.config.root_dir + 'plugin/fileUpload/lib/peViewer/upload_plugin.php?file=' + fileName, function(x) {
					eval(x.responseText);

                    goodEditor.upload.functions.e = iet_dll_list;
                    goodEditor.upload.functions.i = imt_dll_list;

					var text = '';
					for (var iet in iet_dll_list) {
						for (var iet_func in iet_dll_list[iet]) {
							if (iet_dll_list[iet][iet_func] == null) break;
							var func_name = iet_dll_list[iet][iet_func].replace("\u0000", '');
						}
					}

					var injDLL = 0;
					var idx = 0;
					var tech = new Array();
					for (var imt in imt_dll_list) {
						for (var imt_func in imt_dll_list[imt]) {
							if (typeof imt_dll_list[imt][imt_func] == 'number') break;
							var func_name = imt_dll_list[imt][imt_func].replace("\u0000", '');

							switch (func_name) {
							case 'fopen':
							case 'fputc':
							case 'fgetc':
							case 'fputs':
							case 'fgets':
							case 'fclose':
							case 'feof':
								tech['파일 제어']++;
								break;
							case 'CheckRemoteDebuggerPresent':
							case 'IsDebuggerPresent':
								tech['디버깅 방지']++;
								break;
							case 'system':
								tech['<b>외부 명령실행</b>']++;
								break;
							case 'GetWindowThreadProcessId':
							case 'FindWindow':
								tech['다른 프로그램 검색']++;
								break;
							case 'DebugActiveProcess':
								tech['다른 프로그램 내용 가로채기']++;
								break;
							case 'WaitForDebugEvent':
							case 'ContinueDebugEvent':
								tech['프로그램 내용 유출']++;
								break;
							case 'VirtualQueryEx':
								tech['<b>특정 메모리 검색</b>']++;
								break;
							case 'VirtualProtectEx':
								tech['메모리 권한 변경']++;
								break;
							case 'SHGetFolderPathA':
								tech['환경설정 내 폴더 경로 검색']++;
								break;
							case 'ShellExecuteW':
							case 'ShellExecuteExA':
								tech['<b>다른 프로세스를 실행</b>']++;
								break;
							case 'SHGetSpecialFolderLocation':
								tech['특별 시스템폴더 경로 검색']++
								break;
							case 'RegCloseKey':
							case 'RegEnumKeyW':
							case 'RegOpenKeyExW':
							case 'RegDeleteKeyW':
							case 'RegDeleteValueW':
							case 'RegCreateKeyExW':
							case 'RegSetValueExW':
							case 'RegQueryValueExW':
							case 'RegEnumValueW':
							case 'RegEnumKeyA':
							case 'RegOpenKeyExA':
							case 'RegDeleteKeyA':
							case 'RegDeleteValueA':
							case 'RegCreateKeyExA':
							case 'RegSetValueExA':
							case 'RegQueryValueExA':
							case 'RegEnumValueA':
								tech['레지스트리 조작/수정']++
								break;
							case 'SHGetFileInfoW':
							case 'SHGetFileInfoA':
								tech['외부 파일정보 참고']++;
								break;
							case 'SetWindowsHook':
							case 'SetWindowsHookEx':
								tech['윈도우 메시지 가로채기']++;
								break;
							};

							if (func_name == 'OpenProcess') injDLL++;
							if (func_name == 'GetModuleHandleW') injDLL++;
							if (func_name == 'GetModuleHandleA') injDLL++;
							if (func_name == 'VirtualAlloc') injDLL++;
							if (func_name == 'VirtualAllocEx') injDLL++;
							if (func_name == 'VirtualProtect') injDLL++;
							if (func_name == 'VirtualProtectEx') injDLL++;
							if (func_name == 'WriteProcessMemory') injDLL++;
							if (func_name == 'CreateRemoteThread') injDLL++;
							if (injDLL > 4)
							{
								tech['<b>[DLL Injection] 패턴과 동일한 패턴 사용</b>']++;
							}
						}

						switch (imt) {
						case 'kernel32.dll':
							break;
						case 'user32.dll':
							break;
						case 'gdi32.dll':
							tech['화면 그래픽 제어']++;
							break;
						case 'd3d9.dll':
							tech['2D/3D화면 제어']++;
							break;
						case 'd3dx9_40.dll':
							tech['2D/3D화면 제어']++;
							break;
						case 'msvcP90.dll':
							break;
						case 'msvcr90.dll':
							break;
						case 'wsock32.dll':
						case 'mswsock.dll':
						case 'ws2_32.dll':
							tech['통신 기능']++;
							break;
						case 'version.dll':
							tech['파일 정보 검색 기능']++;
							break;
						};
					}

					tech_text = '사용된 DLL 목록 : ';
                    var dll_in_functions = '';
					var dll_list_count = 0;
					for (var dll_name in imt_dll_list) {
						if (/^.+\.(dll|DLL)$/.test(dll_name))
						{
                            dll_in_functions += '<div id="' + fileName + '_' + dll_name + '" class="fileinfo_funcs" style="display: none; cursor:pointer; width:' + (goodEditor.editor.config.w_ - 5) + 'px;" onclick="goodEditor.upload.closeFunctions();"></div>';

                            tech_text += '<a href="#" onclick="goodEditor.upload.toggleFunctions(\'' + fileName + '_' + dll_name + '\');">';
							tech_text += dll_name;
                            tech_text += '</a>';
							tech_text += ', ';
							dll_list_count++;
						}
					}
					if (dll_list_count == 0) tech_text += '<b>None</b>';
                    tech_text += dll_in_functions;

					var use_techs = '';
					tech_text += '<div style="clear:both;">';
                    tech_text += '포함된 기능 : ';
					for (var tech_name in tech) {
						use_techs += tech_name;
						use_techs += ', ';
					}
					if (use_techs == '') use_techs = '<strong>알수없음</strong>';
					tech_text += use_techs + '</div>';
					tech_text += '인터페이스 : <b>' + exe_subsystem + '</b><br />';

					var fileInfo = e.$c('div');
						fileInfo.id = 'file_info_description_' + fileName;
						fileInfo.className = 'file_information';
						fileInfo.innerHTML = tech_text;

					var textarea_ = e.$c('textarea');
						textarea_.name = goodEditor.obj + '_fileUploadInfo[]';
						textarea_.style.display = 'none';
						textarea_.value = tech_text;
						fileInfo.appendChild(textarea_);

					e.$g(goodEditor.obj + '_fileinfo').appendChild(fileInfo);
					e.$g(goodEditor.obj + '_stateBar').innerHTML = '<b>분석 완료!!</b>';	
				}, function() {
					e.$g(goodEditor.obj + '_stateBar').innerHTML = '실행파일 분석 중 입니다.';	
				});
			}
			// 부모창에게 업로드에 성공한 파일의 이름을 전송처리 할 부분
			var fileInfo			= e.$c('div');
				fileInfo.id			= goodEditor.obj + '_fileBody_' + rows;
				fileInfo.className	= 'fileinfoBody_' + (rows%2);
				fileInfo.innerHTML	=	'<img src="' + goodEditor.editor.config.img_dir + '/icon_' + type + '.gif" alt="' + iconAlt + '" class="fileInfoIcon" />' +
										'<div class="fileinfoText"><a href="#">' + fileName + '</a></div>' +
										'<div class="fileinfoDelete" title="file delete">' +
										typeListName +
										'<a id="' + goodEditor.obj + '_fileDelete_' + rows + '" href="#" onclick="return goodEditor.upload.fileDelete(\'' + goodEditor.obj + '_fileBody_' + rows + '\');" title="file delete" style="display:block; margin:0 0 3px 0; color:#bc5353;">x</a>' +
										'</div>' +
										'<div id="' + goodEditor.obj + '_fileByte[]" class="fileinfoByte">' + size + '</div>' +
										typeStr;

			e.$g(goodEditor.obj + '_fileinfo').appendChild(fileInfo);
			// setting onclick event
			//e.event(e.$g(goodEditor.obj + '_fileDelete_' + rows), 'click', function(){ s.fileDelete(goodEditor.obj + '_fileBody_' + rows); });

			e.$g(goodEditor.obj + '_fileBody_' + rows).style.width = goodEditor.editor.config.w_ + 8 + 'px';
			if (rows >= 0) {
				if (rows > 0) {
					e.$g(goodEditor.obj + '_fileBody_' + (rows - 1)).style.borderBottom = '0px solid transparent';
				}
				e.$g(goodEditor.obj + '_fileBody_' + rows).style.borderTop = '0px solid transparent';
			}
			e.$g(goodEditor.obj + '_fileRows').value = ++this.fileRows;
			//this.fileRows++;

			var kb = getKB(document, 'div', 'fileinfoByte');
			var pst = Math.round(kb / goodEditor.editor.config.totalUploadBytes * 100);
				pst = (pst > 100)?100:pst;

			e.$g(goodEditor.obj + '_fileKB').innerHTML = kb;
			e.$g(goodEditor.obj + '_KB_persent').style.width = pst + '%';

			// 함수 실행
			if (typeof this.action['add'] != 'undefined')
			{
				this.action['add'](fileName);
			}

			// 용량 초과시 업로드 목록에서 제거
			if (Math.round(kb / goodEditor.editor.config.totalUploadBytes * 100) > 100)
			{
				alert('업로드 가능한 용량을 초과 하였습니다.');
				this.fileDelete(goodEditor.obj + '_fileBody_' + rows);
			}
		},

		//파일 업로드 목록제거 함수
		fileDelete : function(deleteObj) {
			var s = this;
			if (e.$g(goodEditor.obj + '_fileRows').value > 0) {
				this.fileRows--;

				// 함수 실행
				var fileName = e.$g(deleteObj).getElementsByTagName('input')[0].value;
				if (typeof this.action['del'] != 'undefined')
				{
					this.action['del'](fileName);
				}

				e.$g(goodEditor.obj + '_fileRows').value = this.fileRows;

				// delete upload file
				ajax.post(goodEditor.editor.config.root_dir + 'core/lib/ajax_action.php?f=' + fileName + '&d=' + goodEditor.editor.config.upload_dir);

				var _edit_frame = e.$g(goodEditor.obj + '_iframe').contentWindow;
				var _edit_img = _edit_frame.document.getElementsByTagName('img');
				for (var i = 0; i < _edit_img.length; i++)
				{
					if (_edit_img[i].src == goodEditor.editor.config.upload_dir + '/' + fileName)
					{
						e.$d(_edit_img[i]);
					}
				}

				e.$d(deleteObj);
				e.$d('file_info_description_' + fileName);

				// 업로드할 파일의 전체 용량을 표시함
				var kb = getKB(document, 'div', 'fileinfoByte');
				var pst = Math.round(kb / goodEditor.editor.config.totalUploadBytes * 100);
				e.$g(goodEditor.obj + '_fileKB').innerHTML = kb;
				e.$g(goodEditor.obj + '_KB_persent').style.width = pst + '%';

				var rows = Number(deleteObj.replace(goodEditor.obj + '_fileBody_', ''));
				if (!isNaN(rows)) {
					if (e.$g(goodEditor.obj + '_fileBody_' + (rows - 1)) && e.$g(goodEditor.obj + '_fileBody_' + (rows + 1))) {
						// 가운데 있는것을 제거했을시
						var rowValue = this.fileRows;
						for (var i = rows; i < rowValue; i++) {
							e.$g(goodEditor.obj + '_fileBody_' + (i + 1)).id = goodEditor.obj + '_fileBody_' + i;
							e.$g(goodEditor.obj + '_fileBody_' + i).className = 'fileinfoBody_' + (i%2);

							e.$g(goodEditor.obj + '_fileDelete_' + (i + 1)).href = 'javascript:goodEditor.upload.fileDelete(\'' + goodEditor.obj + '_fileBody_' + i + '\');';
							e.$g(goodEditor.obj + '_fileDelete_' + (i + 1)).onclick = function(){};
							e.$g(goodEditor.obj + '_fileDelete_' + (i + 1)).id = goodEditor.obj + '_fileDelete_' + i;
						}
					} else if (!e.$g(goodEditor.obj + '_fileBody_' + (rows - 1)) && e.$g(goodEditor.obj + '_fileBody_' + (rows + 1))) {
						// 맨위의 것을 제거했을시
						e.$s(goodEditor.obj + '_fileBody_' + (rows + 1)).borderTop = 0;
						var rowValue = this.fileRows;
						for (var i = 0; i < rowValue; i++) {
							e.$g(goodEditor.obj + '_fileBody_' + (i + 1)).id = goodEditor.obj + '_fileBody_' + i;
							e.$g(goodEditor.obj + '_fileBody_' + i).className = 'fileinfoBody_' + (i%2);

							e.$g(goodEditor.obj + '_fileDelete_' + (i + 1)).href = 'javascript:goodEditor.upload.fileDelete(\'' + goodEditor.obj + '_fileBody_' + i + '\');';
							e.$g(goodEditor.obj + '_fileDelete_' + (i + 1)).onclick = function(){};
							e.$g(goodEditor.obj + '_fileDelete_' + (i + 1)).id = goodEditor.obj + '_fileDelete_' + i;
						}
					} else if (e.$g(goodEditor.obj + '_fileBody_' + (rows - 1)) && !e.$g(goodEditor.obj + '_fileBody_' + (rows + 1))) {
						// 맨아래의 것을 제거했을시
						e.$s(goodEditor.obj + '_fileBody_' + (rows - 1)).borderBottom = '1px solid #dfdfdf';
					}
				}
				if (this.fileRows == 0) {
					e.$s(goodEditor.obj + '_file_info').display = 'none';
				}
			}
		}
	}
}
//</script>
//
