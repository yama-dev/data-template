const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const dataTemplate = options => {
  const _options = {
    dataall: {},
    data: {}, // 対象のデータ
    template: [] // テンプレートのデータ
  };

  options = {
    ..._options,
    ...options
  };

  if( !Array.isArray(options.template) ){
    throw 'template is not array.';
  }

  if( options.data !== null && typeof options.data === 'object' ){ } else {
    throw 'template is not object.';
  }

  // データをすべてループ // all,news etc.
  for (let key in options.data) {

    // 該当するテンプレートを検索
    let _template = null;
    for (let _k in options.template) {
      if(key === options.template[_k].data_type){
        _template = options.template[_k];
      }
    }

    // 該当するテンプレートがあった場合は出力
    if(_template){
      renderFile(key, options.data[key], _template, options.dataall);
    }
  }
};

let renderFile = (k, d, t, dataall) => {

  d.map(item => {
    if(t.detail){
      let _base = t.detail.base;
      let _path = t.detail.path;
      let _name = t.detail.name;

      if(item.slug){
        _path = t.detail.path.replace(/\[slug\]/g, item.slug);
        _name = t.detail.name.replace(/\[slug\]/g, item.slug);
      } else {
        item.slug = '';
      }

      if(!fs.existsSync(_base)){
        console.log(`not templatee base file. ${_base}`);
      }

      fs.stat(_path, (errPath, stats)=>{

        // 非公開ファイルを削除
        if(item.published !== true){
          if(fs.existsSync(`${_path}${_name}`)) {
          fs.unlinkSync(`${_path}${_name}`);
            console.log(`[data] delete file ${_path}${_name}`);
          }
          return false;
        } else {
          if(errPath){
            fs.mkdirSync(_path, { recursive: true });
          }
        }

        ejs.renderFile(_base, {...dataall, ...item} , {}, function(errEjs, resultEjs){
          if (errEjs) {
            return console.log(errEjs);
          }

          if(!fs.existsSync(`${_path}${_name}`)) {
            fs.writeFileSync(`${_path}${_name}`, '');
            console.log(`[data] create file ${_path}${_name}`);
          }

          fs.readFile(`${_path}${_name}`, 'utf8', function (errRead, strRead) {
            if (errRead) {
              return console.log(errRead);
            }

            // ファイルの中身に変更のあった場合のみ更新
            if(resultEjs !== strRead){
              fs.writeFileSync(`${_path}${_name}`, resultEjs);
              console.log(`[data] render file ${_path}${_name}`);
            }
          });

        });
      });
    }
  });
};

module.exports = dataTemplate;
