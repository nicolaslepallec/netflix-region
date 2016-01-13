// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jade = require('gulp-jade');
var gxml = require('gulp-xml2js');
var download = require('gulp-download');
var file = require('gulp-file');
var fs = require('fs');
var connect = require('gulp-connect');


var regionXMLURL="http://unlocator.com/tool/regions.xml";

// Lint Task
gulp.task('template', function() {
    var YOUR_LOCALS = {regions : JSON.parse(require('fs').readFileSync('data/netflix.js', 'utf8'))};
 
  gulp.src('./jade/*.jade')
    .pipe(jade({
      title: "Netflix Region",
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./dist/'))
});

//region JSON from remote XML
gulp.task('refreshRegion', function() {
 download(regionXMLURL)
    .pipe(gxml())
    .pipe(gulp.dest('data/'))
});

//create netflix data from regions file
gulp.task('createNetflixData', function(){
     var countryCodes = JSON.parse(fs.readFileSync('data/countryCodeList.js', 'utf8'));
     var regions = JSON.parse(fs.readFileSync('data/regions.js', 'utf8')); 
   
    var nexflixCountryList = {};
    nexflixCountryList.countries=[];

    for (var i in regions.channels.netflix[0].country){
        var code = regions.channels.netflix[0].country[i];
        var country = countryCodes.countries.filter(function(item) {
                return item.code === code.toUpperCase();
            });
        var countryName=country[0].name;
        nexflixCountryList.countries.push({code : code, name : countryName});

    }
    return file('netflix.js', JSON.stringify(nexflixCountryList))
    .pipe(gulp.dest('data/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('jade/*.jade', ['template']);
});

//server task
gulp.task('webserver', function() {
  connect.server({
    livereload: true
  });
});

// Default Task
gulp.task('default', ['refreshRegion','createNetflixData','template','webserver','watch']);