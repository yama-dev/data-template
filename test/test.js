const assert = require('assert');

const fs = require('fs-extra');
const { execSync } = require('child_process');
const dataTemplate = require('../dataTemplate.js');

let options = {
  logLevel: false,
};

options.template = [
  {
    data_type: 'news',
    posts_per_page: 10,
    list: {
      base: 'template/news/_index.html.ejs',
      path: 'dist/news/',
      name: 'index.html'
    },
    page: {
      base: 'template/news/_index.html.ejs',
      path: 'dist/news/[page]/',
      name: 'index.html'
    },
    detail: {
      base: 'template/news/_detail.html.ejs',
      path: 'dist/news/[slug]/',
      name: 'index.html'
    }
  },
  {
    data_type: 'live',
    list: {
      base: 'template/live/_index.html.ejs',
      path: 'dist/live/',
      name: 'index.html'
    },
    detail: {
      base: 'template/live/_detail.html.ejs',
      path: 'dist/live/[slug]/',
      name: 'index.html'
    }
  }
];

options.data = {
  news: [
    { data_type: 'news', slug: '10', title: 'title test', date: '2020-11-03 00:00:00', published: false, article: '<div>article text</div>', },
    { data_type: 'news', slug: '11', title: 'title test', date: '2020-11-04 00:00:00', published: false, article: '<div>article text</div>', },
    { data_type: 'news', slug: '12', title: 'title test', date: '2020-11-05 00:00:00', published: false, article: '<div>article text</div>', },
    { data_type: 'news', slug: '13', title: 'title test', date: '2020-11-06 00:00:00', published: false, article: '<div>article text</div>', },
    { data_type: 'news', slug: '14', title: 'title test', date: '2020-11-07 00:00:00', published: false, article: '<div>article text</div>', },
    { data_type: 'news', slug: '15', title: 'title test', date: '2020-11-10 00:00:00', published: false, article: '<div>article text</div>', },
    { data_type: 'news', slug: '16', title: 'title test', date: '2020-11-11 00:00:00', published: false, article: '<div>article text</div>', },
    { data_type: 'news', slug: '17', title: 'title test', date: '2020-11-12 00:00:00', published: false, article: '<div>article text</div>', },
    { data_type: 'news', slug: '18', title: 'title test', date: '2020-11-13 00:00:00', published: false, article: '<div>article text</div>', },
    { data_type: 'news', slug: '19', title: 'title test', date: '2020-11-14 00:00:00', published: false, article: '<div>article text</div>', },
    { data_type: 'news', slug: '20', title: 'title test', date: '2020-11-15 00:00:00', published: false, article: '<div>article text</div>', },
    { data_type: 'news', slug: '21', title: 'title test', date: '2020-11-16 00:00:00', published: false, article: '<div>article text</div>', },
    { data_type: 'news', slug: '22', title: 'title test', date: '2020-11-17 00:00:00', published: false, article: '<div>article text</div>', },
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
      slug: 'adachi',
      title: 'title test',
      date: '2020-12-10 00:00:00',
      published: true,
      article: '<div>article text</div>',
    }
  ]
};

let stdout_src = '';
let stdout_template = '';
let stdout_read = '';

describe('Run function', function() {
  it('create template file', function() {
    try {
      fs.mkdirSync('template/news', { recursive: true });
      fs.writeFileSync('template/news/_index.html.ejs', '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title></title></head><body><%- JSON.stringify(page) %></body></html>');
      fs.writeFileSync('template/news/_detail.html.ejs', '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title></title></head><body><%=slug%> - <%=title%></body></html>');

      fs.mkdirSync('template/live', { recursive: true });
      fs.writeFileSync('template/live/_index.html.ejs', '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title></title></head><body><%- JSON.stringify(page) %></body></html>');
      fs.writeFileSync('template/live/_detail.html.ejs', '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title></title></head><body><%=slug%> - <%=title%></body></html>');
    } catch (e) {
      throw e;
    }
  });
  it('run dataTemplate()', function(done) {
    options.logPrefix = 'test';
    // options.logLevel = '';
    try {
      dataTemplate(options, function(){
        done();
      });
    } catch (e) {
      throw e;
    }
  });
  it('rerun dataTemplate()', function(done) {
    options.logPrefix = 'test';
    // options.logLevel = '';
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
      stdout_dist = execSync('find ./dist -type f');
      stdout_template = execSync('find ./template -type f');

      // index - news
      stdout_read += '\n' + fs.readFileSync('dist/news/index.html', 'utf8');

      // detail - news
      stdout_read += '\n' + fs.readFileSync('dist/news/yamamoto/index.html', 'utf8');

      // index -live
      stdout_read += '\n' + fs.readFileSync('dist/live/index.html', 'utf8');

      // detail - live
      stdout_read += '\n' + fs.readFileSync('dist/live/adachi/index.html', 'utf8');
    } catch (e) {
      throw e;
    }
  });
  it('remove file data.', function() {
    try {
      fs.removeSync('dist');
      fs.removeSync('template');
    } catch (e) {
      throw e;
    }
  });
  after(function(done) {
    console.log('---------------------');
    console.log('compile \n' + stdout_read + '\n');
    console.log('dist \n' + stdout_dist);
    console.log('template \n' + stdout_template);
    done();
  });
});
