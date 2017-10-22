var path = require('path');
var rimraf = require('rimraf');
var fs = require('fs');
var async = require('async');
var exec = require('child_process').exec;
var TIMEOUT = 40000;

function expectFilesToExist(files, run) {
  async.each(files, function (file, callback) {
    fs.existsSync(path.join(process.cwd(), file)) ? callback() : callback('Cannot find ' + file);
  }, function (err) {
    expect(err).toBeNull();
    run();
  });
}

function expectDirectoriesToNotExist(directories, run) {
  async.each(directories, function (directory, callback) {
    fs.existsSync(path.join(process.cwd(), directory)) ? callback('Found ' + directory) : callback();
  }, function (err) {
    expect(err).toBeNull();
    run();
  });
}

(function cleanDirs() {
  [
    'test/badBowerJson',
    'test/basic',
    'test/bootstrap',
    'test/dropPackageName',
    'test/full',
    'test/glob',
    'test/ignore',
    'test/keyword',
    'test/mappedFolders',
    'test/mapping',
    'test/multiDirGlob',
    'test/multiDirGlobWithSameNestedFolder',
    'test/multiMain',
    'test/multiPath',
    'test/noInstall',
    'test/regExp'
  ].forEach(function (directory) {
    [
      'bower_components',
      'build'
    ].forEach(function (subDir) {
      rimraf(path.join(process.cwd(), directory, subDir), function () {});
    });
  });
})();

describe("Bower Installer", function () {

  it('Should pass badBowerJson', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/badBowerJson')}, function (err, stdout, stderr) {
      expect(err).not.toBeNull();
      expect(run).toThrow();
    });
  }, TIMEOUT);

  it('Should pass basic', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/basic')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        'test/basic/build/src/jquery/jquery.js',
        'test/basic/build/src/jquery-ui/jquery-ui.js'
      ], run);
    });
  }, TIMEOUT);

  it('Should remove bower_components directory', function (run) {
    exec('node ../../bower-installer.js -r', {cwd: path.join(process.cwd(), 'test/basic')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        'test/basic/build/src/jquery/jquery.js',
        'test/basic/build/src/jquery-ui/jquery-ui.js'
      ], run);

      expect(fs.existsSync(path.join(process.cwd(), 'bower_components'))).toBeFalsy();
    });
  }, TIMEOUT);

  it('Should pass bootstrap', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/bootstrap')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        'test/bootstrap/build/src/bootstrap/bootstrap.js',
        'test/bootstrap/build/src/bootstrap/glyphicons-halflings-regular.eot',
        'test/bootstrap/build/src/bootstrap/glyphicons-halflings-regular.woff',
        'test/bootstrap/build/src/bootstrap/glyphicons-halflings-regular.ttf',
        'test/bootstrap/build/src/bootstrap/glyphicons-halflings-regular.svg',
        'test/bootstrap/build/src/bootstrap/bootstrap.css',
        'test/bootstrap/build/src/jquery/jquery.js'
      ], run);
    });
  }, TIMEOUT);

  it('Should pass dropComponentName', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/dropPackageName')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        'test/dropPackageName/build/src/jquery.js',
        'test/dropPackageName/build/src/jquery-ui.js'
      ], run);
    });
  }, TIMEOUT);

  it('Should pass full', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/full')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        'test/full/build/src/backbone-nested/backbone-nested-models.js',
        'test/full/build/src/backbone/backbone.js',
        'test/full/build/src/buster-jquery-assertions/buster-jquery-assertions.js',
        'test/full/build/src/buster.js/buster-test.css',
        'test/full/build/src/datejs/date.js',
        'test/full/build/src/jquery-mousewheel/jquery.mousewheel.js',
        'test/full/build/src/jquery.jscrollpane/jquery.jscrollpane.js',
        'test/full/build/src/jquery.jscrollpane/jquery.jscrollpane.css',
        'test/full/build/src/jquery.transit/jquery.transit.js',
        'test/full/build/src/json2/json2.js',
        'test/full/build/src/requirejs-text/text.js',
        'test/full/build/src/underscore.string/underscore.string.min.js',
        'test/full/build/src/underscore/underscore.js',
        'test/full/build/src/requirejs/require.js',
        'test/full/build/src/buster.js/buster-test.js',
        'test/full/build/src/jquery/jquery.js',
        'test/full/build/src/d3/d3.js',
        'test/full/build/src/jquery-ui/jquery-ui.js',
        'test/full/build/src/speak.js/speakGenerator.js',
      ], run);
    });
  }, TIMEOUT);

  it('Should pass glob', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/glob')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        'test/glob/build/src/datejs/date-af-ZA.js',
        'test/glob/build/src/datejs/date-ar-AE.js',
        'test/glob/build/src/datejs/date-ar-BH.js',
        'test/glob/build/src/datejs/date-ar-DZ.js',
        'test/glob/build/src/datejs/date-ar-EG.js',
        'test/glob/build/src/datejs/date-ar-IQ.js',
        'test/glob/build/src/datejs/date-ar-JO.js',
        'test/glob/build/src/datejs/date-ar-KW.js',
        'test/glob/build/src/datejs/date-ar-LB.js',
        'test/glob/build/src/datejs/date-uz-Cyrl-UZ.js',
        'test/glob/build/src/datejs/date-uz-Latn-UZ.js',
        'test/glob/build/src/datejs/date-vi-VN.js',
        'test/glob/build/src/datejs/date-xh-ZA.js',
        'test/glob/build/src/datejs/date-zh-CN.js',
        'test/glob/build/src/datejs/date-zh-HK.js',
        'test/glob/build/src/datejs/date-zh-MO.js',
        'test/glob/build/src/datejs/date-zh-SG.js',
        'test/glob/build/src/datejs/date-zh-TW.js',
        'test/glob/build/src/datejs/date-zu-ZA.js',
        'test/glob/build/src/datejs/date.js'
      ], run);
    });
  }, TIMEOUT);

  it('Should pass ignore', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/ignore')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        'test/ignore/build/src/ember-model/ember-model.js',
        'test/ignore/build/src/jquery/jquery.js'
      ], run);
    });
  }, TIMEOUT);

  it('Should pass keyword', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/keyword')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        'test/keyword/build/bootstrap/3.0.3/css/bootstrap.css',
        'test/keyword/build/bootstrap/3.0.3/fonts/glyphicons-halflings-regular.eot',
        'test/keyword/build/bootstrap/3.0.3/fonts/glyphicons-halflings-regular.svg',
        'test/keyword/build/bootstrap/3.0.3/fonts/glyphicons-halflings-regular.ttf',
        'test/keyword/build/bootstrap/3.0.3/fonts/glyphicons-halflings-regular.woff',
        'test/keyword/build/bootstrap/3.0.3/js/bootstrap.js'
      ], run);
    });
  }, TIMEOUT);

  it('Should pass mappedFolders', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/mappedFolders')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        'test/mappedFolders/build/src/jquery/jquery.js',
        'test/mappedFolders/build/src/jquery-ui/jquery-ui.min.js',
        'test/mappedFolders/build/src/jquery-ui/base/images/ui-bg_flat_0_aaaaaa_40x100.png',
        'test/mappedFolders/build/src/jquery-ui/base/jquery-ui.min.css'
      ], run);
    });
  }, TIMEOUT);

  it('Should pass mapping', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/mapping')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        'test/mapping/build/src/ember-bootstrap/ember-bootstrap.js',
        'test/mapping/build/src/ember-dialog/subdirectory1/subdirectory2/ember.dialog.min.js',
        'test/mapping/build/src/jquery/jquery.js',
        'test/mapping/build/src/jquery-ui/jquery-ui.js'
      ], run);
    });
  }, TIMEOUT);

  it('Should pass multiDirGlob', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/multiDirGlob')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        "test/multiDirGlob/build/src/bootstrap/css/bootstrap-theme.css",
        "test/multiDirGlob/build/src/bootstrap/css/bootstrap-theme.css.map",
        "test/multiDirGlob/build/src/bootstrap/css/bootstrap-theme.min.css",
        "test/multiDirGlob/build/src/bootstrap/fonts/glyphicons-halflings-regular.eot",
        "test/multiDirGlob/build/src/bootstrap/fonts/glyphicons-halflings-regular.svg",
        "test/multiDirGlob/build/src/bootstrap/fonts/glyphicons-halflings-regular.ttf",
        "test/multiDirGlob/build/src/bootstrap/fonts/glyphicons-halflings-regular.woff",
        "test/multiDirGlob/build/src/bootstrap/js/bootstrap.min.js",
        "test/multiDirGlob/build/src/bootstrap/js/bootstrap.js",
        "test/multiDirGlob/build/src/bootstrap/css/bootstrap.css",
        "test/multiDirGlob/build/src/bootstrap/css/bootstrap.min.css",
        "test/multiDirGlob/build/src/jquery/jquery.js",
        "test/multiDirGlob/build/src/bootstrap/css/bootstrap.css.map"
      ], run);
    });
  }, TIMEOUT);

  it('Should pass multiDirGlobWithSameNestedFolder', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/multiDirGlobWithSameNestedFolder')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        "test/multiDirGlobWithSameNestedFolder/build/src/ace/lib/oop.js"
      ], run);
    });
  }, TIMEOUT);

  it('Should pass multiMain', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/multiMain')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        'test/multiMain/build/src/datejs/date.js'
      ], run);
    });
  }, TIMEOUT);

  it('Should pass multiPath', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/multiPath')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        'test/multiPath/build/src/buster-jquery-assertions/buster-jquery-assertions.js',
        'test/multiPath/build/css/buster.js/buster-test.css',
        'test/multiPath/build/src/buster.js/buster-test.js'
      ], run);
    });
  }, TIMEOUT);

  it('Should pass noInstall', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/noInstall')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectDirectoriesToNotExist([
        'test/noInstall/build'
      ], run);
    });
  }, TIMEOUT);

  it('Should pass regExp', function (run) {
    exec('node ../../bower-installer.js', {cwd: path.join(process.cwd(), 'test/regExp')}, function (err, stdout, stderr) {
      expect(err).toBeNull();
      expectFilesToExist([
        'test/regExp/build/src/Asset/Lib/flair/Font/ubuntu-r-webfont.woff',
        'test/regExp/build/src/Asset/Lib/flair/Font/ubuntu-r-webfont.woff2',
        'test/regExp/build/src/Asset/Lib/flair/Font/ubuntu-r-webfont.eot',
        'test/regExp/build/src/Asset/Lib/flair/Font/ubuntu-r-webfont.ttf',
        'test/regExp/build/src/Style/Lib/flair/ubuntu.font.scss',
        'test/regExp/build/src/Style/Lib/flair/base.scss'
      ], run);
    });
  }, TIMEOUT);

});
