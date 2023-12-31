const axios = require('axios');

const { system_prompt, internal_monologue } = require('../config/system_prompts');

async function getOpenAIResponse(message, sessionMessages, monoPhase) {
    const endpoint = "https://api.openai.com/v1/chat/completions";

    console.log("sessionMessages:", sessionMessages);

    // Transform sessionMessages into the format you want.
    const transformedSessionMessages = sessionMessages.map(msg => ({ role: msg.type, content: msg.content }));

    console.log("transformedSessionMessages:", transformedSessionMessages);

    const data = {
        messages: [
                { "role": "system", "content": system_prompt }, 
                { "role": "system", "content": internal_monologue[monoPhase].monologue }, 
                ... transformedSessionMessages, 
                { "role": "user", "content": message } 
            ],
        max_tokens: 400,
        model: "gpt-3.5-turbo",
    };

    const headers = {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    };

    console.log("data:", data);

    try {
        const response = await axios.post(endpoint, data, { headers: headers });  
        return response.data.choices[0].message.content;

    } catch (error) {

        console.error("Error querying OpenAI:", error);
        throw new Error("Sorry, I couldn't process that.");
    }
};

module.exports = { getOpenAIResponse };