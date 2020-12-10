const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const dataTemplate = async (options,cd) => {
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

let renderFile = ({key, data, templ, dataall}) => {

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
          console.log(`[data] delete file ${_path}${_name}`);
        }
        return false;
      }
    }
  });

  return new Promise((resolve, reject) => {

    const datafix = data.filter(_d => _d.published === true);
    let renderCount = 0;

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

                renderCount++;
                // Promise
                if(datafix.length === renderCount){
                  resolve();
                }
              }
            });

          });
        });
      }
    });
  });

};

module.exports = dataTemplate;
