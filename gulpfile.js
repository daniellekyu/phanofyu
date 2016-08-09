var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
// var sass = require('gulp-ruby-sass') 
var notify = require("gulp-notify") 
var bower = require('gulp-bower');

var config = {
     sassPath: './sass',
     bowerDir: './bower_components' 
}

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir)) 
});

gulp.task('js', function() {

});

gulp.task('sass', function () {
	return gulp.src(config.sassPath + '/phanofyu.scss')
		.pipe(sass({
             includePaths: [
                 './sass',
				config.bowerDir + '/bootstrap-sass/assets/stylesheets'
             ]
		}).on('error', sass.logError))
		.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
		.pipe(gulp.dest('./public/built/css'));
});


gulp.task('default', ['bower', 'sass', 'js']);
