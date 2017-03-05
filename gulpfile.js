var gulp         = require("gulp");
    browserSync  = require('browser-sync'); 
    cssnano      = require('gulp-cssnano'), 
    concat       = require('gulp-concat'), 
    uglify       = require('gulp-uglifyjs'),
    del          = require('del'), 
    imagemin     = require('gulp-imagemin'), 
    pngquant     = require('imagemin-pngquant'); 
    cache        = require('gulp-cache'); 
    autoprefixer = require('gulp-autoprefixer');
    sass         = require('gulp-sass');
    bourbon      = require("node-bourbon").includePaths;
 

 /*--------------Разработка проекта------------------*/
gulp.task('styles', function () {
    return gulp.src('app/sass/*.sass')
    .pipe(sass({
        includePaths: bourbon
    }).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
 	 //.pipe(cssnano()) 
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src([ 
      'app/libs/jquery/production/jquery.min.js' 
      ])
      .pipe(concat('libs.min.js')) 
      .pipe(uglify()) 
      .pipe(gulp.dest('app/js')); 
});
gulp.task('browser-sync', ['styles', 'scripts'], function() { 
   browserSync({ 
      server: { 
         baseDir: 'app' 
      },
      notify: false 
	});
});
gulp.task('watch', ['browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['styles']);
	gulp.watch('app/libs/**/*.js', ['scripts']);
	gulp.watch('app/js/*.js').on("change", browserSync.reload);
	gulp.watch('app/*.html').on('change', browserSync.reload);
	gulp.watch('app/**/*.php').on('change', browserSync.reload);
});
gulp.task('default', ['watch']);


/*---------------Сборка проекта--------------*/
/*изображения*/
gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
      	.pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
      	})))
         .pipe(gulp.dest('production/assets/img')); // Выгружаем на продакшен
});
/*очистка директории fron-end*/
gulp.task('clean-Front', function() {
    return del.sync('production/assets/', 'production/applications/views/'); 
});
/*Таск сборки Front-end*/
gulp.task('build-Front', ['clean-Front',  'img'], function() {
    var buildCss = gulp.src('app/css/**/*')
    .pipe(gulp.dest('production/assets/css'))

    var buildFonts = gulp.src('app/fonts/**/*') 
    .pipe(gulp.dest('production/assets/fonts'))

    var buildJs = gulp.src('app/js/**/*') 
    .pipe(gulp.dest('production/assets/js'))

    var buildHtml = gulp.src('app/*.html') 
    .pipe(gulp.dest('production/applications/views/'));
});

/*очистка директории back-end*/
gulp.task('clean-Back', function() {
    return del.sync('production/'); 
});
/*Таск сборки Back-end*/
gulp.task('build-Back', ['clean-Back'], function() {
    var buildBack = gulp.src('www/**/*')
    .pipe(gulp.dest('production/'))
});
/*--------------------Утилита--------------*/
gulp.task('clear', function () {
    return cache.clearAll();
})



