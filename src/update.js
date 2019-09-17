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

const esClientInstance = getElasticsearchClient();


const addFieldQuery = { // ADD friend OBJECT to the friends ARRAY
  "script": {
    "source": "ctx._source.friends.add(params.friend)",
    "params": {
    	"friend": {
        "name": "sam",
        "age": 20,
        "friendId": "5"
      }
    }
  }
};

// currently this script only updates when the field and document already exist ----------
esClientInstance.update({ // this fails if field does not exist 
  "id": 1,
  "index": "matt_test",
  "type": "_doc",
  "body": addFieldQuery
});

// REMOVE friend OBJECT from friends ARRAY - by friendID
const removeFieldQuery = { // this registers as succesful even if it doesnt match the id and actually removes
  "script": {
    "source": "ctx._source.friends.removeIf(friend -> friend.friendId == params.friend_id)",
    "params": {
      "friend_id": "5"
    }
  }
};

esClientInstance.update({ // if field doesnt exist or doc doesnt exist it fails
  "id": 1,
  "index": "matt_test",
  "type": "_doc",
  "body": removeFieldQuery // can turn into function that can take arrayFieldToAddTo & objectToAdd/remove
});
