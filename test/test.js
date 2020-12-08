const assert = require('assert');

const fs = require('fs-extra')
const { execSync } = require('child_process');
const dataTemplate = require('../dataTemplate.js');

let options = {};

options.template = [
  {
    data_type: "news",
    list: {
      base: "template/_index.html.ejs",
      path: "src/news/[page]/",
      name: "index.html"
    },
    detail: {
      base: "template/_index.html.ejs",
      path: "src/news/[slug]/",
      name: "index.html"
    }
  }
];

options.data = {
  news: [
    {
      data_type: "news",
      slug: "yamamoto",
      title: "title test",
      date: "2020-11-10 00:00:00",
      published: true,
    },
    {
      data_type: "news",
      slug: "adachi",
      title: "title test",
      date: "2020-12-10 00:00:00",
      published: false,
    }
  ]
};

let stdout_src = null;
let stdout_template = null;

describe('Run function', function() {
  it('Write File.', function() {
    try {
      fs.mkdirSync('template', { recursive: true });
      fs.writeFileSync('template/_index.html.ejs', '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title></title></head><body><%=slug%></body></html>');
    } catch (e) {
      throw e;
    }
  });
  it('Run.', function() {
    try {
      dataTemplate(options);
    } catch (e) {
      throw e;
    }
  });
  it('Remove File.', function(done) {
    try {
      stdout_src = execSync('find ./src -type f');
      stdout_template = execSync('find ./template -type f');
      setTimeout(function(){
        fs.removeSync('src');
        fs.removeSync('template');
        done();
      }, 1000);
    } catch (e) {
      throw e;
    }
  });
  after(function(done) {
    console.log('---------------------');
    console.log('src \n' + stdout_src);
    console.log('template \n' + stdout_template);
    done();
  });
});
