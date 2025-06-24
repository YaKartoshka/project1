require('dotenv').config();
const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const bot = new Telegraf(process.env.BOT_TOKEN);

// 🔁 Custom Instructions
const SYSTEM_PROMPT = `
Ты русскоязычный фитнес-тренер. Всегда отвечай только на русском языке, грамотно и дружелюбно.
Никогда не используй другие языки.
Давай конкретные советы по тренировкам и питанию, задавай уточняющие вопросы, если это необходимо.
Пиши профессионально, но понятно. Избегай англицизмов и иностранных слов.
`;

async function askGroq(userMessage) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "llama3-70b-8192",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userMessage }
            ]
        })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Sorry, something went wrong.";
}

bot.start((ctx) => ctx.reply("👋 Hello! Ask me anything."));
bot.on('text', async (ctx) => {
    const userInput = ctx.message.text;
    const reply = await askGroq(userInput);
    ctx.reply(reply);
});

bot.launch();
console.log("🚀 Bot is running...");
