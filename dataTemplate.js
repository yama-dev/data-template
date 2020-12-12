const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

let options;
const options_default = {
  dataall: {},
  data: {}, // 対象のデータ
  template: [], // テンプレートのデータ
  logLevel: 'info',
  logPrefix: 'data-template'
};

const dataTemplate = async (_options,cd) => {

  options = {
    ...options_default,
    ..._options
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
      await renderFile({
        key: key,
        data: options.data[key],
        templ: _template,
        dataall: options.dataall
      })
    }
  }

  if(cd) cd();
};

let renderEjsFile = ({templateejs, pathejs, dataejs, callback}) => {
  ejs.renderFile(templateejs, dataejs , {}, function(errEjs, resultEjs){
    if (errEjs) {
      reject();
      return console.log(errEjs);
    }

    if(!fs.existsSync(pathejs)) {
      fs.writeFileSync(pathejs, '');
      if(options.logLevel === 'info') console.log(`[${options.logPrefix}] create file ${pathejs}`);
    }

    fs.readFile(pathejs, 'utf8', function (errRead, strRead) {
      if (errRead) {
        return console.log(errRead);
      }

      // ファイルの中身に変更のあった場合のみ更新
      if(resultEjs !== strRead){
        fs.writeFileSync(pathejs, resultEjs);
        if(options.logLevel === 'info') console.log(`[${options.logPrefix}] render file ${pathejs}`);
        callback();
      } else {
        callback();
      }
    });

  });
};

let renderFile = ({key, data, templ, dataall}) => {

  let renderCount = 0;

  data.map( item => {
    if(templ.detail){
      let _base = templ.detail.base;
      let _path = templ.detail.path;
      let _name = templ.detail.name;

      if(item.slug){
        _path = templ.detail.path.replace(/\[slug\]/g, item.slug);
        _name = templ.detail.name.replace(/\[slug\]/g, item.slug);
      } else {
        item.slug = '';
      }

      // 非公開ファイルを削除
      if(item.published !== true){
        if(fs.existsSync(`${_path}${_name}`)) {
          fs.unlinkSync(`${_path}${_name}`);
          if(options.logLevel === 'info') console.log(`[${options.logPrefix}] delete file ${_path}${_name}`);
        }
        return false;
      }
    }
  });

  const datafix = data.filter(_d => _d.published === true);

  return new Promise((resolve, reject) => {
    datafix.map( item => {
      if(templ.detail){
        let _base = templ.detail.base;
        let _path = templ.detail.path;
        let _name = templ.detail.name;

        if(item.slug){
          _path = templ.detail.path.replace(/\[slug\]/g, item.slug);
          _name = templ.detail.name.replace(/\[slug\]/g, item.slug);
        } else {
          item.slug = '';
        }

        if(!fs.existsSync(_base)){
          console.log(`not templatee base file. ${_base}`);
        }

        fs.stat(_path, (errPath, stats)=>{

          // フォルダが無い場合は作成
          if(errPath){
            fs.mkdirSync(_path, { recursive: true });
          }

          let detectRenderFinish = ()=>{
            renderCount++;
            // Promise
            if(datafix.length === renderCount){
              resolve();
            }
          };

          renderEjsFile({
            templateejs: _base,
            pathejs: `${_path}${_name}`,
            dataejs: {...dataall, ...item},
            callback: detectRenderFinish
          });
        });
      }
    });
  });

};

module.exports = dataTemplate;
