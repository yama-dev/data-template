# data-template

## Install

``` bash
npm install --save-dev @yama-dev/data-template
```

## Use

``` javascript
import dataTemplate from '@yama-dev/data-template';

let options = {};
options.template = [
  {
    data_type: 'news', // required
    posts_per_page: -1,
    list: { // required
      base: 'template/news/_index.html.ejs', // required
      path: 'src/news/', // required
      name: 'index.html' // required
    }
    detail: { // required
      base: 'template/news/_index.html.ejs', // required
      path: 'src/news/[slug]/', // required
      name: 'index.html' // required
    }
  }
];
options.data = {
  news: [
    {
      data_type: 'news', // required
      slug: 'yamamoto', // required
      title: 'title test',
      date: '2020-11-10 00:00:00',
      published: true,
      article: '<div>article text</div>',
    }
  ]
};

dataTemplate(options);

// compile ejs template.
// output 'src/news/index.html'.
// output 'src/news/yamamoto/index.html'.
```

## Licence

[MIT](https://mit-license.org/)

<br>

## Author

[yama-dev](https://github.com/yama-dev)

