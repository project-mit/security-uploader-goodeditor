/**
 * @class	productEditor
 * @author	M_FireFox (http://www.wscsx.com/)
 * @brief	productEditor 클래스 선언
 **/
function productEditor()
{
	this.version = '1.1.1';

	this.object = [];
	this.btnObject = [];
	this.idx = 0;

	this.listTop = 0;
}

/**
 * @brief	productEditor 생성 객체 설정
 * @param	document object 객체, 다수 설정가능
 **/
productEditor.prototype.setObject = function(object)
{
	if (typeof object.length != 'undefined')
	{
		for(var i = 0; i < object.length; i++)
		{
			this.object[this.idx] = object[i];
			this.idx++;
		}
	}
	else
	{
		this.object[this.idx] = object;
		this.idx++;
	}
}

/**
 * @brief	productEditor로 변환
 **/
productEditor.prototype.action = function()
{
	for (var i = 0; i < this.idx; i++)
	{
		this.layout(i);
	}
}

/**
 * @brief	에디터 레이아웃 그리기
 * @param	number (productEditor key)
 **/
productEditor.prototype.layout = function(k)
{
	swf_file.uploadListObject(k);

	// className Setting
	this.object[k].className = 'p_object';

	// list
	var self = this;
	var listArea = e.$c('div');
		listArea.className = 'p_list';
		var btnObject = e.$c('div');
			btnObject.className = 'p_list_upload';
			swf.setParams('_idx=' + k + '&upload_url=' + swf_file.uploadURL + '&cross_domain=' + swf_file.crossDomain + '&format_desc=' + swf_file.formatDesc + '&format_exten=' + swf_file.formatExten);
			btnObject.innerHTML = swf.add('upload', swf_file.baseRoot + 'swf/upload.swf', 100, 30);
		var viewDiv = e.$c('div');
			viewDiv.className = 'p_list_upload_btn_bg';
			var viewBtn = e.$c('button');
				viewBtn.className = 'button';
				viewBtn.innerHTML = '업로드';
			viewDiv.appendChild(viewBtn);

		var upBtn = e.$c('button');
			upBtn.className = 'button_2';
			upBtn.onclick = function()
			{
				if (self.listTop > 0) self.listTop -= 76;
				var oDiv = e.$g('productEditor_' + k + '_list').style.marginTop = '-' + self.listTop + 'px';
			}
			upBtn.innerHTML = '';

		var imgListArea = e.$c('div');
			imgListArea.className = 'p_list_list';
			var imgList = e.$c('div');
				imgList.id = 'productEditor_' + k + '_list';
			imgListArea.appendChild(imgList);

		var downBtn = e.$c('button');
			downBtn.className = 'button_2';
			downBtn.onclick = function()
			{
				if ((self.listTop + 76) <= ((swf_file.fileRows - 1) * 76)) self.listTop += 76;
				var oDiv = e.$g('productEditor_' + k + '_list').style.marginTop = '-' + self.listTop + 'px';
			}
			downBtn.innerHTML = '';

		listArea.appendChild(viewDiv);
		listArea.appendChild(btnObject);
		listArea.appendChild(upBtn);
		listArea.appendChild(imgListArea);
		listArea.appendChild(downBtn);

	// editor
	var editArea = e.$c('div');
		editArea.id = 'productEditor_' + k + '_edit';
		editArea.className = 'p_edit';
		// 툴바 영역
		var editToolObj = e.$c('div');
			editToolObj.id = 'p_edit_' + k + '_tool';
			editToolObj.className = 'p_edit_tool';
		// 수정 영역
		var editContentArea = e.$c('div');
			editContentArea.id = 'p_edit_' + k + '_edit';
			editContentArea.className = 'p_edit_edit';
		editArea.appendChild(editToolObj);
		editArea.appendChild(editContentArea);

	this.object[k].appendChild(listArea);
	this.object[k].appendChild(editArea);

	// 에디터 툴바 버튼 등록
	this.setToolbar(k);
}

/**
 * @brief		에디터에 툴바 버튼들을 설정후 출력
 * @param		number (productEditor key)
 **/
productEditor.prototype.setToolbar = function(k)
{
	var self = this;
	var obj = {};

	/**
	 * @brief 본문삽입 버튼 셋팅
	 **/
	obj = {
		id : 'editor_insert_' + k,
		className : 'button',
		innerHTML : '<strong>본문삽입</strong>',
		disabled : true,
		style : {
			'styleFloat' : 'left',
			'cssFloat' : 'left',
			'margin' : '1px 2px',
			'width' : '100px'
		},
		onclick : function(){
			for (var i = 0; i < swf_file.fileidx.length; i++)
			{
				var filename = swf_file.fileidx[i];
				var oTBounds = e.getBounds('p_edit_img_' + k + '_' + filename);
				var iData = '<img src="' + swf_file.imgRoot + 'upload/' + filename + '" alt="' + filename + '" style="width:' + oTBounds.width + 'px; height:' + oTBounds.height + 'px;" /><br />';

				var textObj = opener.document.getElementById(opener.goodEditor.obj);
				var ifrmObj = opener.document.getElementById(opener.goodEditor.obj + '_iframe');

				// 이미지 본문 삽입
				textObj.value = textObj.value + iData;

				opener.goodEditor.editor.setContents(textObj, ifrmObj);
				// 에디터 파일 업로드 목록에 추가
				opener.goodEditor.upload.addList(filename, getMBtoKB(swf_file.filesize[filename] + ' B'), 'image');
			}
			// 윈도우창 닫기
			window.close();
		}
	};
	this.setToolButton(obj);

	/**
	 * @brief 워터마크 버튼 셋팅
	 **/
	obj = {
		id : 'editor_mask_' + k,
		className : 'button',
		innerHTML : '워터마크',
		style : {
			'styleFloat' : 'left',
			'cssFloat' : 'left',
			'margin' : '1px 2px',
			'width' : '100px'
		},
		onclick : function(){
		}
	};
	//this.setToolButton(obj);

	/**
	 * @brief 에디터 종료 버튼 셋팅
	 **/
	obj = {
		id : 'editor_close_' + k,
		className : 'button',
		innerHTML : '<span style="color:#c00; font-weight:bold; font-size:12px;">X</span> 에디터 닫기',
		style : {
			'styleFloat' : 'right',
			'cssFloat' : 'right',
			'margin' : '1px 2px',
			'width' : '110px',
			'border' : 0
		},
		onclick : function(){
			// 이곳에 AJAX로 업로드 한 파일을 제거하는 알고리즘을 추가 합니다.

			// 윈도우창 닫기
			window.close();
		}
	};
	this.setToolButton(obj);

	// 등록한 버튼 출력
	this.printToolButton(k);
}

/**
 * @brief		에디터 툴바에 버튼 추가
 * @param		object
 **/
productEditor.prototype.setToolButton = function(obj)
{
	this.btnObject[this.btnObject.length] = [];
	for(var k in obj)
	{
		this.btnObject[this.btnObject.length - 1][k] = obj[k];
	}
}

/**
 * @brief		등록한 툴바 버튼들을 출력
 * @param		number (productEditor key)
 **/
productEditor.prototype.printToolButton = function(k)
{
	var obj = null;
	var oBtn = null;
	for(var i = 0; i < this.btnObject.length; i++)
	{
		obj = this.btnObject[i];
		oBtn = e.$c('button');
		for(var kn in obj)
		{
			if (kn == 'style')
			{
				for(var kk in obj.style)
				{
					oBtn.style[kk] = obj.style[kk];
				}
			}
			else
			{
				eval('oBtn.' + kn + ' = obj[kn]');
			}
		}

		e.$g('p_edit_' + k + '_tool').appendChild(oBtn);
	}
}

/**
 * @namespace	swf_file
 * @brief		멀티 파일업로드 관련 SWF파일 제어
 **/
var swf_file = {
	// 멀티 업로드 SWF의 고유 값 인식을 위한 Index 키
	key : 0,
	// 전체 업로드 파일수
	fileRows : 0,
	// productEditor BaseDir path
	baseRoot : '',
	// productEditor image upload (php, jsp, asp, asp.net, aspx, ...) action page
	uploadURL : '',
	// crossdomain.xml 경로 설정
	crossDomain : '',
	// 이미지 경로
	imgRoot : '',
	// 파일 크기
	filesize : [],
	// 파일 업로드가능 확장자 설명 문구
	formatDesc : '',
	// 업로드 가능한 확장자
	formatExten : '',

	/**
	 * @brief	멀티 업로드 미리보기 목록 idx 키 초기화
	 *			플래시 실행시 단 한번만 실행되어야 한다.
	 * @param	number
	 **/
	uploadListObject : function(k)
	{
		this.fileidx = [];
		this.filesize = [];
		this.fileRows = 0;
		this.key = k;

		this.baseRoot = getJsBasePath() + 'plugin/fileUpload/lib/';
		this.imgRoot = getJsBasePath();
		this.crossDomain = this.baseRoot + 'crossdomain.xml';
		this.uploadURL = this.baseRoot + 'upload.php';
		this.formatDesc = 'Image files (*.jpg, *.jpeg, *.gif, *.png)';
		this.formatExten = '*.jpg; *.jpeg; *.gif; *.png';
	},

	/**
	 * @brief	업로드 실패시 오류 출력
	 * @param	string 오류 내용
	 **/
	uploadError : function(errstr)
	{
		alert(errstr);
	},

	/**
	 * @brief	여러개의 파일을 선택하였을시 실행
	 * @param	string 파일이름
	 **/
	uploadSelected : function(filename)
	{
		if (!this.filesize[filename])
		{
			// 파일 index 번호 저장
			this.fileidx[this.fileidx.length] = filename;
		}

		if (!e.$g('p_list_' + this.key + '_' + filename))
		{
			// 새로운 이미지 업로드
			var divObj = e.$c('div');
				divObj.id = 'p_list_' + this.key + '_' + filename;
				divObj.className = 'p_list_progress_body';
				var divPsnt = e.$c('div');
					divPsnt.className = 'p_list_progress_psnt';
				divObj.appendChild(divPsnt);
			e.$g('productEditor_' + this.key + '_list').appendChild(divObj);
		}
		else
		{
			// 이미 존재하는 이미지를 재 업로드시 이미지 갱신
			var divPsnt = e.$c('div');
				divPsnt.className = 'p_list_progress_psnt';
			e.$g('p_list_' + this.key + '_' + filename).innerHTML = '';
			e.$g('p_list_' + this.key + '_' + filename).appendChild(divPsnt);
			if (confirm('현 이미지를 재 업로드 하실경우 현재 수정중이신 정보가 손실 될 수 있습니다.'))
			{
				// 이미지 수정 정보 갱신
				e.$g('p_edit_' + this.key + '_' + filename).innerHTML = '<table border="0" cellpadding="0" cellspacing="0" style="width:100%; height:100%;">' +
																		'<tr><td align="center" valign="center" style="position:relative;">' +
																		'<div style="position:relative; overflow:visible;">' +
																		'<img id="p_edit_img_' + this.key + '_' + filename + '" src="' + this.imgRoot + 'upload/' + filename + '" alt="' + filename + '" style="width:80%;" />' +
																		'</div>' +
																		'</td></tr>' +
																		'</table>';
				// 재 업로드한 이미지로 수정화면 전환
				this._uploadModify(this.key, filename);
			}
		}
		// get filerows
		this.fileRows++;
	},

	/**
	 * @brief	현재 파일 업로드 진행상황을 표시
	 * @param	string 파일이름
	 * @param	number 현재까지 업로드된 byte
	 * @param	number 총 파일 업로드 byte
	 **/
	uploadProgress : function(filename, nowPsnt, totalPsnt)
	{
		// 파일 크기 저장
		this.filesize[filename] = totalPsnt;

		// 파일 업로드 상태 출력
		e.$g('p_list_' + this.key + '_' + filename).getElementsByTagName('div')[0].innerHTML =	'<table border="0" cellpadding="0" cellspacing="0" style="width:100%; height:100%;">' +
																								'<tr><td align="center" valign="center">' +
																									Math.round(nowPsnt / totalPsnt * 100) + '%' +
																								'</td></tr>' +
																								'</table>';
		// 업로드 progress bar 출력
		e.$g('p_list_' + this.key + '_' + filename).getElementsByTagName('div')[0].style.width = Math.round(nowPsnt / totalPsnt * 100) + '%';
	},

	/**
	 * @brief	업로드 완료시 실행
	 * @param	string 파일이름
	 **/
	uploadComplete : function(filename)
	{
		// 파일 업로드 성공시 본문삽입 기능 활성화
		e.$g('editor_insert_' + swf_file.key).disabled = false;

		var data =	'<a href="#" onclick="return swf_file._uploadModify(' + this.key + ', \'' + filename + '\');">' +
					'<img src="' + this.imgRoot + 'upload/' + filename + '" alt="' + filename + '" style="width:100px; height:75px;" />' +
					'</a>';
		// 0.2초후에 목록 미리보기에 추가 및 수정 영역 생성
		setTimeout(function(){
			e.$g('p_list_' + swf_file.key + '_' + filename).innerHTML = data;

			// 새로운 수정영역 생성
			var editObj = e.$c('div');
				editObj.id = 'p_edit_' + swf_file.key + '_' + filename;
				editObj.className = 'p_edit_area';
				editObj.innerHTML = '<table border="0" cellpadding="0" cellspacing="0" style="width:100%; height:100%;">' +
									'<tr><td align="center" valign="center" style="position:relative;">' +
									'<div style="position:relative;">' +
									'<img id="p_edit_img_' + swf_file.key + '_' + filename + '" src="' + swf_file.imgRoot + 'upload/' + filename + '" alt="' + filename + '" style="width:80%;" />' +
									'</div>' +
									'</td></tr>' +
									'</table>';
			e.$g('p_edit_' + swf_file.key + '_edit').appendChild(editObj);

			// 이미지 리사이징
			size('p_edit_img_' + swf_file.key + '_' + filename, 600, 400);
		}, 200);
	},

	/**
	 * @brief	미리보기 목록의 이미지 클릭시 실행
	 * @param	string 파일이름
	 **/
	_uploadModify : function(k, filename)
	{
		// zIndex = 5 : 갱신
		var oDivEdit = e.$g('productEditor_' + this.key + '_edit').getElementsByTagName('div');
		for (var i = 0; i < oDivEdit.length; i++)
		{
			if (oDivEdit[i].className == 'p_edit_area top')
			{
				oDivEdit[i].className = 'p_edit_area';
			}
		}
		e.$g('p_edit_' + this.key + '_' + filename).className = 'p_edit_area top';
		return false;
	}
};

/**
 * @brief	이미지 리사이징 정보 출력 함수
 **/
function _debug(o)
{
	var oTBounds = e.getBounds(o.id);
	var debug = e.$g('debug' + resize.sizeIndex[o.id]);
		debug.style.display = 'block';
		debug.style.top = oTBounds.top + 'px';
		debug.style.left = oTBounds.left + 'px';
		debug.innerHTML =	'W : <strong>' + Math.round(oTBounds.width) + '</strong>' +
							'&nbsp;&nbsp;&nbsp;' +
							'H : <strong>' + Math.round(oTBounds.height) + '</strong>';
}

/**
 * @brief	이미지 리사이징 함수
 **/
function size(objId, w, h)
{
	var oTBounds = e.getBounds(objId);
	if (oTBounds.width > w) e.$g(objId).style.width = w + 'px';
	if (oTBounds.height > h) e.$g(objId).style.height = h + 'px';

	// w = 가로길이, h = 세로길이
	// w, h 수정가능
	resize.setResize(objId);
	//resize.setResizeType('w');
	//resize.setResizeType('h');
	resize.setResizeWidth(w);
	resize.setResizeHeight(h);

	resize.startFunction(_debug);
	resize.playFunction(_debug);
	resize.exitFunction(_debug);

	if (e.$g('debug' + resize.sizeIndex[objId]) == null)
	{
		// status
		var statusArea = e.$c('div');
			statusArea.id = 'debug' + resize.sizeIndex[objId];
			statusArea.className = 'p_status';

		e.$g(objId).parentNode.appendChild(statusArea);

		e.style.alpha('debug' + resize.sizeIndex[objId], 50);
	}
}

// 드래그 방지
e.noDrag(true);
