const { ActivityHandler } = require('botbuilder');

class HealthBot extends ActivityHandler {
    constructor() {
        super();
        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text.trim().toLowerCase();
            const state = context.turnState.get('healthState') || {};

            if (!state.stage) {
                if (userMessage === 'hi') {
                    await context.sendActivity('Hi! How can I help you today?');
                    state.stage = 'init';
                } else {
                    await context.sendActivity('Please say "hi" to start the conversation.');
                }
            } else if (state.stage === 'init') {
                if (userMessage === 'i have a fever') {
                    await context.sendActivity('What is your sex? (Male/Female)');
                    state.stage = 'ask-sex';
                } else {
                    await context.sendActivity('Please tell me about your issue.');
                }
            } else if (state.stage === 'ask-sex') {
                if (userMessage === 'male' || userMessage === 'female') {
                    state.sex = userMessage;
                    await context.sendActivity('What is your current temperature (in °F)?');
                    state.stage = 'ask-temp';
                } else {
                    await context.sendActivity('Please specify "Male" or "Female".');
                }
            } else if (state.stage === 'ask-temp') {
                const temp = parseFloat(userMessage);
                if (!isNaN(temp)) {
                    state.temp = temp;
                    await context.sendActivity('Are you experiencing any symptoms like headache, vomiting, dizziness, etc., or say "None"?');
                    state.stage = 'ask-symptoms';
                } else {
                    await context.sendActivity('Please provide a valid number for your temperature.');
                }
            } else if (state.stage === 'ask-symptoms') {
                state.symptoms = userMessage;
                await context.sendActivity(`Thank you! Here are the details:\n- Sex: ${state.sex}\n- Temperature: ${state.temp}°F\n- Symptoms: ${state.symptoms}`);
                await context.sendActivity('Based on your input, please consult a doctor.');
                state.stage = null; // Reset conversation
            }

            context.turnState.set('healthState', state);
            await next();
        });
    }
}

module.exports.HealthBot = HealthBot;
