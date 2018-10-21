<template>
  <div class="about">
      <h1>About</h1>
      <h3>
Welcome to the News Sentiment Analysis tool! 
        </h3>

<p style="margin-right : 100px; margin-left : 100px;  margin-top : 100px;">This is a web app which allows you to search a topic or subject and gives you the top news articles pertaining to the topic, along with the overall sentiment of the article. 
  The sentiment is expressed through an emoticon and numerical value ranking from -10 to 10, with -10 being the most negative to 10 as the most positive. 
  After you type in a topic and choose a source (Google or Reddit), the web app fetches the Rich Site Summary(RSS) feed which gives the pure text from the article, 
  including the author, publish date, description, etc. Once we have the pure text we run the sentiment analysis, for the sentiment analysis we used the ml-sentiment API. 
  It reads through the RSS feed and and produces a positive or negative score value. The magnitude of the sentiment is ranked from -10 to 10 along with an emoticon that is 
  representative of the sentiment. This allows users to look up topics to find articles from multiple sources and compare the sentiment of the different articles.
  </p>
      
  </div>
</template>


<script>
export default {
  name: "About"
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
