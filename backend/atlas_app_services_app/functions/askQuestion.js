exports = async function(question){
  const isEmpty = require("lodash/isEmpty");
  const agg = [];
  
  if (!isEmpty(question)) {
    const embedding = await context.functions.execute("getEmbedding", question);  

    agg.push({"$vectorSearch": {
          "queryVector": embedding,
          "path": "vector_embedding",
          "numCandidates": 100,
          "limit": 3,
          "index": "default"
        }})
  }
  

  var dbName = "sbb";
  var collName = "qa";

  var collection = context.services.get("mongodb-atlas").db(dbName).collection(collName);

  agg.push({
          "$project": {
            "context": "$answer",
            "context_question": "$question",
            "question": question,
            "url": 1,
            "score": { $meta: "vectorSearchScore" }
        }}
  );
  
  try {
    const documents = await collection.aggregate(agg).toArray();
    return context.functions.execute("getResponse" ,documents);
  } catch(err) {
    console.log("Error occurred while executing findOne:", err.message);
    return { error: err.message };
  }
};
