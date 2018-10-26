<template>
  <div class="hello">
    <h1>{{ msg }} <a href="/#/about"><md-icon>info</md-icon></a></h1>
    <div class="md-layout md-alignment-center-center">
      <div class="md-layout-item">
        <!-- Search Bar -->
        
    <md-field>
      <label>Search</label>
      <md-input placeholder="Search a News Topic" type="text" v-model="searchText" @keyup.enter="getRSSFeed(false)"></md-input>
    </md-field>
    <md-button class="md-raised md-primary" @click="getRSSFeed(false)" :disabled="searching"><md-icon>search</md-icon> {{ googleNewsButtonText }}</md-button>
    <md-button class="md-raised md-accent" @click="getRSSFeed(true)" :disabled="searching"><md-icon>public</md-icon> {{ redditNewsButtonText }}</md-button>
    <md-progress-spinner md-mode="indeterminate" v-if="articles.length === 0 && searching"></md-progress-spinner>
      </div>
    </div>    

    <div v-if="articles.length > 0">
      <h2> {{ findingsMsg }} </h2>
    </div>
    <div id="articles">
    <!-- Google News Search Articles --> 
        <div class="md-layout md-gutter md-alignment-center-center" v-if="articles.length">
          <md-card class="md-elevation-1 md-with-hover" v-for="article in articles" :key="article.index">
            <md-card-media>
              <img src="https://s3.amazonaws.com/skinner-production/stories/featured_images/000/025/760/large/news-1.jpg?1522295632" alt="People">
            </md-card-media>

            <md-card-header>
              <div class="md-title">{{ article.title }}</div>
              <div class="md-subhead">{{ article.pubDate }}</div>
            </md-card-header>

            <md-card-expand>
              <md-card-actions md-alignment="space-between">
                <div>
                  <a :href="article.link" target="_blank"><md-button> Go To</md-button></a>
                </div>
                <div>            
                  <md-button class="emojiSize">{{ article.sentiment[1] }} {{ article.sentiment[0] }}</md-button>
                  <md-tooltip md-direction="bottom">😡😠😣😟🙁😐🙂😊😀😆😁</md-tooltip>
                </div>
              </md-card-actions>
            </md-card-expand>
          </md-card>
        </div>
    </div>    
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to the News Sentiment Analyzer",
      findingsMsg: "",
      searchText: "",
      articles: [],
      searching: false,
      emojis: ["😡", "😠", "😣", "😟", "🙁", "😐", "🙂", "😊", "😀", "😆", "😁"]
    };
  },
  methods: {
    getRSSFeed(fromReddit) {
      location.hash = "#articles";

      // clear past articles
      this.articles = [];

      // initialize findings message
      let resultsMsg = fromReddit
        ? "The overall news sentiment from the top Reddit news stories right now is "
        : "The overall news sentiment from the top Google news stories right now is ";

      this.searching = true; // the user has in fact searched

      let url = fromReddit
        ? "https://cors-anywhere.herokuapp.com/https://www.reddit.com/r/news/.rss"
        : "https://cors-anywhere.herokuapp.com/https://news.google.com/news/feeds?um=1&ned=us&hl=en&q=news&output=rss";

      let searchText = this.searchText;

      if (searchText.length > 0) {
        let encoded = encodeURI(searchText);
        url = fromReddit
          ? "https://cors-anywhere.herokuapp.com/https://www.reddit.com/r/news/search.rss?q=" +
            encoded
          : "https://cors-anywhere.herokuapp.com/https://news.google.com/news/feeds?um=1&ned=us&hl=en&q=" +
            encoded +
            "&output=rss";
        resultsMsg = fromReddit
          ? "On Reddit the topic '" +
            searchText +
            "' has an overall news sentiment of "
          : "The top 10 Google news stories show that the topic '" +
            searchText +
            "' has an overall news sentiment of ";
      }

      const convert = require("xml-js");
      const axios = require("axios");

      axios
        .get(url)
        .then(response => {
          let feed = convert.xml2json(response.data, {
            compact: true,
            spaces: 4
          });

          feed = JSON.parse(feed);

          if (fromReddit) {
            this.articles = feed.feed.entry
              .filter(article => article.author)
              .map(article => {
                return new Object({
                  title: article.title._text,
                  link: "",
                  pubDate: new Date(article.updated._text).toLocaleString(),
                  sentiment: this.getSentiment(article.title._text, true)
                });
              });
          } else {
            let art = feed.rss.channel.item;
            art.shift();
            art = art.map(article => {
              return new Object({
                title: article.title._text,
                link: article.link._text,
                pubDate: new Date(article.pubDate._text).toLocaleString(),
                sentiment: this.getSentiment(article.description._text, false)
              });
            });

            this.articles = art;
          }

          // Stop the searching spinner
          this.searching = false;
          // Post the overall news sentiment
          let overallSentiment = this.articles
            .map(current => {
              return current["sentiment"][0];
            })
            .reduce((total, current) => {
              return total + current;
            });

          overallSentiment = Math.round(
            overallSentiment / this.articles.length
          );

          this.findingsMsg =
            resultsMsg + this.emojis[overallSentiment + 5] + overallSentiment;
        })
        .catch(error => {
          this.searching = false;
          console.log(error);
        });
    },
    getSentiment(htmlContent, fromReddit) {
      let articleText = htmlContent;
      if (!fromReddit) {
        const span = document.createElement("span");
        span.innerHTML = htmlContent.split('<div class="lh">')[1];
        articleText = span.textContent;
      }
      var ml = require("ml-sentiment")();
      let textRating = ml.classify(String(articleText));
      if (textRating > 10) {
        textRating = 10;
      } else if (textRating < -10) {
        textRating = -10;
      }
      return [textRating, this.emojis[Math.round(textRating / 2) + 5]];
    }
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
.md-progress-spinner {
  margin: 24px;
}
</style>
