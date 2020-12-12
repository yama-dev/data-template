const assert = require('assert');

const fs = require('fs-extra');
const { execSync } = require('child_process');
const dataTemplate = require('../dataTemplate.js');

let options = {};

options.template = [
  {
    data_type: 'news',
    list: {
      base: 'template/_index.html.ejs',
      path: 'src/news/[page]/',
      name: 'index.html'
    },
    detail: {
      base: 'template/_index.html.ejs',
      path: 'src/news/[slug]/',
      name: 'index.html'
    }
  },
  {
    data_type: 'live',
    list: {
      base: 'template/_index.html.ejs',
      path: 'src/live/[page]/',
      name: 'index.html'
    },
    detail: {
      base: 'template/_index.html.ejs',
      path: 'src/live/[slug]/',
      name: 'index.html'
    }
  }
];

options.data = {
  news: [
    { data_type: 'news', slug: '12', title: 'title test', date: '2020-11-11 00:00:00', published: true, article: '<div>article text</div>', },
    { data_type: 'news', slug: '13', title: 'title test', date: '2020-11-12 00:00:00', published: true, article: '<div>article text</div>', },
    { data_type: 'news', slug: '14', title: 'title test', date: '2020-11-13 00:00:00', published: true, article: '<div>article text</div>', },
    { data_type: 'news', slug: '15', title: 'title test', date: '2020-11-14 00:00:00', published: true, article: '<div>article text</div>', },
    { data_type: 'news', slug: '16', title: 'title test', date: '2020-11-15 00:00:00', published: true, article: '<div>article text</div>', },
    {
      data_type: 'news',
      slug: 'yamamoto',
      title: 'title test',
      date: '2020-11-10 00:00:00',
      published: true,
      article: '<div>article text</div>',
    },
    {
      data_type: 'news',
      slug: 'adachi',
      title: 'title test',
      date: '2020-12-10 00:00:00',
      published: false,
      article: '<div>article text</div>',
    }
  ],
  live: [
    {
      data_type: 'live',
      slug: 'yamamoto',
      title: 'title test',
      date: '2020-11-10 00:00:00',
      published: false,
      article: '<div>article text</div>',
    },
    {
      data_type: 'live',
      slug: 'adachi',
      title: 'title test',
      date: '2020-12-10 00:00:00',
      published: true,
      article: '<div>article text</div>',
    }
  ]
};

let stdout_src = null;
let stdout_template = null;
let stdout_read = null;

describe('Run function', function() {
  it('create template file', function() {
    try {
      fs.mkdirSync('template', { recursive: true });
      fs.writeFileSync('template/_index.html.ejs', '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title></title></head><body><%=slug%> - <%=title%></body></html>');
    } catch (e) {
      throw e;
    }
  });
  it('run dataTemplate()', function(done) {
    try {
      dataTemplate(options, function(){
        done();
      });
    } catch (e) {
      throw e;
    }
  });
  it('check file data.', function() {
    try {
      stdout_src = execSync('find ./src -type f');
      stdout_template = execSync('find ./template -type f');
      stdout_read = fs.readFileSync('src/news/yamamoto/index.html', 'utf8');
      stdout_read += '\n' + fs.readFileSync('src/live/adachi/index.html', 'utf8');
    } catch (e) {
      throw e;
    }
  });
  it('remove file data.', function() {
    try {
      fs.removeSync('src');
      fs.removeSync('template');
    } catch (e) {
      throw e;
    }
  });
  after(function(done) {
    console.log('---------------------');
    console.log('compile \n' + stdout_read + '\n');
    console.log('src \n' + stdout_src);
    console.log('template \n' + stdout_template);
    done();
  });
});
