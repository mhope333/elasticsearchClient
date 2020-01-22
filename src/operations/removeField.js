const testJson = require("../test.json");
const esClientInstance = require("../elasticsearchClient")();

async function indexDataAndRemoveField(esClient) {

  // creates index (if it doesn't already exist) and inserts document in index.
  await esClientInstance.index({
    "id": 2, // set id of document (should be a guid)
    "index": "matt_test", // indexName (if it doesn't exist already will create it)
    "type": "_doc",
    "body": testJson[1] // data/document to index
  });

  // REMOVE friend OBJECT from friends ARRAY - by friendID
  const removeFieldQuery = { // this registers as succesful even if it doesnt match the id and actually remove
    "script": {
      "source": "ctx._source.friends.removeIf(friend -> friend.friendId == params.friend_id)",
      "params": {
        "friend_id": "1"
      }
    }
  };

  await esClientInstance.update({ // if field doesnt exist or doc doesnt exist it fails
    "id": 2, // document to update
    "index": "matt_test",
    "type": "_doc",
    "body": removeFieldQuery // can turn into function that can take arrayFieldToAddTo & objectToAdd/remove
  });
  
  console.log("Completed Operation");
}

indexDataAndRemoveField(esClientInstance);
