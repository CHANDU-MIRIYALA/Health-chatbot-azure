const path = require('path');
const restify = require('restify');
const { BotFrameworkAdapter } = require('botbuilder');
const { HealthBot } = require('./healthBot'); // Import your bot class

// Create adapter with appId and appPassword from environment variables
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId || '', // Replace with your Azure Bot App ID
    appPassword: process.env.MicrosoftAppPassword || '' // Replace with your Azure Bot App password
});

// Catch-all for adapter errors
adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${error}`);
    await context.sendActivity('The bot encountered an error. Please try again later.');
};

// Create the bot
const bot = new HealthBot(); // Ensure this matches your bot class

// Create HTTP server
const server = restify.createServer();
const PORT = process.env.PORT || 3979; // Use Azure's PORT or fallback
server.listen(PORT, () => {
    console.log(`\nServer running on port ${PORT}`);
});

// Listen for incoming requests
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});
