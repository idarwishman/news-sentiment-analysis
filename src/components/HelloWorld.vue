<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="md-layout md-alignment-center-center">
      <div class="md-layout-item">
<md-field>
      <label>Search</label>
      <md-input placeholder="Search a topic in the News" type="text" v-model="searchText" @keyup.enter="getRSSFeed"></md-input>
    </md-field>
    <md-button class="md-raised md-primary" @click="getRSSFeed"><md-icon>search</md-icon> Search</md-button>
      </div>
    </div>    

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
            <a :href="article.link._text" target="_blank"><md-button> Go To</md-button></a>
            <md-button v-text="emojiSentiment(article.description._text)"></md-button>
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
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to the News Sentiment Analyzer",
      searchText: "",
      articles: [],
      emojis: [
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
      ],
      flipped: false
    };
  },
  methods: {
    getRSSFeed() {
      let searchText = this.searchText;

      if (searchText.length > 0) {
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

            let art = feed.rss.channel.item;
            art.shift();
            this.articles = art;
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        alert("Please input something in the search field");
      }
    },
    getSentiment() {
      var span = document.createElement("span");
      let htmlContent =
        '<table border="0" cellpadding="2" cellspacing="7" style="vertical-align:top;"><tr><td width="80" align="center" valign="top"><font style="font-size:85%;font-family:arial,sans-serif"><a href="http://news.google.com/news/url?sa=t&amp;fd=R&amp;ct2=us&amp;usg=AFQjCNEleYy6vfSUyTH5bV-_e9Ums6i7lg&amp;clid=c3a7d30bb8a4878e06b80cf16b898331&amp;ei=YtXLW4j8N5KO3QHkgaigBg&amp;url=https://www.aljazeera.com/programmes/upfront/2018/10/black-wealth-decrease-president-obama-181020062508463.html"><img src="//t0.gstatic.com/images?q=tbn:ANd9GcQrlfA-wrtJFZujcQaTrKg53XHuK4NmiJmFSLgEmEv32IC2zhYGIqjwwIY78WcN9SNwVACyArFv" alt="" border="1" width="80" height="80"><br><font size="-2">Aljazeera.com</font></a></font></td><td valign="top" class="j"><font style="font-size:85%;font-family:arial,sans-serif"><br><div style="padding-top:0.8em;"><img alt="" height="1" width="1"></div><div class="lh"><a href="http://news.google.com/news/url?sa=t&amp;fd=R&amp;ct2=us&amp;usg=AFQjCNEleYy6vfSUyTH5bV-_e9Ums6i7lg&amp;clid=c3a7d30bb8a4878e06b80cf16b898331&amp;ei=YtXLW4j8N5KO3QHkgaigBg&amp;url=https://www.aljazeera.com/programmes/upfront/2018/10/black-wealth-decrease-president-obama-181020062508463.html"><b>Did black wealth decrease under President <b>Obama</b>?</b></a><br><font size="-1"><b><font color="#6f6f6f">Aljazeera.com</font></b></font><br><font size="-1">Top US Democrat and likely 2020 presidential candidate, Julian Castro defends the <b>Obama</b> administration&#39;s record in the aftermath of the 2008 financial crisis, saying the situation would have been much worse under presidents like George W Bush and&nbsp;...</font><br><font size="-1" class="p"></font><br><font class="p" size="-1"><a class="p" href="http://news.google.com/news/more?ncl=d7jUqatOrsrWlwM&amp;authuser=0&amp;ned=us"><nobr><b></b></nobr></a></font></div></font></td></tr></table>';
      span.innerHTML = htmlContent.split('<div class="lh">')[1];
      console.log(span.textContent);
    }
  },
  computed: {
    emojiSentiment(htmlContent) {
      console.log(String(htmlContent));

      // const span = document.createElement("span");
      // span.innerHTML = htmlContent.split('<div class="lh">')[1];
      // let articleText = span.textContent;
      // var ml = require("ml-sentiment")();
      // let textRating = ml.classify(String(articleText));
      // console.log(textRating);

      return ""; //this.emojiSentiment[Math.floor(textRating / 2) + 5];
    }
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

.md-layout-item {
  max-width: 400px;
}
</style>
