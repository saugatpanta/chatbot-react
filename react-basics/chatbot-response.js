const Chatbot = {
  state: {
    userName: null,
  },

  defaultResponses: {
    greetings: [
      'Hello! How can I assist you today?',
      'Hi there! What can I do for you?',
      'Hey! Need any help?',
    ],

    farewells: [
      'Goodbye! Have a great day!',
      'See you later!',
      'Take care!',
    ],

    thanks: [
      'You’re welcome!',
      'No problem!',
      'Anytime!',
    ],
  },

  commands: {
    'hello hi hey': function (chatbot) {
      const name = chatbot.state.userName
        ? `, ${chatbot.state.userName}`
        : '';
      const response = chatbot.randomFrom(chatbot.defaultResponses.greetings);
      return response.replace('!', `${name}!`);
    },

    'what is your name': 'I am the Premium Chatbot v2, built for smarter conversations.',

    'set my name': function (chatbot, message) {
      const name = message.split(' ').slice(-1)[0];
      chatbot.state.userName = name;
      return `Got it. I’ll call you ${name} from now on.`;
    },

    'what is my name': function (chatbot) {
      return chatbot.state.userName
        ? `Your name is ${chatbot.state.userName}.`
        : `You haven’t told me your name yet.`;
    },

    'flip a coin': function () {
      return `You got ${Math.random() < 0.5 ? 'heads' : 'tails'}.`;
    },

    'roll a dice': function () {
      const diceResult = Math.floor(Math.random() * 6) + 1;
      return `You rolled a ${diceResult}.`;
    },

    'what time is it': function () {
      const now = new Date();
      return `The current time is ${now.toLocaleTimeString()}.`;
    },

    'what is the date today': function () {
      const now = new Date();
      return `Today is ${now.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}.`;
    },

    'thank': function (chatbot) {
      return chatbot.randomFrom(chatbot.defaultResponses.thanks);
    },

    'calculate': function (chatbot, message) {
      try {
        const expression = message.replace(/[^0-9+\-*/().]/g, '');
        const result = Function(`return (${expression})`)();
        return `The result is ${result}.`;
      } catch {
        return `That doesn’t look like a valid math expression.`;
      }
    },

    'weather': async function () {
      // Placeholder: In production, replace with real API call.
      return 'Currently, I cannot access live weather data. (API key required)';
    },

    'bye goodbye see you': function (chatbot) {
      return chatbot.randomFrom(chatbot.defaultResponses.farewells);
    },
  },

  unsuccessfulResponse: `Sorry, I didn’t understand that. I can do greetings, tell the time or date, calculate math, flip coins, roll dice, and remember your name.`,

  emptyMessageResponse: `Your message seems empty. Please type something.`,

  randomFrom: function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  addCommands: function (extra) {
    Object.assign(this.commands, extra);
  },

  getResponse: function (message) {
    if (!message || !message.trim()) return this.emptyMessageResponse;

    message = message.toLowerCase().trim();

    const responses = this.commands;
    const commandKeys = Object.keys(responses);

    const { ratings, bestMatchIndex } = this.stringSimilarity(message, commandKeys);
    const bestMatchRating = ratings[bestMatchIndex].rating;

    if (bestMatchRating < 0.35) return this.unsuccessfulResponse;

    const bestKey = ratings[bestMatchIndex].target;
    const command = responses[bestKey];

    if (typeof command === 'function') return command(this, message);
    return command;
  },

  getResponseAsync: function (message) {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const response = await this.getResponse(message);
        resolve(response);
      }, 800);
    });
  },

  compareTwoStrings: function (a, b) {
    a = a.replace(/\s+/g, '');
    b = b.replace(/\s+/g, '');
    if (a === b) return 1;
    if (a.length < 2 || b.length < 2) return 0;

    const bigrams = new Map();
    for (let i = 0; i < a.length - 1; i++) {
      const bigram = a.substring(i, i + 2);
      bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1);
    }

    let intersection = 0;
    for (let i = 0; i < b.length - 1; i++) {
      const bigram = b.substring(i, i + 2);
      if (bigrams.has(bigram) && bigrams.get(bigram) > 0) {
        bigrams.set(bigram, bigrams.get(bigram) - 1);
        intersection++;
      }
    }

    return (2.0 * intersection) / (a.length + b.length - 2);
  },

  stringSimilarity: function (main, targets) {
    const ratings = [];
    let bestIndex = 0;

    for (let i = 0; i < targets.length; i++) {
      const rating = this.compareTwoStrings(main, targets[i]);
      ratings.push({ target: targets[i], rating });
      if (rating > ratings[bestIndex]?.rating ?? 0) bestIndex = i;
    }

    return { ratings, bestMatchIndex: bestIndex };
  },
};

// UMD export (browser + Node)
(function (root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Chatbot = factory();
})(typeof self !== 'undefined' ? self : this, () => Chatbot);
