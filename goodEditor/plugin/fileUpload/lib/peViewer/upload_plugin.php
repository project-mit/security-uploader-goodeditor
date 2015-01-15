<?php
// 파일 헤더값 강제 변경
header('Content-Type: text/html; charset=utf-8');

require('../php-analyzes-execute-file-format/Core.php');

use AnalyzesExecuteFileFormat\Exception\NotSupportException;

use AnalyzesExecuteFileFormat\Lib\StreamIO\FileIO;
use AnalyzesExecuteFileFormat\ExecuteFormat\PE\ExecuteFormat;

// 분석할 파일값 얻어오기
if (isset($_GET['file']) == true)
{
	$file = '../../../../upload/'.$_GET['file'];
	if (!file_exists($file))
		unset($file);
}

if (isset($file) == true)
{
    try
    {
        $fileio = new FileIO(fopen($file, 'r'));
        
        $executeObject = new ExecuteFormat($fileio);
        $pe = $executeObject->getObjectFromBitMode();

        $dosHeader = $pe->getImageDosHeader();
        $ntHeader = $pe->getImageNtHeaders($dosHeader);
        $sectionHeader = $pe->getImageSectionHeader($ntHeader);

        // export
        $exportDescriptor = $pe->getImageExportDescriptor($ntHeader, $sectionHeader);
        $exportDllname = $pe->getListOfExportFileName($exportDescriptor);
        $exportFuncionArray = $pe->getListOfExportFunction($exportDescriptor);

        $iet_dll_list = array();
        foreach ($exportFuncionArray as $index => $function)
        {
            $iet_dll_list[$exportDllname][] = $function['function'];
        }

        // import
        $importDescriptorArray = $pe->getImageImportDescriptors($ntHeader, $sectionHeader);
        $importDllnameArray = $pe->getListOfImportDLL($importDescriptorArray);
        $importFuncionArray = $pe->getListOfImportFunction($importDescriptorArray);
        $imt_dll_list = array();
        foreach ($importDllnameArray as $index => $dllname)
        {
            foreach ($importFuncionArray[$index] as $function)
            {
                $imt_dll_list[$dllname][] = $function['importByName']->name;
            }
        }

        $subsystem = $ntHeader->optionalheader->subsystem;
		if ($subsystem === 0) $subsystemString = 'IMAGE_SUBSYSTEM_UNKNOWN';
		if ($subsystem === 1) $subsystemString = 'IMAGE_SUBSYSTEM_NATIVE';
		if ($subsystem === 2) $subsystemString = 'IMAGE_SUBSYSTEM_WINDOWS_GUI';
		if ($subsystem === 3) $subsystemString = 'IMAGE_SUBSYSTEM_WINDOWS_CUI';
		if ($subsystem === 5) $subsystemString = 'IMAGE_SUBSYSTEM_OS2_CUI';
		if ($subsystem === 7) $subsystemString = 'IMAGE_SUBSYSTEM_POSIX_CUI';
		if ($subsystem === 8) $subsystemString = 'IMAGE_SUBSYSTEM_NATIVE_WINDOWS';
		if ($subsystem === 9) $subsystemString = 'IMAGE_SUBSYSTEM_WINDOWS_CE_GUI';

        $iet_json_structure = @json_encode($iet_dll_list);
        if ($iet_json_structure == '') $iet_json_structure = '{\'unknown\':[]}';

        $imt_json_structure = @json_encode($imt_dll_list);
        if ($imt_json_structure == '') $imt_json_structure = '{\'unknown\':[]}';

        echo 'var iet_dll_list = '.$iet_json_structure.';'."\r\n";
        echo 'var imt_dll_list = '.$imt_json_structure.';'."\r\n";
        echo 'var exe_subsystem = "'.$subsystemString.'";'."\r\n";
    }
    catch (Exception $e)
    {
		echo 'var iet_dll_list = {\'unknown\':[]};'."\r\n";
		echo 'var imt_dll_list = {\'unknown\':[]};'."\r\n";
		echo 'var exe_subsystem = "올바른 PE Header가 아닙니다.";'."\r\n";
    }
}
?>
