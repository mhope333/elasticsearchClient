const testJson = require("../test.json");
const esClientInstance = require("../elasticsearchClient")();

async function indexDataAndAddField(esClient) {
  
  // creates index (if it doesn't already exist) and inserts document in index.
  await esClientInstance.index({
    "id": 1, // set id of document (should be a guid)
    "index": "matt_test", // indexName (if it doesn't exist already will create it)
    "type": "_doc",
    "body": testJson[0] // data/document to index
  });

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
  await esClientInstance.update({ // this fails if field does not exist 
    "id": 1, // document to update
    "index": "matt_test",
    "type": "_doc",
    "body": addFieldQuery
  });

  console.log("Completed Operation");
}

indexDataAndAddField(esClientInstance);