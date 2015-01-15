# Security Uploader GoodEditor

## 에디터 소개

기존의 에디터는 환경설정이 필요한 경우가 많았으며 적용을 위해 여러 파일을 수정해야하는 불필요한 작업이 존재 했습니다.

```javascript
/*
이러한 불필요한 작업을 줄이기 위해 환경설정등 기타 경로의 전반적인 부분을 자동으로 설정하도록 되어있으며
단순히 goodEditor.js 파일을 필요한 부분에 올바르게 포함시키는 것 하나만으로
모든 경로를 자동으로 설정하도록 되어있습니다.

본 프로젝트는 외부라이브러리를 사용하지 않는 직접제작으로 구현됩니다.
*/
```

## 관련 프로젝트
PHP Analyzes Execute-File-Format Library
* https://github.com/ProJectMIT/php-analyzes-execute-file-format
* http://yobi.d2fest.kr/pro_hacker/php-analyzes-execute-file-format

```javascript
/*
실행파일 분석에 관련된 부분은 별도의 프로젝트로 라이브러리화를 진행하여
이전버전과 내부적으로 소스코드가 90% 가까이 리펙토링이 된 상태입니다.

이전버전을 사용하고 계신분들은 확장성이 높고 추후 리눅스 계열의 ELF 파일의
분석 또한 진행될 현재 버전을 사용해 주시기 바랍니다.
*/
```

## 지원 및 테스트 운영체제

* Windows XP
* Windows 7
* Linux (Fedora, Ubuntu)

## CrossBrowsing

* Internet Explorer 5, 7, 8, 9, 10, 11
* Chrome
* Mozilla Firefox
* Nightly

## 테스트 주소

> http://pj-room.com/goodEditor/default.html


## 보안 파일 업로드

본 에디터의 핵심기능이라 할 수 있는 보안 업로드는 기존의 업로드 시스템의 개념과 다른 기능으로써
기존의 업로드 시스템의 경우 단순히 확장자만을 체크하는 1차적인 오류검증 시스템을 통해 실행파일을 체크하게 되어있습니다.

```javascript
/*
이로인해 업로드된 파일을 다운로드하는 사용자 입장에서는 직접 다운로드 하여 실행하기전 까지는
해당 프로그램이 악성프로그램인지? 아니면 자신이 원하는 기능이 포함된 프로그램인지..
어떠한 기능들이 포함되어있는 프로그램인지를 알 수 없었습니다.
이러한 문제점을 해결하기 위해 포렌식의 개념중의 하나인 파일구조 분석을 통해
EXE, DLL 등의 파일의 PE HEADER 구조를 직접 바이너리 분석을 통해 필요정보를 추출함으로써 사용자는 다운로드를 하기 전에
분석된 파일구조의 결과를 통해 직접 시각화된 데이터를 보고 악성프로그램인지 아닌지를 유추할 수 있습니다.
*/
```

## 에디터 적용 방법!!
1. `git clone https://github.com/ProJectMIT/Security_Uploader_GoodEditor` 또는 `git clone http://yobi.d2fest.kr/pro_hacker/Security_Uploader_GoodEditor`
2. 환경설정은 필요 없으며 설치한 디렉토리를 기준으로 Security_Uploader_GoodEditor/goodEditor/goodEditor.js 파일을 정상적으로 `<head>` 태그에 추가하는 것으로
연동은 완료됩니다.
3. 2번 진행 후 아래 소스를 `<body>` 태그 맨 아래 복사하신후 알맞게 수정해 주시면 됩니다.
```javascript
<script type="text/javascript">
goodEditor.create(/*에디터로 변환 할 textarea 태그의 id 값*/);
goodEditor.editor.loading();
</script>
```

## 주요 함수 설명
```
goodEditor.create(string textAreaID);
textAreaID 값에 해당하는 textarea 객체를 goodEditor로 변환시킵니다.

goodEditor.editor.loading();
에디터 모드로 로딩합니다.

goodEditor.mode.change();
현재 goodEditor의 모드가 에디터 상태라면 html 모드로 전환하며, html 모드일 경우 에디터 모드로 전환합니다.

goodEditor.mode.get();
현재 goodEdior의 상태 모드를 bool 형태로 리턴합니다.
true : editor mode, false : html mode
```

## 본 프로젝트의 미래...

이 라이브러리를 조금 더 발전시킨다면 ...
```javascript
/*
웹상에서 백신 프로그램의 개발이 가능할 것이며, 추후 실제 백신 관련
기능을 내포한 라이브러리로 발전 시킬수 있다면 발전 시킬 생각입니다.
또한 MIT 정책을 사용함으로써 현재 업로드 시스템을 누구나 라이선스
걱정없이 손쉽게 참조하고 교육용으로 사용하며 자신의 시스템에 적용
할 수 있다는 것 입니다.
*/
```