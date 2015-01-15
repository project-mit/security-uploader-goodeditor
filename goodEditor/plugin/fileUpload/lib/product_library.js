// 기본 객체관련 NameSpace
//
// 알림 :	아래의 e 네임스페이스는 아래의 모든 라이브러리에서 사용되는
//			가장 기본적인 필수 라이브러리 입니다.
var e = {
	// IE 버젼별 체크
	//
	// 사용 : e.isIE([int]);
	// 예) e.isIE(567); // IE 5,6,7버젼일 경우 true
	isIE : function(str)
	{
		var ieCheck = navigator.appVersion;
		var addVer = (typeof str != 'undefined')?' [' + str + ']':'';
		var ieCheckReg = null;
		eval('ieCheckReg = ieCheck.replace(/MSIE' + addVer + '/)');
		if (ieCheckReg != ieCheck)
		{
			ieCheck = null;
			addVer = null;
			ieCheckReg = null;

			return true;
		}
		else
		{
			ieCheck = null;
			addVer = null;
			ieCheckReg = null;

			return false;
		}
	},

	// createElement
	$c : function(o)
	{
		return document.createElement(o);
	},

	// getElementById - Style Option
	$s : function(o)
	{
		if ( typeof(e.$g(o)) != 'undefined' )
		{
			return e.$g(o).style;
		}
		else
		{
			return false;
		}
	},

	// getElementById
	$g : function(o)
	{
		return document.getElementById(o);
	},

	// getElementsByTagName
	$gTn : function(o)
	{
		return document.getElementsByTagName(o);
	},

	// getElementsByName
	$gNn : function(o)
	{
		return document.getElementsByName(o);
	},

	// depulicate Element
	// 해당 객체를 복사
	$cp : function(o, newId, rtn)
	{
		var copyObj = o.cloneNode(true);
			copyObj.id = newId;

		try
		{
			if (typeof rtn == 'undefined')
				o.parentNode.appendChild(copyObj);
			else
				return copyObj;
		}
		finally
		{
			copyObj = null;
		}
	},

	// removeElement
	// 해당 객체를 제거
	$d : function(o)
	{
		var obj = e.$g(o);
		if ( obj )
		{
			obj.parentNode.removeChild(obj);
		}

		obj = null;
	},

	// 해당 객체의 style옵션을 숫자로 리턴
	getPx : function(obj, opt, pdata)
	{
		return Number(obj.style[opt].replace(pdata, ''));
	},

	// 해당 객체의 offsetX(Y, Width, Height)을 리턴하는 함수
	getBounds : function(objId){
		var tag = e.$g(objId);
		var ret = new Object();

		// IE 5, 6, 7 버젼에 따라 다른 top, left 값 조절
		var nIE = 0;
		if (e.isIE(567) == true)
			nIE = 2;

		var rect = null;
		var box = null;
		if (tag.getBoundingClientRect)
		{
			//if( navigator.appVersion.indexOf("MSIE 7") > -1)
			rect = tag.getBoundingClientRect();
			ret.left = rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft);
			ret.top = rect.top + (document.documentElement.scrollTop || document.body.scrollTop) - nIE;
			ret.width = rect.right - rect.left - nIE;
			ret.height = rect.bottom - rect.top;
		}
		else
		{
			box = document.getBoxObjectFor(tag);
			ret.left = box.x;
			ret.top = box.y;
			ret.width = box.width;
			ret.height = box.height;
		}

		tag = null;
		nIE = null;
		rect = null;
		box = null;

		return ret;
	},

	// No Selected, Drag, ContextMenu...
	noDrag : function(v)
	{
		if (v == true)
		{
			document.oncontextmenu	= new Function ("return false");
			document.ondragstart	= new Function ("return false");
			document.onselectstart	= new Function ("return false");
			setTimeout(function(){ e.noDrag(true); }, 1000);
		}
	},

	// removeEvent
	removeEvent : function(obj, type, fn)
	{
		if (obj.removeEventListener)
			obj.removeEventListener(type, fn, false);
		else if(obj.detachEvent)
			obj.detachEvent('on' + type, fn);
	},

	// addEvent
	event : function(obj, type, fn)
	{
		if (obj.addEventListener)
			obj.addEventListener(type, fn, false);
		else if (obj.attachEvent)
			obj.attachEvent('on' + type, fn);
	},

	// style 관련 Namespace
	style :
	{
		// 투명도 설정
		alpha : function(obj, alp)
		{
			var o = e.$s(obj);

			o.filter = 'alpha(opacity=' + alp + ')';
			o.opacity = (alp / 100);
			o.MozOpacity = (alp / 100);

			o = null;
		}
	}
};

// 드래그 객체관련 Namespace
//
// 알림 :
//		아래 드래그 함수는 단지 드래그의 위치인 CSS의 TOP, LEFT 값 만을 변경하므로
//		기타 POSITION등 필요 옵션을 사용자가 직접 객체에 선언하셔야 합니다.
var drag = {
	// 드래그 객체 인덱스
	nIndex : -1,
	// 드래그 객체
	dragObj : new Array(),
	// 해당 드래그 객체의 인덱스
	dragIndex : new Array(),
	// 드래그 좌표
	dragData : new Array(),
	// 드래그 상태
	dragState : new Array(),
	// 드래그 영역 객체
	areaObj : new Array(),
	// 드래그 이동 제한 영역 객체
	moveAreaObj : new Array(),
	// 드래그 관련 함수 저장
	dragFunc : new Array(),
	// 드래그 관련 환경변수
	dragConfig : new Array(),
	// 드래그 시작 X축 제한영역 관련변수
	dragXData : new Array(),
	// 드래그 시작 Y축 제한영역 관련변수
	dragYData : new Array(),

	// 움직일 방향 설정
	//
	// 사용 : drag.setMove(bool, bool);
	setMove : function(bXmove, bYmove)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.setMove() 함수를 사용하기 전에 drag.setDrag() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		this.dragConfig[obj] = new Array();
		this.dragConfig[obj]['move_x'] = bXmove;
		this.dragConfig[obj]['move_y'] = bYmove;

		obj = null;
	},

	// 이동시킬 객체를 설정
	//
	// 사용 : drag.setDrag(string);
	setDrag : function(obj)
	{
		var o = e.$g(obj);
		// 객체가 존재하지 않을 경우
		if (o == null)
		{
			alert('drag.setDrag() : `' + obj + '` 객체를 찾을 수 없습니다.');
			return false;
		}

		// drag 인덱스 증가
		this.nIndex++;
		// drag 객체 object 저장
		this.dragObj[this.nIndex] = obj;
		this.dragIndex[obj] = this.nIndex;

		// drag 시작
		this.dragStart(o);

		o = null;
	},

	// 객체를 이동할 영역을 설정
	//
	// 사용 : drag.setArea(string);
	setArea : function(objId)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.setArea() 함수를 사용하기 전에 drag.setDrag() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		// area 객체 object 저장
		// 객체가 존재하지 않을 경우
		var o = e.$g(objId);
		if (o == null)
		{
			alert('drag.setArea() : `' + objId + '` 객체를 찾을 수 없습니다.');
			return false;
		}
		this.areaObj[obj] = objId;
	},

	// 해당 객체 안에서만 이동이 가능하도록 영역을 설정
	//
	// 사용 : drag.setMoveArea(string);
	setMoveArea : function(objId)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.setMoveArea() 함수를 사용하기 전에 drag.setDrag() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		this.moveAreaObj[obj] = objId;
	},

	// 해당 영역 안에서만 이동이 가능하도록 X축 영역을 설정
	//
	// 사용 : drag.setXMoveArea(int, int);
	setXMoveArea : function(nStartX, nExitX)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.setXMoveArea() 함수를 사용하기 전에 drag.setDrag() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		this.dragXData[obj] = new Array();
		this.dragXData[obj]['start']	= nStartX;
		this.dragXData[obj]['exit']		= nExitX;
	},

	// 해당 영역 안에서만 이동이 가능하도록 Y축 영역을 설정
	//
	// 사용 : drag.setYMoveArea(int, int);
	setYMoveArea : function(nStartY, nExitY)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.setYMoveArea() 함수를 사용하기 전에 drag.setDrag() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		this.dragYData[obj] = new Array();
		this.dragYData[obj]['start']	= nStartY;
		this.dragYData[obj]['exit']		= nExitY;
	},

	// 드래그가 시작될때 실행하는 함수 등록
	//
	// 사용 : drag.startFunction(function);
	startFunction : function(func)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.startFunction() 함수를 사용하기 전에 drag.setDrag() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		this.dragFunc['start' + obj] = func;
	},

	// 드래그가 실행중일때 실행하는 함수 등록
	//
	// 사용 : drag.playFunction(function);
	playFunction : function(func)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.playFunction() 함수를 사용하기 전에 drag.setDrag() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		this.dragFunc['play' + obj] = func;
	},

	// 드래그가 종료될때 실행하는 함수 등록
	//
	// 사용 : drag.exitFunction(function);
	exitFunction : function(func)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.exitFunction() 함수를 사용하기 전에 drag.setDrag() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		this.dragFunc['exit' + obj] = func;
	},

	// 해당 객체가 영역위에 올라왔을때 실행하는 함수 등록
	//
	// 사용 : drag.areaFunction(function);
	areaFunction : function(func)
	{
		var obj = this.dragObj[this.nIndex];
		if (obj == null)
		{
			alert('drag.areaFunction() 함수를 사용하기 전에 drag.setDrag() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		this.dragFunc['area' + obj] = func;
	},

	// 드래그 시작 함수
	//
	// 사용 : drag.dragStart(object);
	dragStart : function(obj)
	{
		// 이벤트 등록
		e.event(obj, 'mousedown', drag.d_start);
	},

	// 드래그 실행 함수
	//
	// 사용 : drag.dragPlay(object);
	dragPlay : function(obj)
	{
		// 이벤트 등록
		e.event(document.documentElement, 'mousemove', function(event){ drag.d_play(event, obj); });
	},

	// 드래그 종료 함수
	//
	// 사용 : drag.dragExit(object);
	dragExit : function(obj)
	{
		// 이벤트 등록
		e.event(document.documentElement, 'mouseup', function(event){ drag.d_exit(event, obj); });
	},

	// 드래그 시작 실행 함수
	//
	// 사용 : drag.d_start([event 객체]);
	d_start : function(event)
	{
		if (e.isIE() == true)
			var obj = event.srcElement;
		else
			var obj = event.target;

		var data = e.getBounds(obj.id);

		drag.dragState[obj.id] = 'play';
		if (drag.dragData[obj.id] == null)
			drag.dragData[obj.id] = new Object();
		drag.dragData[obj.id].x = (event.clientX - data.left);
		drag.dragData[obj.id].y = (event.clientY - data.top);
		if (obj.style.position == 'relative' && drag.dragData[obj.id].d == null)
			drag.dragData[obj.id].d = data;

		// 드래그 이벤트 등록
		drag.dragPlay(obj);
		drag.dragExit(obj);

		// 시작 이벤트시 실행하는 함수 실행
		if (typeof drag.dragFunc['start' + obj.id] != 'undefined')
			drag.dragFunc['start' + obj.id](obj);
	},

	// 드래그 실행중일때 실행 함수
	//
	// 사용 : drag.d_play(event 객체, object);
	d_play : function(event, obj)
	{
		if (drag.dragState[obj.id] == 'play')
		{
			var x = event.clientX;
			var y = event.clientY;
			var data = drag.dragData[obj.id];
			var config = drag.dragConfig[obj.id];

			// X, Y 축의 움직임 설정 - 기본값
			if (typeof drag.dragConfig[obj.id] == 'undefined')
			{
				config = new Array();
				config['move_x'] = true;
				config['move_y'] = true;
			}

			// Y축 움직임 설정
			if (config['move_y'] == true)
			{
				config.top = obj.style.top;
				// position 속성에 따른 top 값 설정
				var top = (y - data.y);
				if (obj.style.position == 'relative')
					top = (y - data.d.top - data.y);

				obj.style.top = top + 'px';

				top = null;
			}

			// X축 움직임 설정
			if (config['move_x'] == true)
			{
				config.left = obj.style.left;
				// position 속성에 따른 left 값 설정
				var left = (x - data.x);
				if (obj.style.position == 'relative')
					left = (x - data.d.left - data.x);

				obj.style.left = left + 'px';

				left = null;
			}

			// 영역에서 움직임 관련 설정 초기화
			if (config['move_area_x'] != true)
				config['move_area_x'] = true;

			if (config['move_area_y'] != true)
				config['move_area_y'] = true;

			var bXArea = (drag.dragXData[obj.id] != null);
			var bYArea = (drag.dragYData[obj.id] != null);

			// drag.setMoveArea() 함수로 객체의 이동 영역을 지정한 경우
			if (drag.moveAreaObj[obj.id] != null)
			{
				// 드래그 객체가 지정된 영역 안에 있는지를 검사
				var oData = e.getBounds(obj.id);
				var mData = e.getBounds(drag.moveAreaObj[obj.id]);
				if (mData.left > oData.left || mData.left + mData.width < oData.left + oData.width)
					config['move_area_x'] = false;

				if (mData.top > oData.top || mData.top + mData.height < oData.top + oData.height)
					config['move_area_y'] = false;
			}

			// drag.setXMoveArea(), drag.setYMoveArea() 함수로 객체의 이동 영역을 지정한 경우
			if (bXArea == true || bYArea == true)
			{
				var mData = new Object();
				if (bXArea == true)
				{
					var sx = drag.dragXData[obj.id]['start'];
					var ex = drag.dragXData[obj.id]['exit'];

					// 드래그 객체가 지정된 영역 안에 있는지를 검사
					var oData = e.getBounds(obj.id);

					mData.left = sx;
					mData.width = ex - sx;

					if (mData.left > oData.left || mData.left + mData.width < oData.left + oData.width)
						config['move_area_x'] = false;

					sx = null;
					ex = null;
				}

				if (bYArea == true)
				{
					var sy = drag.dragYData[obj.id]['start'];
					var ey = drag.dragYData[obj.id]['exit'];

					// 드래그 객체가 지정된 영역 안에 있는지를 검사
					var oData = e.getBounds(obj.id);

					mData.top = sy;
					mData.height = ey - sy;

					if (mData.top > oData.top || mData.top + mData.height < oData.top + oData.height)
						config['move_area_y'] = false;

					sy = null;
					ey = null;
				}
			}

			// Y축의 움직임 복구
			if (config['move_y'] == true)
			{
				if (config['move_area_y'] == false)
				{
					if (mData != null && oData != null)
					{
						if (mData.top > oData.top)
							obj.style.top = mData.top + 'px';
						else if (mData.top + mData.height < oData.top + oData.height)
							obj.style.top = (mData.top + mData.height - oData.height) + 'px';
					}
					else
					{
						obj.style.top = config.top;
					}
				}
			}

			// X축의 움직임 복구
			if (config['move_x'] == true)
			{
				if (config['move_area_x'] == false)
				{
					if (mData != null && oData != null)
					{
						if (mData.left > oData.left)
							obj.style.left = mData.left + 'px';
						else if (mData.left + mData.width < oData.left + oData.width)
							obj.style.left = (mData.left + mData.width - oData.width) + 'px';
					}
					else
					{
						obj.style.left = config.left;
					}
				}
			}

			oData = null;
			mData = null;
			x = null;
			y = null;
			data = null;
			config = null;

			// 실행 이벤트시 실행하는 함수 실행
			if (typeof drag.dragFunc['play' + obj.id] != 'undefined')
				drag.dragFunc['play' + obj.id](obj);
		}
	},

	// 드래그 종료 실행 함수
	//
	// 사용 : drag.d_exit(event 객체, object);
	d_exit : function(event, obj)
	{
		if (drag.dragState[obj.id] == 'play')
		{
			drag.dragState[obj.id] = '';
			if (typeof drag.areaObj[obj.id] != 'undefined')
			{
				var areaData = e.getBounds(drag.areaObj[obj.id]);
				var dragData = e.getBounds(obj.id);
				// dragData
				var dx = dragData.left;
				var dX = dragData.left + dragData.width;
				var dy = dragData.top;
				var dY = dragData.top + dragData.height;
				// areaData
				var ax = areaData.left;
				var aX = areaData.left + areaData.width;
				var ay = areaData.top;
				var aY = areaData.top + areaData.height;

				if ((dy >= ay && dy <= aY && dx >= ax && dx <= aX) ||	// left		top
					(dY >= ay && dY <= aY && dX >= ax && dX <= aX) ||	// right	bottom
					(dY >= ay && dY <= aY && dx >= ax && dx <= aX) ||	// left		bottom
					(dy >= ay && dy <= aY && dX >= ax && dX <= aX))		// right	top
				{
					// 해당 객체가 영역위에 올라왔을때 실행하는 함수 실행
					if (typeof drag.dragFunc['area' + obj.id] != 'undefined')
					{
						drag.dragState[obj.id] = 'over';
						drag.dragFunc['area' + obj.id](obj);
					}
				}
			}

			// 종료 이벤트시 실행하는 함수 실행
			if (typeof drag.dragFunc['exit' + obj.id] != 'undefined')
				drag.dragFunc['exit' + obj.id](obj);
		}
	}
};

// 객체 크기조절 관련 Namespace
var resize = {
	// resize 객체 인덱스
	nIndex : -1,
	// resize 객체
	sizeObj : new Array(),
	// resize 객체의 인덱스
	sizeIndex : new Array(),
	// resize 객체의 상태
	sizeState : new Array(),
	// resize 관련 함수 저장
	sizeFunc : new Array(),
	// resize 가능한 최대 크기값
	maxSize : new Array(),
	// resize 관련 환경변수
	config : new Array(),

	// resize 객체 등록
	// width, height 의 크기를 모두 조절
	//
	// 사용 : resize.setResize(string);
	setResize : function(obj)
	{
		// 객체 존재여부 검사
		var o = e.$g(obj);
		if (o == null)
		{
			alert('resize.setResize() : `' + obj + '` 객체를 찾을 수 없습니다.');
			return false;
		}

		// 크기조절 객체등록
		this.nIndex++;
		this.sizeObj[this.nIndex] = obj;
		this.sizeIndex[obj] = this.nIndex;
		this.sizeState[obj] = 'ready';

		this.resizeStart(o);
		this.resizeExit(o);

		this.setResizeWidth(-1);
		this.setResizeHeight(-1);
	},

	// resize 크기조절 방식 설정
	// width, height 둘중 하나만 조절 가능하도록 하는 함수
	//
	// 사용 : resize.setResizeType(string);
	//				w 일때 가로만, h 일때 세로만 크기조절이 가능합니다.
	setResizeType : function(cType)
	{
		var obj = this.sizeObj[this.nIndex];
		if (obj == null)
		{
			alert('resize.setResizeType() 함수를 사용하기 전에 resize.setResize() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		this.config[obj] = new Array();
		this.config[obj]['sizeType'] = cType;
	},

	// resize 가능한 최대 width 값 설정
	//
	// 사용 : resize.setResizeWidth(int);
	setResizeWidth : function(nMaxSize)
	{
		var obj = this.sizeObj[this.nIndex];
		if (obj == null)
		{
			alert('resize.setResizeWidth() 함수를 사용하기 전에 resize.setResize() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		if (this.maxSize[obj] == null)
		{
			this.maxSize[obj] = new Array();
			this.maxSize[obj]['height'] = 0;
		}

		this.maxSize[obj]['width'] = nMaxSize;
	},

	// resize 가능한 최대 height 값 설정
	//
	// 사용 : resize.setResizeHeight(int);
	setResizeHeight : function(nMaxSize)
	{
		var obj = this.sizeObj[this.nIndex];
		if (obj == null)
		{
			alert('resize.setResizeHeight() 함수를 사용하기 전에 resize.setResize() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		if (this.maxSize[obj] == null)
		{
			this.maxSize[obj] = new Array();
			this.maxSize[obj]['width'] = 0;
		}

		this.maxSize[obj]['height'] = nMaxSize;
	},

	// resize 시작될때 실행하는 함수 등록
	//
	// 사용 : resize.startFunction(function);
	startFunction : function(func)
	{
		if (this.sizeObj[this.nIndex] == null)
		{
			alert('resize.startFunction() 함수를 사용하기 전에 resize.setResize() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		this.sizeFunc['start' + this.sizeObj[this.nIndex]] = func;
	},

	// resize 실행중일때 실행하는 함수 등록
	//
	// 사용 : resize.playFunction(function);
	playFunction : function(func)
	{
		if (this.sizeObj[this.nIndex] == null)
		{
			alert('resize.playFunction() 함수를 사용하기 전에 resize.setResize() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		this.sizeFunc['play' + this.sizeObj[this.nIndex]] = func;
	},

	// resize 종료될때 실행하는 함수 등록
	//
	// 사용 : resize.exitFunction(function);
	exitFunction : function(func)
	{
		if (this.sizeObj[this.nIndex] == null)
		{
			alert('resize.exitFunction() 함수를 사용하기 전에 resize.setResize() 함수로 드래그 객체를 등록하여야 합니다.');
			return false;
		}

		this.sizeFunc['exit' + this.sizeObj[this.nIndex]] = func;
	},

	// resize 시작 이벤트 등록 함수
	//
	// 사용 : resize.resizeStart(object);
	resizeStart : function(obj)
	{
		e.event(obj, 'click', resize.r_start);
	},

	// resize 종료 이벤트 등록 함수
	//
	// 사용 : resize.resizeExit(object);
	resizeExit : function(obj)
	{
		e.event(document.documentElement, 'click', function(event){ resize.r_exit(event, obj); });
	},

	// 크기조절 종료 함수
	//
	// 사용 : resize.r_exit(event 객체, object);
	r_exit : function(event, obj)
	{
		if (resize.sizeState[obj.id] != 'ready')
		{
			var data = e.getBounds(obj.id);
			var nX = event.clientX + document.documentElement.scrollLeft;
			var nY = event.clientY + document.documentElement.scrollTop;
			var x = data.left;
			var y = data.top;
			var w = data.width;
			var h = data.height;
			var bClicked = (nX >= x && nX <= (x + w) &&
							nY >= y && nY <= (y + h));

			// 크기조절 객체이외의 영역을 클릭한 경우
			if (bClicked == false)
			{
				// 크기조절 관련 객체 제거
				e.$d(obj.id + '_reRight');
				e.$d(obj.id + '_reBottom');
				e.$d(obj.id + '_reBoth');

				// 상태 변경
				resize.sizeState[obj.id] = 'ready';

				// resize 종료시 실행
				if (typeof resize.sizeFunc['exit' + obj.id] != 'undefined')
					resize.sizeFunc['exit' + obj.id](obj);
			}
		}
	},

	// 크기조절 시작 함수
	//
	// 사용 : resize.r_start([event 객체]);
	r_start : function(event)
	{
		var obj = event.target;
		var fOpt = 'cssFloat';
		if (e.isIE() == true)
		{
			obj = event.srcElement;
			fOpt = 'styleFloat';
		}

		// 크기조절이 실행중인 상태일 경우
		if (resize.sizeState[obj.id] != 'play')
		{
			// 현재 상태
			resize.sizeState[obj.id] = 'play';

			var data = e.getBounds(obj.id);

			// 객체 크기 초기화
			obj.style.width = data.width + 'px';
			obj.style.height = data.height + 'px';

			// 크기 조절바 관련 함수 실행
			var sizeType = null;
			if (resize.config[obj.id] != null)
				sizeType = resize.config[obj.id]['sizeType'];

			// 가로만 크기 조절
			if (sizeType == 'w' || resize.config[obj.id] == null)
				resize.r_rightBar(obj, data, fOpt);

			// 세로만 크기조절
			if (sizeType == 'h' || resize.config[obj.id] == null)
				resize.r_bottomBar(obj, data, fOpt);

			// 가로 세로 크기 조절
			if (resize.config[obj.id] == null)
				resize.r_bothBar(obj, data, fOpt);

			// resize 시작시 실행
			if (typeof resize.sizeFunc['start' + obj.id] != 'undefined')
				resize.sizeFunc['start' + obj.id](obj);
		}
	},

	// 오른쪽 크기 조절바 생성
	//
	// 사용 : resize.r_rightBar(object, e.getBounds 객체, (styleFloat | cssFloat));
	r_rightBar : function(obj, data, fOpt)
	{
		if (e.$g(obj.id + '_reRight') == null)
		{
			// RightBar
			var RightReSize = e.$c('div');
			RightReSize.id = obj.id + '_reRight';
			if (resize.config[obj.id] == null)
			{
				RightReSize.style.borderBottom = 0;
			}
			else
			{
				data.height = data.height - 2;
			}
			RightReSize.style.width = 8 + 'px';
			RightReSize.style.height = data.height + 'px';
			RightReSize.style.top = data.top + 'px';
			RightReSize.style.left = data.left + data.width + 'px';
			RightReSize.className = 'reRight';
			//obj.style[fOpt] = 'left';
			obj.parentNode.appendChild(RightReSize);

			var maxWidth = resize.maxSize[obj.id]['width'];
			var rightData = e.getBounds(obj.id + '_reRight');

			// 드래그 관련 이벤트 설정
			drag.setDrag(obj.id + '_reRight');
			drag.setMove(true, false);
			if (maxWidth >= 0)
				drag.setXMoveArea(data.left, data.left + maxWidth + rightData.width);
			drag.startFunction(function(o) {
				resize.sizeState[obj.id] = 'x_resize_start';

				// 크기 조절중일떄 실행
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
			drag.playFunction(function(o) {
				resize.sizeState[obj.id] = 'x_resize_play';

				// 이동에 따른 크기 조절바의 가로/세로 길이 설정
				var odata = e.getBounds(o.id);
				var bobj = e.$g(obj.id + '_reBottom');
				var btobj = e.$g(obj.id + '_reBoth');
				var objData = e.getBounds(obj.id);

				// 객체 크기 조절
				var objWidth = (odata.left - objData.left);
				if (objWidth < 0)
				{
					objWidth = 0;
				}
				else if (objWidth > maxWidth && maxWidth >= 0)
				{
					objWidth = maxWidth;
				}

				obj.style.width = objWidth + 'px';
				objData = e.getBounds(obj.id);

				// 아래 / 오른쪽 - 아래 크기조절 바의 크기 / 위치 조절
				if (bobj != null)
				{
					bobj.style.width = objWidth + 'px';
					bobj.style.left = objData.left + 'px';
				}

				if (btobj != null)
					btobj.style.left = objData.left + objWidth + 'px';

				o.style.left = objData.left + objWidth + 'px';

				// 크기 조절중일떄 실행
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
			drag.exitFunction(function(o) {
				resize.sizeState[obj.id] = 'x_resize_exit';

				// 크기 조절중일떄 실행
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
		}
	},

	// 아래쪽 크기 조절바 생성
	//
	// 사용 : resize.r_bottomBar(object, e.getBounds 객체, (styleFloat | cssFloat));
	r_bottomBar : function(obj, data, fOpt)
	{
		if (e.$g(obj.id + '_reBottom') == null)
		{
			// BottomBar
			var BottomReSize = e.$c('div');
			BottomReSize.id = obj.id + '_reBottom';
			if (resize.config[obj.id] == null)
			{
				BottomReSize.style.borderRight = 0;
			}
			else
			{
				data.width = data.width - 2;
			}
			BottomReSize.style.width = data.width + 'px';
			BottomReSize.style.height = 8 + 'px';
			BottomReSize.style.top = data.top + data.height + 'px';
			BottomReSize.style.left = data.left + 'px';
			BottomReSize.className = 'reBottom';
			BottomReSize.innerHTML = '';
			obj.parentNode.appendChild(BottomReSize);

			var maxHeight = resize.maxSize[obj.id]['height'];
			var bottomData = e.getBounds(obj.id + '_reBottom');

			// 드래그 관련 이벤트 설정
			drag.setDrag(obj.id + '_reBottom');
			drag.setMove(false, true);
			// Y축 움직임 제한
			if (maxHeight >= 0)
				drag.setYMoveArea(data.top, data.top + maxHeight + bottomData.height);
			drag.startFunction(function(o) {
				resize.sizeState[obj.id] = 'y_resize_start';

				// 크기 조절중일떄 실행
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
			drag.playFunction(function(o) {
				resize.sizeState[obj.id] = 'y_resize_play';

				// 이동에 따른 크기 조절바의 가로/세로 길이 설정
				var odata = e.getBounds(o.id);
				var robj = e.$g(obj.id + '_reRight');
				var bobj = e.$g(obj.id + '_reBoth');
				var objData = e.getBounds(obj.id);

				// 객체 크기 조절
				var objHeight = (odata.top - objData.top);
				if (objHeight < 0)
				{
					objHeight = 0;
				}
				else if (objHeight > maxHeight && maxHeight >= 0)
				{
					objHeight = maxHeight;
				}

				obj.style.height = objHeight + 'px';
				objData = e.getBounds(obj.id);

				// 음수 일 경우 처리
				// 오른쪽 / 오른쪽 - 아래 크기조절 바의 크기 / 위치 조절
				if (robj != null)
				{
					robj.style.height = objHeight + 'px';
					robj.style.top = objData.top + 'px';
				}

				if (bobj != null)
					bobj.style.top = objData.top + objHeight + 'px';

				o.style.top = objData.top + objHeight + 'px';

				// 크기 조절중일떄 실행
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
			drag.exitFunction(function(o) {
				resize.sizeState[obj.id] = 'y_resize_exit';

				// 크기 조절중일떄 실행
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
		}
	},

	// 오른쪽 - 아래 크기 조절바 생성
	//
	// 사용 : resize.r_bothBar(object, e.getBounds 객체, (styleFloat | cssFloat));
	r_bothBar : function(obj, data, fOpt)
	{
		if (e.$g(obj.id + '_reBoth') == null)
		{
			// BothBar
			var BothReSize = e.$c('div');
			BothReSize.id = obj.id + '_reBoth';
			BothReSize.style.width = 9 + 'px';
			BothReSize.style.height = 9 + 'px';
			BothReSize.style.top = data.top + data.height + 'px';
			BothReSize.style.left = data.left + data.width + 'px';
			BothReSize.className = 'reBoth';
			obj.parentNode.appendChild(BothReSize);

			var maxWidth = resize.maxSize[obj.id]['width'];
			var maxHeight = resize.maxSize[obj.id]['height'];
			var bothData = e.getBounds(obj.id + '_reBoth');

			// 드래그 관련 이벤트 설정
			drag.setDrag(obj.id + '_reBoth');
			// X, Y축 크기 조절
			if (maxWidth >= 0)
				drag.setXMoveArea(data.left, data.left + maxWidth + bothData.width);
			if (maxHeight >= 0)
				drag.setYMoveArea(data.top, data.top + maxHeight + bothData.height);
			drag.startFunction(function(o) {
				resize.sizeState[obj.id] = 'xy_resize_start';

				// 크기 조절중일떄 실행
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
			drag.playFunction(function(o) {
				resize.sizeState[obj.id] = 'xy_resize_play';

				// 이동에 따른 크기 조절바의 가로/세로 길이 설정
				var odata = e.getBounds(o.id);
				var objData = e.getBounds(obj.id);
				var robj = e.$g(obj.id + '_reRight');
				var h = odata.top - objData.top;//e.getPx(o, 'top', 'px') - e.getPx(robj, 'top', 'px');
				var bobj = e.$g(obj.id + '_reBottom');
				var w = odata.left - objData.left;//e.getPx(o, 'left', 'px') - e.getPx(bobj, 'left', 'px');

				// 설정한 크기 이상으로는 조절 불가능 하도록
				if (h > maxHeight && maxHeight >= 0)
					h = maxHeight;
				else if (h < 0)
					h = 0;

				if (w > maxWidth && maxWidth >= 0)
					w = maxWidth;
				else if (w < 0)
					w = 0;

				// 가로, 세로값이 음수일때 처리
				// 오른쪽 / 아래 크기조절 바의 크기 / 위치 조절
				robj.style.height = h + 'px';
				bobj.style.width = w + 'px';

				// 이미지 크기 수정
				obj.style.width = w + 'px';
				obj.style.height = h + 'px';

				var objData = e.getBounds(obj.id);

				if (h >= 0)
				{
					bobj.style.top = objData.top + h + 'px';//o.style.top;
					bobj.style.left = objData.left + 'px';//o.style.left;
				}

				if (w >= 0)
				{
					robj.style.top = objData.top + 'px';//o.style.top;
					robj.style.left = e.getPx(bobj, 'left', 'px') + e.getPx(bobj, 'width', 'px') + 'px';//o.style.left;
				}

				o.style.top = objData.top + h + 'px';
				o.style.left = objData.left + w + 'px';

				// 크기 조절중일떄 실행
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
			drag.exitFunction(function(o) {
				resize.sizeState[obj.id] = 'xy_resize_exit';

				// 크기 조절중일떄 실행
				if (typeof resize.sizeFunc['play' + obj.id] != 'undefined')
					resize.sizeFunc['play' + obj.id](obj);
			});
		}
	}
};

// Ajax 관련 Namespace
var ajax = {
	// Create Ajax Object
	create : function()
	{
		try { return new ActiveXObject("Msxml2.XMLHTTP");    } catch(e) {} //IE6
		try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {} //IE5.5
		try { return new XMLHttpRequest();                   } catch(e) {} //IE7, Firefox
		return false;
	},

	// ajax.get(string[, function[, function]]);
	//
	// url : GET전송할 주소
	//		 예) index.html?get1=data1&get2=data2&get3=data3
	// playFunc : 실행할 함수
	//			- [생략가능] xmlhttp객체를 매개변수로 받습니다.
	// loadingFunc : 로딩중일때 실행하는 함수
	//			- [생략가능] xmlhttp객체를 매개변수로 받습니다.
	get : function(url, playFunc, loadingFunc)
	{
		var xmlhttp = this.create();
		var urlData = url.split('?');
		var sUrl = urlData[0];
		if (urlData[1] != null)
			var sData = '?' + urlData[1].split('&amp;').join('&');
		else
			var sData = '';

		xmlhttp.open('GET', sUrl + encodeURI(sData), true);
		xmlhttp.send(null);
		xmlhttp.onreadystatechange = function()
		{
			if(xmlhttp.readyState == '4')
			{
				if(xmlhttp.status == 200)
				{
					// xmlhttp.responseText
					if (typeof playFunc != 'undefined')
						playFunc(xmlhttp);
				}
			}
			else
			{
				// 로딩중 표시
				if (typeof loadingFunc != 'undefined')
					loadingFunc(xmlhttp);
			}
		};
	},

	// ajax.post(string[, function[, function]]);
	//
	// url : POST전송할 주소
	//		 예) index.html?get1=data1&get2=data2&get3=data3
	// playFunc : 실행할 함수
	//			- [생략가능] xmlhttp객체를 매개변수로 받습니다.
	// loadingFunc : 로딩중일때 실행하는 함수
	//			- [생략가능] xmlhttp객체를 매개변수로 받습니다.
	post : function(url, playFunc, loadingFunc)
	{
		var xmlhttp = this.create();
		var urlData = url.split('?');
		var sUrl = urlData[0];
		if (urlData[1] != null)
			var sData = urlData[1].split('&amp;').join('&');
		else
			var sData = '';

		xmlhttp.open('POST', sUrl, true);
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlhttp.send(encodeURI(sData));
		xmlhttp.onreadystatechange = function()
		{
			if(xmlhttp.readyState == '4')
			{
				if(xmlhttp.status == 200)
				{
					// xmlhttp.responseText
					if (typeof playFunc != 'undefined')
						playFunc(xmlhttp);
				}
			}
			else
			{
				// 로딩중 표시
				if (typeof loadingFunc != 'undefined')
					loadingFunc(xmlhttp);
			}
		};
	}
};

var swf = {
	params : '',
	addParams : '',
	addURL : '',
	// html code return
	add : function(id, src, w, h) {
		src += '?' + this.addURL;
		var str =	'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + w + '" height="' + h + '" id="' + id + '" align="middle">' +
					'	<param name="allowScriptAccess" value="always" />' +
					'	<param name="allowFullScreen" value="false" />' +
					'	<param name="movie" value="' + src + '" />' +
					'	<param name="quality" value="high" />' +
					'	<param name="wmode" value="transparent" />' +
					'	<param name="bgcolor" value="#ffffff" />' + this.params +
					'	<embed src="' + src + '" ' + this.addParams + 'quality="high" wmode="transparent" bgcolor="#ffffff" width="' + w + '" height="' + h + '" name="' + id + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />' +
					'</object>';
		return str;
	},

	// document object return
	// add <object>
	addObject : function(id, src, w, h)
	{
		var object = e.$c('object');
			object.setAttribute('classid', 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000');
			object.setAttribute('cidebase', 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0');
			object.setAttribute('width', w);
			object.setAttribute('height', h);
			object.setAttribute('align', 'middle');
			object.appendChild(this.setParam('allowScriptAccess', 'always'));
			object.appendChild(this.setParam('allowFullScreen', 'false'));
			object.appendChild(this.setParam('movie', src));
			object.appendChild(this.setParam('quality', 'high'));
			object.appendChild(this.setParam('wmode', 'transparent'));
			object.appendChild(this.setParam('bgcolor', '#ffffff'));
			object.appendChild(this.setEmbed(id, src, w, h));
		return object;
	},

	setParams : function(str)
	{
		this.addURL = str;
		this.addParams = '';
		this.params = '';
		var exVal = str.split('&');
		for(var i = 0; i < exVal.length; i++)
		{
			var exValex = exVal[i].split('=');
			var name = exValex[0];
			var value = exValex[1];

			this.params += '<param name="' + name + '" value="' + value + '" />';
			this.addParams += name + '="' + value + '" ';
		}
	},

	// add <param>
	setParam : function(k, v)
	{
		var param = e.$c('param');
			param.name = k;
			param.value = v;
		return param;
	},

	// add <embed>
	setEmbed : function(id, src, w, h)
	{
		var embed = e.$c('embed');
			embed.setAttribute('src', src);
			embed.setAttribute('quality', 'high');
			embed.setAttribute('wmode', 'transparent');
			embed.setAttribute('bgcolor', '#ffffff');
			embed.setAttribute('width', w);
			embed.setAttribute('height', h);
			embed.setAttribute('name', id);
			embed.setAttribute('align', 'middle');
			embed.setAttribute('allowScriptAccess', 'always');
			embed.setAttribute('allowFullScreen', 'false');
			embed.setAttribute('type', 'application/x-shockwave-flash');
			embed.setAttribute('pluginspage', 'http://www.macromedia.com/go/getflashplayer');
		return embed;
	}
};
