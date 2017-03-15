var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify') 
var bower = require('gulp-bower');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var stringify = require('stringify');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');

var config = {
     sassPath: './sass',
     bowerDir: './bower_components' 
};

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir)) 
});

gulp.task('js', function() {
	return browserify('js/main.js')
		.transform(
			stringify(stringify, {
				appliesTo: { includeExtensions: ['.hbs'] }
			})
		)
		.bundle()
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./public/built/js/'))
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

gulp.task('hbs', function () {
    var options = {
        batch : ['./hbs'],
        helpers : {
            capitals : function(str){
                return str.toUpperCase();
            }
        }
    };

    return gulp.src('./hbs/index.hbs')
        .pipe(handlebars({}, options))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('public'));
});

gulp.task('default', ['bower', 'sass', 'js', 'hbs']);
