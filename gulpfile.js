var gulp = require('gulp');

//gulp 플러그인 호출
var pump        = require('pump'),
    concat      = require('gulp-concat'),
     scss       = require('gulp-sass'),
    sourcemap   = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename');

/*
 * ============================+
 * 경로들을 담을 객체 생성
 * ============================+ㄴ
 */
/*var src = 'src';
var dist = 'dist';
var paths = {
    js: src + '/js/!*.js',
    scss : src + '/sass/!*.scss'
};*/

/**
 *============================================
* @task : script병합파일 생성
 *============================================
 */


// gulp.task(name, deps, func)
// task에는 세 가지 파라미터가 있다.
// name 은  task 의 이름을 지정한다.(공백이 포함되어서는 안된다.)
// deps는 현재 선언하고 있는 task를 수행하기 이전에 수행되어야하는 task들의 배열목록을 작서할 수 있다. 생략해도되는 파라미터
// func는 실제 수행할 업무프로세르 정의하는 function
gulp.task('default', ['concat:js','watch'], function() { //gulp default는 gulp명령어만을 타이핑하여 실행했을 때 기본으로 실행되는 task다.
    console.log('success!');
})
gulp.task('concat:js',function(cb) {
    pump([  //에러가 어디서 발생하는지 어느 line에서 발생하는지 추적하기 위해서 error handling function을 만들어주고 과정마다 실행해주어야하지만 pump로 간단하게 대체할 수 있다.

       gulp.src('src/js/*.js'), //해당 task의 대상이 되는 파일들을 지정해준다. (* 파일을 선택하는 방식은 node-glob의 문법을 따르고 있다.) gulp.src(files)의 메소드 줄은 gulp객체의 src()에 파일이나 파일경로를 배열 혹은 string형태로 작성한다. **, *등의 문자형태인 와일드카드 문자 형태로 표현해줄수있다. 배열을 사용해서 원하는 만큼 여러 개의 파일들과 폴더들을 가져올 수 있다. 와일드카드 문자형태로 병합해줄 때는 파일명의 알파벳 순서대로 병합되므로 스크립트 처리 순서에 이슈가 발생할 수 있다.

           concat('combined.js'),//gulp-concat모듈로 호출하여 참조한 concat()  함수

            uglify({
                mangle: false, //알파벳 한 글자로 압축하는 과정을 수행하지 않는다.
            }),

            rename('combined.min.js'),

            gulp.dest('dist/js')
        // gulp의 스트리밍 기능으로 gulp.src에서 대상의 각 파일들을 stram형태로 읽어 다음 플러그인 등으로 연결할 때 사용한다. 즉, pipe 메소드를 사용해 task의 결과물을 function에 전달해줄 수 있다. pipe는 체이닝으로 여러 개의 pipe를 연결해 사용할 수 있다.
        //gulp.dest는 해당 task의 결과물이 저장될 경로를 지정해준다. user가 사용하게 될  output파일로 떨궈진다.
        ],
        cb
    );
})
// gulp 는 stream기반의 build system이다.
// node.js 기반으로, node.js의 특징인 event-driven, non-blocking I/O를 바탕으로 요청 후 한번에 결과가 오는 게 아니라 이벤트로 중간중간 전달받는다. 이 방식이 stream방식이다. 따라서 실제 작업 속도가 빠르다.

//지속적인 관찰을 위해 자동화 메소드를 추가한다.
gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['concat:js']); //watch메소드는 두 개의 파라미터를 전달받는다. 첫번째 파라미터는 변경 감지를 해야하는 대상, 두번째 파라미터는 변경이 감지되었을 때 실행해야할 task를 지정. 여러 개의 배열로 넣어주면 변경이 일어날 때마다 해당 task를 자동으로 실행시켜준다.
})


// stripDebug 모듈 (alert 와 console 코드를 삭제해주는 모듈)
