var fs = require('fs');
var path = require('path');
var util = require('util');
var mime = require('mime');
var _ = require('lodash');
var async = require('async');
var easyimage = require('easyimage');
var chalk = require('chalk');

var fileTree = {},
  imgs = [];

function parse(base, p, tree) {
  var basename = path.basename(p),
    ext = path.extname(p),
    name = basename.substr(0, basename.length - ext.length),
    stat = fs.statSync(p);

  if (name == '__isDir' || name == '__thumb') {
    return; // reserved world
  }

  if (stat.isDirectory()) {
    tree[name] = {
      isDir: true,
      name: name,
      img: '__meta/img/folder.svg',
      files: {}
    };
    var files = fs.readdirSync(p);
    for (var i = 0; i < files.length; i++) {
      parse(base, path.join(p, files[i]), tree[name].files);
    }
  } else if (stat.isFile()) {
    var rPath = path.relative(base, p),
      mimeType = mime.lookup(basename),
      type = path.dirname(mimeType);
    if (tree[name]) {
      if (type === 'image') {
        tree[name].img = rPath;
        imgs.push(tree[name]);
      } else {
        tree[name].ext = ext.substr(1);
        tree[name].path = rPath;
        tree[name].mime = mimeType;
      }

      if (type === 'video' || type === 'audio') {
        if (!tree[name].src) {
          tree[name].src = [];
        }
        tree[name].src.push({
          mime: mimeType,
          path: rPath
        });
      }
    } else {
      tree[name] = {
        ext: ext.substr(1),
        path: rPath,
        img: type === 'image' ? rPath : '__meta/img/file.svg',
        name: name,
        mime: mimeType
      };
      if (type === 'image') {
        imgs.push(tree[name]);
      } else if (type === 'video' || type === 'audio') {
        tree[name].src = [{
          mime: mimeType,
          path: rPath
        }];
      }
    }
  }
}

module.exports = function(p) {
  parse(p, p, fileTree);


  var basename = path.basename(p),
    ext = path.extname(p),
    name = basename.substr(0, basename.length - ext.length);

  fileTree = fileTree[name].files;

  var resized = 1,
  funcs = _.map(imgs, function(img) {
    return function(cb) {
      if(img.img.indexOf('.svg') !== -1) {
        fileTree.__thumbs.done = resized++;
        return cb();
      }
      process.stdout.write('[...] Resizing : ' + img.img);
      easyimage.resize({
        src: path.join(p, img.img),
        dst: path.join(p, '/__thumb/', img.img),
        width: 256,
        height: 256
      }).then(
        function(image) {
          process.stdout.write('\r[' + chalk.green('OK') + '] Resizing : ' + img.img + ' \n');
          img.img = path.join('__thumb/', img.img);
          fileTree.__thumbs.done = resized++;
          cb();
        },
        function(err) {
          process.stdout.write('\r[' + chalk.red('ERROR') + '] Resizing : ' + img.img + '\n');
          console.log(err);
          fileTree.__thumbs.done = resized++;
          cb();
        }
      );
    };
  });

  if (funcs.length) {
    fileTree.__thumbs = {
      count: funcs.length,
      done: resized
    };

    setTimeout(function() { // yeld
      async.series(funcs);
    });
  }
  /*console.log(util.inspect(fileTree, {
    colors: true,
    depth: null
  }));//*/
  //console.log(util.inspect(imgs, {colors: true, depth: null}));
  return fileTree;
};
