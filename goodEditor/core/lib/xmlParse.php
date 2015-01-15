<?php
// 모든 플러그인에 대한 xml 파일 정보를 리턴
function getAllPluginInfo($plugin_dir)
{
	$xmlData = new xmlParse();

	$_plugin = array();
	$handle = dir($plugin_dir);
	while ($plugin_name = $handle->read())
	{
		switch($plugin_name)
		{
			case '.':
			case '..':
				break;
			default:
				$plugin_full_path = $plugin_dir.'/'.$plugin_name;

				//$plugin_name = substr($plugin_name, 3, strlen($plugin_name) - 3);

				$_plugin[$plugin_name] = array();
				$_plugin[$plugin_name]['error'] = '';

				// plugin 검색
				if (is_dir($plugin_full_path))
				{
					// 모듈 정보 및 기타 모듈 기능 정보 xml 파일 경로 지정
					$infoXmlPath = $plugin_full_path.'/config/info.xml';
					$moduleXmlPath = $plugin_full_path.'/config/module.xml';
					// 모듈 정보 파싱
					if (file_exists($infoXmlPath))
					{
						$xmlStr = file_get_contents($infoXmlPath);
						$xmlObj = $xmlData->parse($xmlStr);
						$_plugin[$plugin_name]['info'] = $xmlObj;
						$_plugin[$plugin_name]['info']->error = '';
					}
					else
					{
						$_plugin[$plugin_name]['info']->error = $infoXmlPath.' is not find!!';
					}

					// 모듈 기능에 관한 정보 파싱
					if (file_exists($moduleXmlPath))
					{
						$xmlStr = file_get_contents($moduleXmlPath);
						$xmlObj = $xmlData->parse($xmlStr);
						$_plugin[$plugin_name]['module'] = $xmlObj;
						$_plugin[$plugin_name]['module']->error = '';
					}
					else
					{
						$_plugin[$plugin_name]['module']->error = $moduleXmlPath.' is not find!!';
					}
				}
				else
				{
					// 모듈 정보 로딩 실패
					$_plugin[$plugin_name]->error = $plugin_full_path.' is not directory!!';
				}
				break;
		}
	}
	$handle->close();

	return $_plugin;
}

// module.xml 정보 파싱
function setXmlModuleData($plugin_dir, &$output, &$selectTap, &$selectTapName)
{
	// 설치된 모든 모듈 정보 로드
	$pluginArr = getAllPluginInfo($plugin_dir);

	$tapIndex = 0;
	$pluginList = '';
	$_pluginArr = array();
	foreach ($pluginArr as $k=>$v)
	{
		// Setting Tap
		if ($v['info']->error != '')
		{
			$tapTitle = '';
		}
		else
		{
			$_pluginArr[] = $k;

			$tapTitle = $v['info']->childNodes['info']->childNodes['plugin']->childNodes['title']->body;
			$tapText = $v['info']->childNodes['info']->childNodes['plugin']->childNodes['description']->body;

			$output .= "this.createTap(".$tapIndex.", '".$k."', '".$tapTitle."', '".$tapText."');\r\n";

			if ($v['module']->error == '')
			{
				foreach ($v['module']->childNodes['module']->childNodes['plugin'] as $vv)
				{
					$pCallback = $vv->attrs['CALLBACK'];
					if ($pCallback != '')
					{
						$pTitle		= $vv->childNodes['title']->body;
						$pDesc		= $vv->childNodes['description']->body;
						$pAction	= $vv->attrs['ACTION'];
						$pShowDesc	= $pAction;
						// 플러그인 버튼 등록
						$output .= "this.insertTitleButton('".$pCallback."', '".$pTitle."', '".$pDesc."', null, ".$pAction.", ".$pShowDesc.");\r\n";

						// 해당 Javascript File Include
						if (file_exists($plugin_dir.'/'.$k.'/'.$pCallback.'.js'))
						{
							include $plugin_dir.'/'.$k.'/'.$pCallback.'.js';
						}
					}
					else
					{
						// 공백 출력(구분선)
						$output .= "this.insertTitleButton('&nbsp;', '', '', null, false, false);\r\n";
					}
				}
			}
			$tapIndex++;
		}
	}
	// 플러그인 목록
	return "'".implode("','", $_pluginArr)."'";
}
?>
