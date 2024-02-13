exports = async function(input){
  const openai_key = context.values.get("openAI_value");
  const url = 'https://api.openai.com/v1/chat/completions';
  
  const data = {
        messages: [
          {
            "role": "system",
            "content": "You are a helpful assistant working at the Swiss National Railways SBB"
          },
          {
            "role": "user",
            "content": createPrompt(input)
          }
        ],
        model: "gpt-3.5-turbo"
      }
      
  console.log(JSON.stringify(data));
  // Call OpenAI API to get the completion.
  let response = await context.http.post({
      url,
      headers: {
        'Authorization': [`Bearer ${openai_key}`],
        'Content-Type': ['application/json']
      },
      encodeBodyAsJSON: true,
      body: data
  });
  
  if(response.statusCode === 200) {
      return EJSON.parse(response.body.text());
  } else {
      throw new Error(`Failed to get answer. Response: ${JSON.stringify(response)}`);
  }
}


function createPrompt(dataArray) {
  // Map each item to a formatted string
  const contextStrings = dataArray.map(item => {
    console.log(`Url: ${item.url}\nSearch Result: ${item.context}\n\n`);
    return `[Source URL: ${item.url}, URL Name: ${item.context_question}] ${item.context}`;
  });

  // Join all strings into one, separated by a newline for readability
  const combinedContext = contextStrings.join("\n\n");

  // Create the final prompt with an introduction to what the AI should do
  const prompt = `
Given the following information from multiple sources, provide a short summary that integrates these insights, focusing on the most relevant findings. Each piece of information is presented with its source and relevance score:
\n\n${combinedContext}
\n\nAnswer the key points from the above information to the following question: ${dataArray[0].question}
\n\nCan you please structure your answer in markdown, especially when you list things in ordered or unordered lists
\n\nPlease provide a list of all sources as clickable links in an unordered list at the end of your answer providing the URL Name as ancor and the URL Source as target
`;
  return prompt;
}