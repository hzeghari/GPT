const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client({
    intents: [
        // Discord.Intents.FLAGS.GUILDS,
        // Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});



require('dotenv').config()
// console.log(process.env)


/* ------------------------- Bot Discord Connection ------------------------- */
const BOT_TOKEN = process.env.BOT_TOKEN;
console.log(BOT_TOKEN);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(BOT_TOKEN);



const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log(OPENAI_API_KEY);

async function generateResponse(prompt) {
    const api_url = 'https://api.openai.com/v1/engines/davinci-codex/completions';
    const headers = {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    };
    const data = {
        'prompt': prompt,
        'max_tokens': 50,
        'temperature': 0.8,
    };

    console.log('Prompt:', prompt);
    console.log('Calling OpenAI API...');
    try {
        const response = await axios.post(api_url, data, { headers: headers });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return 'An error occurred while generating a response.';
    }
}


// client.on('message', async (message) => {
//     if (message.author.bot) return; // Ignore messages from other bots

//     const prompt = message.content;
//     console.log('Received message:', prompt);
//     const response = await generateResponse(prompt);
//     message.channel.send(response);
// });
client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore messages from other bots

    const prompt = message.content;
    console.log('Received message:', prompt);
    const response = await generateResponse(prompt);
    message.channel.send(response);
});

