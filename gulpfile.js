var gulp         = require('gulp'),
	
    less         = require('gulp-less'),
    
    //Плагины для предотварищения обрыва watch при ошибке
    plumber      = require('gulp-plumber'), 
    gutil        = require('gulp-util'), 

    
    // Подключаем gulp-uglifyjs (для сжатия JS)
    uglify       = require('gulp-uglifyjs'), 
    
    // Подключаем библиотеку для переименования файлов
    rename       = require('gulp-rename'),

    // Подключаем библиотеку для автоматического добавления префиксов 
    autoprefixer = require('gulp-autoprefixer'),
	
    browserSync  = require('browser-sync'),

    jade         = require('gulp-jade'),

    // Подключаем gulp-concat (для конкатенации файлов)
    concat       = require('gulp-concat'), 

    // Подключаем библиотеки для работы с изображениями
    pngquant     = require('imagemin-pngquant'), 
    imagemin     = require('gulp-imagemin'),

    babel = require("gulp-babel"),
    
    gulpCopy = require('gulp-copy'),

    svgSprite = require('gulp-svg-sprites'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    flatten = require('gulp-flatten');

//=========== Tasks
// Jade
gulp.task('jade', function() {
    return gulp.src('app/jade/*.jade')
	    .pipe(plumber(function (error) {
                gutil.log(error.message); //Продолжаем watch после ошибки
                this.emit('end');
        }))
        .pipe(jade({pretty: true})) 
        .pipe(gulp.dest('app')) 
});
//Перезагрузка после изменения  .jade
gulp.task('jade-watch', ['jade'], browserSync.reload);

//Минифицируем html

// Создаем таск Less
gulp.task('less', function() { 
	return gulp.src('app/less/style.less')
        .pipe(plumber(function (error) {
                gutil.log(error.message); //Продолжаем watch после ошибки
                this.emit('end');
        }))
		.pipe(less())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
		.pipe(gulp.dest('app/css/')) 
		.pipe(browserSync.reload({stream: true}))
});

//Транспиляция ES6
gulp.task("babel-js", function () {
  return gulp.src("app/js/es6/common.js")
    .pipe(plumber(function (error) {
        gutil.log(error.message); //Продолжаем watch после ошибки
        this.emit('end');
    }))
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest("app/js"));
});

// JS минификация
gulp.task('jsminify', function() {
    return gulp.src('app/js/common.js') 
        .pipe(uglify()) 
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest('dist/js'));
});

//Сжатие библиотек
gulp.task('libminify', function() {
    return gulp.src([
        'app/libs/jquery-2.2.1.min.js',
        'app/libs/slick.min.js'
        ]) 
        .pipe(concat('libs.min.js')) 
        .pipe(uglify()) 
        .pipe(gulp.dest('dist/js'));
});

// Минификация изображений
gulp.task('imgmin', function() { 
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(imagemin({ // Сжимаем их с наилучшими настройками
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img')); 
});

// Создаем таск browser-sync
gulp.task('browser-sync', function() { 
    /*browserSync({
       //proxy: 'pink.sl'
      baseDir: 'app' // Директория для сервера
    });*/
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

//Строим html с тегами symbol
gulp.task('svgSpriteBuild', function () {
  return gulp.src('app/img/svg/*.svg')
      // minify svg
      .pipe(svgmin({
          js2svg: {
              pretty: true
          }
      }))
      // remove all fill and style declarations in out shapes
      .pipe(cheerio({
          run: function ($) {
              $('[fill]').removeAttr('fill');
              $('[style]').removeAttr('style');
          },
          parserOptions: { xmlMode: true }
      }))
      // cheerio plugin create unnecessary string '>', so replace it.
      .pipe(replace('&gt;', '>'))
      // build svg sprite
      .pipe(svgSprite({
              mode: "symbols",
              preview: false,
              selector: "icon-%f",
              svg: {
                  symbols: 'svg_sprite.html'
              }
          }
      ))
      .pipe(gulp.dest("app/img"));
});

//Набюлдаем за изменениями файлов
gulp.task('watch', ['browser-sync', 'imgmin', 'jsminify', 'jade', 'less', 'babel-js'], function() {
    gulp.watch('app/**/*.less', ['less']);
    gulp.watch('app/js/es6/common.js', ['babel-js']);
    gulp.watch('./app/**/*.jade', ['jade-watch']);
    gulp.watch('app/*.html').on('change', browserSync.reload);
    gulp.watch('app/*.php').on('change', browserSync.reload); 
    gulp.watch('app/js/**/*.js').on('change', browserSync.reload); 
});

// Вызываем gulp по дефолту
gulp.task('default', ['watch']);