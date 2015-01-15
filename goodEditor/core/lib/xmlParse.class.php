<?php
// 2013-08-17 : PHP 구버전에서 iconv 함수 지원 안하는 문제점 수정
if (!function_exists('iconv'))
{
	function iconv($senc, $denc, $str)
	{
		return $str;
	}
}

class xmlParse {
	var $output = array();
	var $encode = 'UTF-8';

	function xmlParse($encode='UTF-8')
	{
		$this->encode = $encode;
	}

	function parse($input = '')
	{
		$this->output = array();

		$oParser = xml_parser_create($this->encode);
		xml_set_object($oParser, $this);
		// start, end callback function setting
		xml_set_element_handler($oParser, "_tagOpen", "_tagClosed");
		// body callback function setting
		xml_set_character_data_handler($oParser, "_tagBody");

		xml_parse($oParser, $input);
		xml_parser_free($oParser);

		if(!count($this->output)) return;
		$this->output = array_shift($this->output);

		return $this->output;
	}

	function _tagOpen($parser, $node_name, $attrs)
	{
		$obj = new stdClass();
		$obj->node_name = strtolower($node_name);
		$obj->attrs = $attrs;
		$obj->childNodes = array();

		array_push($this->output, $obj);
	}

	function _tagBody($parser, $body)
	{
		$this->output[count($this->output)-1]->body .= $body;
	}

	function _tagClosed($parser, $node_name)
	{
		$node_name = strtolower($node_name);
		$cur_obj = array_pop($this->output);
		$parent_obj = &$this->output[count($this->output)-1];

		if($parent_obj->childNodes[$node_name]) 
		{
			$tmp_obj = $parent_obj->childNodes[$node_name];
			if(is_array($tmp_obj))
			{
				array_push($parent_obj->childNodes[$node_name], $cur_obj);
			}
			else
			{
				$parent_obj->childNodes[$node_name] = array();
				array_push($parent_obj->childNodes[$node_name], $tmp_obj);
				array_push($parent_obj->childNodes[$node_name], $cur_obj);
			}
   		}
		else
		{
			$parent_obj->childNodes[$node_name] = $cur_obj;
		}
	}
}
?>
