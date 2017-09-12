var gulp = require('gulp'),
    // js min
    uglify = require('gulp-uglify'),
    // 清理目标文件夹下的文件
    cssmin = require('gulp-clean-css'),
    // 压缩html
    htmlmin = require('gulp-htmlmin'),
    // commonjs
    browserify = require("browserify"),
    // 生成source map
    sourcemaps = require("gulp-sourcemaps"),
    // gulp stream
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename'),
    // es6
    babelify = require('babelify');

var env = process.env.NODE_ENV || 'prd';
var isDev = env.toLocaleLowerCase() === 'dev';
console.log('当前执行环境:', env);

gulp.task('browserify', () => {
    var browser = browserify({
        entries: ['src/scripts/qdj/qdj.js'],
        debug: !isDev
    });

    var dest = `dist/${env}`;
    var suffix = !isDev ? '.min' : '';
    var gulpMiddle = browser.transform('babelify', {presets: ['es2015', 'stage-0']}).bundle().pipe(source('qdj.js'));

    if (!isDev) {
        gulpMiddle = gulpMiddle.pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .pipe(rename({ suffix: suffix }))
            .pipe(sourcemaps.write('.'))
    }

    return gulpMiddle.pipe(gulp.dest(dest));
});

gulp.task('qdj-dev', ['browserify'], () => {
    gulp.watch('src/scripts/**', ['browserify'])
})

gulp.task('default', ['qdj-dev'], function () {
    console.log('Gulp task done.')
});
