/*var fs = require('fs');

 console.log('bootstrap');

 fs.readdir('./files', function(err, files) {
 if(err) {
 console.error(err);
 }

 console.log(files);

 });*/

/*var dir = require('node-dir');

 dir.subdirs('./files', function(err, subdirs) {
 if (err) throw err;
 console.log(subdirs);
 });

 dir.files('./files', function(err, files) {
 if (err) throw err;
 console.log(files);
 });

 dir.paths('./files', function(err, paths) {
 if (err) throw err;
 console.log('files:\n',paths.files);
 console.log('subdirs:\n', paths.dirs);
 });*/

var fs = require('fs');
var path = require('path');
var util = require('util');
var mime = require('mime');

var fileTree = {};

function parse(base, p, tree) {
    var basename = path.basename(p),
        ext      = path.extname(p),
        name     = basename.substr(0, basename.length - ext.length),
        stat     = fs.statSync(p);

    if(name == '__isDir') {
        return; // reserved world
    }

    if(stat.isDirectory()) {
        tree[name] = {
            isDir: true,
            name: name,
            img: '__meta/img/folder.svg',
            files: {}
        };
        var files = fs.readdirSync(p);
        for(var i = 0; i < files.length; i++) {
            parse(base, path.join(p, files[i]), tree[name].files);
        }
    }
    else if(stat.isFile()) {
        var rPath    = path.relative(base, p),
            mimeType = mime.lookup(basename),
            type     = path.dirname(mimeType);
        if(tree[name]) {
            console.log(type);
            if(type === 'image') {
                tree[name].img = rPath;
            }
            else {
                tree[name].ext = ext.substr(1);
                tree[name].path = rPath;
                tree[name].mime = mimeType;
            }

            if(type === 'video' || type === 'audio') {
                if(!tree[name].src) {
                    tree[name].src = [];
                }
                tree[name].src.push({mime: mimeType, path: rPath});
            }
        }
        else {
            tree[name] = {
                ext: ext.substr(1),
                path: rPath,
                img: type === 'image' ? rPath : '__meta/img/file.svg',
                name: name,
                mime: mimeType
            };
            if(type === 'video' || type === 'audio') {
                tree[name].src = [{mime: mimeType, path: rPath}];
            }
        }
    }
}

module.exports = function(p) {
    parse(p, p, fileTree);


    var basename = path.basename(p),
        ext      = path.extname(p),
        name     = basename.substr(0, basename.length - ext.length);

    fileTree = fileTree[name].files;
    console.log(util.inspect(fileTree, {colors: true, depth: null}));
    return fileTree;
};

