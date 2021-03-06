var os = require('os'),
    path = require('path'),
    rimraf = require('rimraf'),
    test = require('tape'),
    fs = require('fs'),
    extract = require('../');

var source = path.join(__dirname, 'cats.zip'),
    target = path.join(os.tmpdir(), 'cat-extract-test'),
    results = path.join(target, 'cats');

rimraf.sync(target);

console.log('extracting to', target);

extract(source, {dir: target}, function(err) {

    test('files', function (t) {

        t.plan(1);

        fs.exists(path.join(results, 'gJqEYBs.jpg'), function (exists) {
            t.ok(exists, 'file created');
        });

    });

    test('symlinks', function (t) {

        var symlink = path.join(results, 'orange_symlink');

        t.plan(3);

        fs.exists(symlink, function (exists) {
            t.ok(exists, 'symlink created');
        });

        fs.lstat(symlink, function (err, stats) {
            t.same(err, null, 'symlink can be stat\'d');
            t.ok(stats.isSymbolicLink(), 'symlink is valid');
        });

    });

    test('directories', function (t) {

        var dirWithContent = path.join(results, 'orange'),
            dirWithoutContent = path.join(results, 'empty');

        t.plan(6);

        fs.exists(dirWithContent, function (exists) {
            t.ok(exists, 'directory created');
        });

        fs.readdir(dirWithContent, function (err, files) {
            t.same(err, null, 'directory can be read');
            t.ok(files.length > 0, 'directory has files');
        });

        fs.exists(dirWithoutContent, function (exists) {
            t.ok(exists, 'empty directory created');
        });

        fs.readdir(dirWithoutContent, function (err, files) {
            t.same(err, null, 'empty directory can be read');
            t.ok(files.length === 0, 'empty directory has no files');
        });

    });

});
