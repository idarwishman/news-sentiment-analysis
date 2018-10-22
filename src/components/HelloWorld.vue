<template>
  <div class="hello">
    <h1>{{ msg }} <a href="/#/about"><md-icon>info</md-icon></a></h1>
    <div class="md-layout md-alignment-center-center">
      <div class="md-layout-item">
        <!-- Search Bar -->
        
    <md-field>
      <label>Search</label>
      <md-input placeholder="Search a News Topic" type="text" v-model="searchText" @keyup.enter="getRSSFeed"></md-input>
    </md-field>
    <md-button class="md-raised md-primary" @click="getRSSFeed"><md-icon>search</md-icon> {{ googleNewsButtonText }}</md-button>
    <md-button class="md-raised md-accent" @click="getRedditFeed"><md-icon>public</md-icon> {{ redditNewsButtonText }}</md-button>
      </div>
    </div>    

    <!-- Google News Search Articles --> 
    <div class="md-layout md-gutter md-alignment-center-center" v-if="articles.length">
      <md-card class="md-elevation-1 md-with-hover" v-for="article in articles" :key="article.index">
        <md-card-media>
          <img src="https://s3.amazonaws.com/skinner-production/stories/featured_images/000/025/760/large/news-1.jpg?1522295632" alt="People">
        </md-card-media>

        <md-card-header>
          <div class="md-title">{{ article.title._text }}</div>
          <!-- <div class="md-subhead">{{ article.description._text | extractImage }}</div> -->
        </md-card-header>

        <md-card-expand>
          <md-card-actions md-alignment="space-between">
            <div>
              <a :href="article.link._text" target="_blank"><md-button> Go To</md-button></a>
            </div>
            <div>            
              <md-button class="emojiSize">{{article.description._text | emojiSentiment}}</md-button>
              <md-tooltip md-direction="bottom">😡😠😣😟🙁😐🙂😊😀😆😁</md-tooltip>
            </div>
          </md-card-actions>
        </md-card-expand>
      </md-card>
    </div>
    <!-- Reddit r/news Search Articles -->
    <div class="md-layout md-gutter md-alignment-center-center" v-if="redditArticles.length">
      <md-card class="md-elevation-1 md-with-hover" v-for="article in redditArticles" :key="article.index">
        <md-card-media>
          <img src="https://s3.amazonaws.com/skinner-production/stories/featured_images/000/025/760/large/news-1.jpg?1522295632" alt="People">
        </md-card-media>

        <md-card-header>
          <div class="md-title">{{ article.title._text }}</div>
          <div class="md-subhead">{{ article.updated._text | dateString }}</div>
        </md-card-header>

        
          <md-card-actions md-alignment="space-between">
            <div>
              <a target="_blank"><md-button></md-button></a>
            </div>
            <div>
              <md-button class="emojiSize">{{article.title._text | emojiSentimentReddit}}</md-button>
              <md-tooltip md-direction="bottom">😡😠😣😟🙁😐🙂😊😀😆😁</md-tooltip>
            </div>
          </md-card-actions>
      </md-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to the News Sentiment Analyzer",
      searchText: "",
      articles: [],
      redditArticles: [],
      flipped: false
    };
  },
  methods: {
    getRSSFeed() {
      let searchText = this.searchText;

      if (searchText.length > 0) {
        let encoded = encodeURI(searchText);
        let url = "https://cors-anywhere.herokuapp.com/https://news.google.com/news/feeds?um=1&ned=us&hl=en&q=" +
              encoded +
              "&output=rss";        
        
        const convert = require("xml-js");
        const axios = require("axios");
        axios
          .get(
              url
          )
          .then(response => {
            let feed = convert.xml2json(response.data, {
              compact: true,
              spaces: 4
            });

            feed = JSON.parse(feed);

            let art = feed.rss.channel.item;
            art.shift();
            this.articles = art;
            this.redditArticles = [];
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        let encoded = encodeURI(searchText);
        const convert = require("xml-js");
        const axios = require("axios");
        axios
          .get(
            "https://cors-anywhere.herokuapp.com/https://news.google.com/news/feeds?um=1&ned=us&hl=en&q=news&output=rss"
          )
          .then(response => {
            let feed = convert.xml2json(response.data, {
              compact: true,
              spaces: 4
            });

            feed = JSON.parse(feed);

            let art = feed.rss.channel.item;
            art.shift();
            this.articles = art;
            this.redditArticles = [];
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getRedditFeed() {
      const convert = require("xml-js");
      const axios = require("axios");

      let searchText = this.searchText;

      if (searchText.length > 0) {
        axios
          .get("https://cors-anywhere.herokuapp.com/https://www.reddit.com/r/news/search.rss?q=" + searchText)
          .then(response => {
            let redditFeed = convert.xml2json(response.data, {
              compact: true,
              spaces: 4
            });

            /** Reddit Schema
              * {
                  "author": {
                    "name": {
                      "_text": "/u/RyanSmith"
                    },
                    "uri": {
                      "_text": "https://www.reddit.com/user/RyanSmith"
                    }
                  },
                  "category": {
                    "_attributes": {
                      "term": "politics",
                      "label": "r/politics"
                    }
                  },
                  "content": {
                    "_attributes": {
                      "type": "html"
                    },
                    "_text": "&#32; submitted by &#32; <a href=\"https://www.reddit.com/user/RyanSmith\"> /u/RyanSmith </a> &#32; to &#32; <a href=\"https://www.reddit.com/r/politics/\"> r/politics </a> <br/> <span><a href=\"https://www.vice.com/en_us/article/zm95ka/republicans-are-outraged-about-the-deficit-they-caused\">[link]</a></span> &#32; <span><a href=\"https://www.reddit.com/r/politics/comments/9oqzik/republicans_are_outraged_about_the_deficit_they/\">[comments]</a></span>"
                  },
                  "id": {
                    "_text": "t3_9oqzik"
                  },
                  "link": {
                    "_attributes": {
                      "href": "https://www.reddit.com/r/politics/comments/9oqzik/republicans_are_outraged_about_the_deficit_they/"
                    }
                  },
                  "updated": {
                    "_text": "2018-10-16T19:35:59+00:00"
                  },
                  "title": {
                    "_text": "Republicans Are Outraged about the Deficit They Caused"
                  }
                },
           */
            redditFeed = JSON.parse(redditFeed);
            this.redditArticles = redditFeed.feed.entry.filter(
              article => article.author
            );
            // // Empty the main articles array
            this.articles = [];
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        //get top stories
        axios
          .get("https://cors-anywhere.herokuapp.com/https://www.reddit.com/r/news/.rss")
          .then(response => {
            let redditFeed = convert.xml2json(response.data, {
              compact: true,
              spaces: 4
            });

            redditFeed = JSON.parse(redditFeed);

            this.redditArticles = redditFeed.feed.entry.filter(
              article => article.author
            );
            // Empty the main articles array
            this.articles = [];
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
  },
  computed: {
    googleNewsButtonText() {
      let searchText = this.searchText;
      if (searchText.length > 0) {
        return "G-News Search";
      } else {
        return "Top Stories";
      }
    },
    redditNewsButtonText() {
      let searchText = this.searchText;
      if (searchText.length > 0) {
        return "Reddit Search";
      } else {
        return "Reddit News";
      }
    }
  },
  filters: {
    extractImage(value) {},
    emojiSentiment(htmlContent) {
      let emojis = [
        "😡",
        "😠",
        "😣",
        "😟",
        "🙁",
        "😐",
        "🙂",
        "😊",
        "😀",
        "😆",
        "😁"
      ];
      const span = document.createElement("span");
      span.innerHTML = htmlContent.split('<div class="lh">')[1];
      let articleText = span.textContent;
      var ml = require("ml-sentiment")();
      let textRating = ml.classify(String(articleText));
      if (textRating > 10) {
        textRating = 10;
      } else if (textRating < -10) {
        textRating = -10;
      }
      return emojis[Math.round(textRating / 2) + 5] + " " + textRating;
    },
    emojiSentimentReddit(title) {
      let emojis = [
        "😡",
        "😠",
        "😣",
        "😟",
        "🙁",
        "😐",
        "🙂",
        "😊",
        "😀",
        "😆",
        "😁"
      ];
      var ml = require("ml-sentiment")();
      let textRating = ml.classify(String(title));
      if (textRating > 10) {
        textRating = 10;
      } else if (textRating < -10) {
        textRating = -10;
      }
      return emojis[Math.round(textRating / 2) + 5] + " " + textRating;
    },
    dateString(value) {
      return new Date(value).toDateString();
    }
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

.md-layout-item {
  max-width: 400px;
}
.emojiSize {
  font-size: 30px;
}
.md-tooltip {
  background-color: white;
  font-size: 30px;
  margin-top: -65px !important;
  margin-left: 75px !important;
}
.md-card-header {
  height: 250px;
}
.md-title {
  height: 200px;
}
.md-card-actions {
  padding-bottom: 15px;
}
</style>
