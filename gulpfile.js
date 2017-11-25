// dependencies
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var merge = require('merge-stream');

// points to all the files in the source folder
var SOURCEPATHS = {

    // * will check for any file that has the .scss extension in this folder. 
    sassSource : 'src/scss/*.scss',
    htmlSource : 'src/*html',
    jsSource : 'src/js/**'
}

// points to all the files in the app folder
var APPPATH = {
    root: 'app/',
    css : 'app/css',
    js : 'app/js'
}

// (gulp.task)defines a new task with a name, optional array of dependencies and a function.
gulp.task('clean-html', function() {
    return gulp.src(APPPATH.root + '/*html', {read: false, force: true })
        .pipe(clean());
})


gulp.task("clean-scripts", function() {
  return gulp
    .src(APPPATH.js + "/*js", { read: false, force: true })
    .pipe(clean());
});

gulp.task('sass', function(){
    var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    var sassFiles;

    sassFiles = gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())

    // comples sass, you can use expanded, compressed, compact, nested
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    return merge(bootstrapCSS, sassFiles)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(APPPATH.css));
});

gulp.task('scripts', ['clean-scripts'], function() {
    gulp
      .src(SOURCEPATHS.jsSource)
      .pipe(concat("main.js"))
      .pipe(browserify())
      .pipe(gulp.dest(APPPATH.js));
});

// copies the html file into the root
gulp.task('copy', ['clean-html'], function() {
    gulp.src(SOURCEPATHS.htmlSource)
        .pipe(gulp.dest(APPPATH.root))
});

// initialize browserSync (syncs the browser similar to how React does with the DOM)
gulp.task('serve', ['sass'], function() {
    browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
        server: {
            baseDir : APPPATH.root
        }
    }); 
});

// runs both tasks and you can add more tasks by adding a comma
gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts'], function () {
    
    // listens for 
    gulp.watch([SOURCEPATHS.sassSource], ['sass']);  
    gulp.watch([SOURCEPATHS.htmlSource],  ['copy']);
    gulp.watch([SOURCEPATHS.jsSource], ["scripts"]); 
} );

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch']);