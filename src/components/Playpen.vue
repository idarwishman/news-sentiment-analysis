<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <input type="text" v-model="searchText" @keyup.enter="getRSSFeed">
    <button @click="getRSSFeed">Search</button>

    <div class="md-layout md-gutter md-alignment-center-center" v-if="articles.length">
      <md-card class="md-elevation-1 md-with-hover" v-for="article in articles" :key="article.index">
      <md-card-media>
        <img src="https://s3.amazonaws.com/skinner-production/stories/featured_images/000/025/760/large/news-1.jpg?1522295632" alt="People">
      </md-card-media>

      <md-card-header>
        <div class="md-title">{{ article.title._text | removeSourceName }}</div>
        <!-- <div class="md-subhead">{{ article.description._text | extractImage }}</div> -->
      </md-card-header>

      <md-card-expand>
        <md-card-actions md-alignment="space-between">
          <div>
            <md-button>Go To</md-button>
            <md-button>Emoji</md-button>
          </div>

            <md-card-expand-trigger>
            <md-button class="md-icon-button">
              <md-icon>keyboard_arrow_down</md-icon>
            </md-button>
          </md-card-expand-trigger>
        </md-card-actions>

        <md-card-expand-content>
          <md-card-content v-html="article.description._text"/>
        </md-card-expand-content>
      </md-card-expand>
    </md-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Playpen",
  data() {
    return {
      msg: "PLAY PEN",
      searchText: "",
      articles: [],
      urls: [],
      flipped: false
    };
  },
  methods: {
    getRSSFeed() {
      let searchText = this.searchText;

      let encoded = encodeURI(searchText);
      const convert = require("xml-js");
      const axios = require("axios");
      axios
        .get(
          "https://news.google.com/news/feeds?um=1&ned=us&hl=en&q=" +
            encoded +
            "&output=rss"
        )
        .then(response => {
          let feed = convert.xml2json(response.data, {
            compact: true,
            spaces: 4
          });

          feed = JSON.parse(feed);
          console.log(feed);

          let art = feed.rss.channel.item;
          art.shift();
          this.articles = art;
        })
        .catch(error => {
          console.log(error);
        });

      this.searchText = "";
    },
    getSentiment() {}
  },
  filters: {
    removeSourceName(value) {
      return value.toUpperCase();
    },
    extractImage(value) {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.card-expansion {
  height: 480px;
}

.md-card {
  width: 320px;
  margin: 15px;
  display: inline-block;
  vertical-align: top;
}
</style>
