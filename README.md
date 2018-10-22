# news-sentiment

> capturing news sentiment

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

This is small web application which given a topic or subject in the news does sentiment analysis using natural language processing to create datasets and display the sentiment on a given topic.

It uses the following libraries:

- Vue.JS (to manage the front-end),
- retext-sentiment (for NLP sentiment analysis),
- [insert RSS feed library here]

Roadmap
We plan to:

- Connect it to Firebase for authentication and data storage
- Provide user with feed of news sources they are interested in
- Chart data of sentiment on topic across media and for each media source over time
