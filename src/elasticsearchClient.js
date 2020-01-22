const {Client} = require("elasticsearch");
const esConnectionClass = require("http-aws-es");

function getElasticsearchClient() {

  const elasticsearchConfig = {
    "host": "localhost:9200",
    "apiVersion": "6.4",
    "log": 0,
    "connectionClass": esConnectionClass
  };

  const nativeClient = new Client(elasticsearchConfig);

  return nativeClient;
}

module.exports = getElasticsearchClient;