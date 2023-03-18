const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

require('dotenv').config()
// console.log(process.env)

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });



const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateResponse(prompt) {
    // const api_url = 'https://api.openai.com/v1/engines/davinci-codex/completions';
    const api_url = 'https://api.openai.com/v1/chat/completions'
    const headers = {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    };
    const data = {
        // 'prompt': prompt,
        // 'max_tokens': 50,
        // 'temperature': 0.8,
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}]
    };

    try {
        const response = await axios.post(api_url, data, { headers: headers });
        console.log("Response in the function:", response.data.choices[0].message.content);
        // return response.data.choices[0].text.trim();
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return 'An error occurred while generating a response.';
    }
}


bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const prompt = msg.text;
    console.log('Received message:', prompt);


    const response = await generateResponse(prompt);
    console.log('Response:', response);
    bot.sendMessage(chatId, response);
});
