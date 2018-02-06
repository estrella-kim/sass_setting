sass_setting
==============
tests for setting sass in gulp 

## SASS
기존 css와 문법이 다르다. {} 대신 들여쓰기를 사용하고 세미콜론 ; 이 아니라 단축 연산자를 사용했다. 그러나 기존 문법이 개발자들에게 익숙치않다는 단점으로
sass버전 3이상부터 주 문법은 .scss로 변경된다.  css의 기본 문법을 그대로 가지고 있다. 

### 0. 문법
nesting 문법을 사용한다. 
```scss
p {
         background-color: red;
          a{ 
             background-color:black;
             &:hover {
                background-color:green;  //부모 선택자를 참조할 경우 &를 사용
             }
             &.active {
                backgrond-color: blue;
             }
         }
 }
    
 -- after compiled
p {
    background-color: red;
}
p  a{ 
    background-color:black;
}
```

0.1  de-nest  @at-root directive(지시자)
- 현재 자신이 속한 selector에서 완전히 벗어난다. 
```scss
p {
         background-color: red;
          a{ 
             background-color:black;
             &:hover {
                background-color:green;  //부모 선택자를 참조할 경우 &를 사용
             }
             &.active {
                backgrond-color: blue;
             }
             @at-root .decoration{
                backgroun-color: yellow;
             }
         }
 }
 -- after compiled
p {
    background-color: red;
}
p  a{ 
    background-color:black;
}
.decoration{
    backgroun-color: yellow;
}
```


### 1. 변수
 - 변수로 사용가능한 형태는 숫자, 문자열, 폰트, 색상, null, lists, maps
 - 변수를 사용할 때는 $를 사용한다. 
 - 변수를 정의하더라도 사용하지 않으면 컴파일된  css파일에 아무것도 나타나지 않는다.  
 ```scss
    $primary-color:#333;
```
 1.1 변수범위 (scope)
 - 전역변수 : `!global ` 
 - 지역변수 : 지역변수는 네스팅을 물고 있는 가장 상위 셀렉터 안에서 쓰일 수 있다.
 
 
 ```scss
 $primary-color : #333;
 #header{
   $primary-color: red;
   $width-l : 7em;
   width: $width-l;
     div{
       color: $primary-color;
     }
     a{
       $primary-color: yellow;
       $width-l : 3em !global; //global하게 선언되어도 셀렉터의 지역변수를 받는다.
       width: $width-l; 
       color: $primary-color;
     }
     ul{
       color:$primary-color; //동일 셀렉터 내에서는 변수가 재정의된다. 
     }
 }
 #content{
   color: $primary-color;
   width: $width-l;
 }
   
   
   -- compiled 
   
  #header {
  	width: 7em;
  }
  #header div {
  	color: red;
  }
  #header a {
  	width: 7em;
  	color: yellow;
  }
  #header ul {
  	color: yellow;
  }
  #content {
  	color: #333;
  	width: 3em;
  }
```
1.3.  !default 플래그
- 해당 변수가 설정되지 않았거나 값이 null일 때 값을 설정한다 . mixin 을 작성할 때 유용하게 사용된다.

```scss
 $primary-color:#333;
 $primary-color: $eee !default;
 
 p{
  color: $primary-color;
 }

--- compile

p{
  color:#333;
}

```

### 2. 타입

2.1 연산
    - math 연산자( + , -, /, *, %, ==, !=)
    - +/- 연산자를 사용할 때는 반드시 단위를 통일시켜주어야한다. (다른 단위로 사용할 때는 css의 math연산자를 사용해야한다.)

### 3. 내장함수

3.1 darken()
    - 특정 색깔과 어두운 정도를 인수로 주면 자동으로 색상을 계산해서 나타낸다.
    
```scss

$buttonColor : green;
$buttonDarker : darken($buttonColor, 10%);

button {
  background-color: $buttonColor;
  border-radius: 0 0 5px 0 $buttonDarker; 
}

```
### 3. import 
- 여러 파일의 스타일 시트를 다른 파일에서 불러와서 사용할 수 있다. 
```scss
@layout 'css/app' //확장자를 붙이지 않아도 된다.
```
3.1 partial
.sass파일이나 .scss파일의 이름을 언더스코어(_)로 시작하면 해당 파일은 css파일로 컴파일되지않는다. 

### 4. extend directive (상속)
 특정 선택자를 상속할 때 @extend directive를 사용한다. (단, %선택자는 상속할 수는 있지만 컴파일은 되지 않는다.)
```scss
$font-l : 4em;

p {
  width: 4em;
  height: 4em;
  border: solid 1px #eee;
  font-size: $font-l;
}
a {
  display:inline-block;
  @extend p;
}

--- compiled


p, a {
	width: 4em;
	height: 4em;
	border: solid 1px #eee;
	font-size: 4em;
}
a {
	display: inline-block;
}
```

### 5. mixin (믹스인)

arguments를 받을 수 있는 상속 directive이다.  선언 시 @mixin , 사용할 때는 @include로 한다.
```scss
@mixin highlight( $fontSize, $color, $decoration) {
  color: $color;
  font-size: $fontSize;
  text-decoration: $decoration;
}

.header {
  @include highlight( 2em, yellow, underline);
  font-style: italic;
}

-- compiled 

.header {
	color: yellow;
	font-size: 2em;
	text-decoration: underline;
	font-style: italic;
}
```

### 함수(function) 
함수는 값을 반환한다. (@return)
```scss
@function ratio( $width, $height) {
  @return ($height/$width) * 100%;
}
@function realHeight( $width, $height) {
  @return ratio($width, $height) * 100 * height;
}

.box {
  padding-top: ratio( 100px, 300px);
}
-- compiled
.box {
	padding-top: 300%;
}

```

### 주석
한 줄 주석  //
여러 줄 주석 /**/ 



### 아키텍처
```
[디렉토리 구조]

sass/
|
|– abstracts/  공통요소(폰트 색상, 버튼 색상 등)
|   |– _variables.scss    # 변수
|   |– _functions.scss    # 함수
|   |– _mixins.scss       # Mixins
|   |– _placeholders.scss # Placeholders
|
|– base/ 기본요소(폰트스타일, 마진, 패딩, 태그 디폴트 속성) 
|   |– _reset.scss        # Reset/normalize 
|   |– _typography.scss   # Typography rules
|   …                     # Etc.
|
|– pages/ 각 페이지들 
|   |– content-list.scss # 컨텐츠관리
|   |– campaign-direct-assign.scss     # 직접지급
|   ...                  # Etc…
|
|– components/ 컴포넌트단위(버튼스타일 => 대강의 크기, 색상, on/off시 상태, 체크박스 , 드롭다운 등 )
|   |– _buttons.scss      # 버튼
|   |– _carousel.scss     # 캐러셀
|   |– _checkbox.scss     # 체크박스
|   |– _dropdown.scss     # 드롭다운
|   …                     # Etc.
|
|– layout/ 레이아웃
|   |– _header.scss       # 헤더
|   |– _footer.scss       # 푸터
|   |– _modal.scss        # 모달
|   …                     # Etc.
|
|– vendors/ 헬퍼들
|   |– _bootstrap.scss    # Bootstrap
|   |– _jquery-ui.scss    # jQuery UI
|   …                     # Etc.
|
`– _basic.scss              # 기본 요소들을 모아놓은 집합.

```