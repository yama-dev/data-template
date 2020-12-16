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
    detail: {
      data: ['article',0,'article_in'],
      base: 'template/news/_detail.html.ejs',
      path: 'dist/news/[slug]/',
      name: 'index.html'
    }
  }
];

options.data = {
  news: [
    {
      data_type: 'news',
      slug: 'yamamoto',
      title: 'title test',
      date: '2020-11-10 00:00:00',
      published: true,
      article: [
        {
          title: '[array] title test1',
          slug: 'test1',
          article_in: [
            {
              title: '[in array] title test1',
              slug: 'test1-1',
            },
            {
              title: '[in array] title test2',
              slug: 'test1-2'
            }
          ],
        },
        {
          title: '[array] title test2',
          slug: 'test2',
          article_in: [
            {
              title: '[in array] title test1',
              slug: 'test2-1',
            },
            {
              title: '[in array] title test2',
              slug: 'test2-2'
            }
          ],
        }
      ],
    },
    {
      data_type: 'news',
      slug: 'adachi',
      title: 'title test',
      date: '2020-12-10 00:00:00',
      published: true,
      article: [
        {
          title: '[array] title test1',
          slug: 'test1',
          article_in: [
            {
              title: '[in array] title test1',
              slug: 'test3-1',
            },
            {
              title: '[in array] title test2',
              slug: 'test3-2'
            }
          ],
        },
        {
          title: '[array] title test2',
          slug: 'test2',
          article_in: [
            {
              title: '[in array] title test1',
              slug: 'test4-1',
            },
            {
              title: '[in array] title test2',
              slug: 'test4-2'
            }
          ],
        }
      ],
    }
  ]
};

let stdout_src = '';
let stdout_template = '';
let stdout_read = '';

describe('Run function "data-in-data"', function() {
  it('create template file', function() {
    try {
      fs.mkdirSync('template/news', { recursive: true });
      fs.writeFileSync('template/news/_detail.html.ejs', '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title></title></head><body><%=slug%> - <%=title%></body></html>');
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

      // detail - news
      stdout_read += '\n' + fs.readFileSync('dist/news/test1-1/index.html', 'utf8');
      stdout_read += '\n' + fs.readFileSync('dist/news/test1-2/index.html', 'utf8');
      stdout_read += '\n' + fs.readFileSync('dist/news/test3-1/index.html', 'utf8');
      stdout_read += '\n' + fs.readFileSync('dist/news/test3-2/index.html', 'utf8');
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
    // console.log('template \n' + stdout_template);
    console.log('---------------------');
    done();
  });
});
