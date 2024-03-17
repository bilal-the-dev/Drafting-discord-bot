/* eslint-disable no-undef */
const {
	Client,
	Events,
	IntentsBitField: { Flags },
} = require("discord.js");
const dotenv = require("dotenv");
const { isAdmin } = require("./utils/members");

dotenv.config({ path: ".env" });

const { TOKEN, MAX_PEOPLE, TIME_PER_PICK_IN_SECONDS, ROUNDS } = process.env;

let users, intervalTask, lastUserIndex;

let rounds = 1;
let currentUserIndex = 0;

const client = new Client({
	intents: [
		Flags.Guilds,
		Flags.MessageContent,
		Flags.GuildMessages,
		Flags.GuildPresences,
		Flags.GuildMembers,
	],
});

client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
	try {
		const {
			content,
			member,
			mentions: { parsedUsers },
			channel,
		} = message;

		isAdmin(member);

		const [prefix] = content.split(" ");

		// console.log(message.mentions.members);
		console.log(parsedUsers.keys());

		if (prefix !== "!startDraft" || parsedUsers.size > MAX_PEOPLE) return;

		await message.reply(`Starting in ${TIME_PER_PICK_IN_SECONDS} seconds.`);

		users = [...parsedUsers.keys()];
		lastUserIndex = users.length - 1;

		intervalTask = setInterval(async () => {
			if (rounds > ROUNDS) return clearInterval(intervalTask);
			await channel.send(`Its a pick for ${users[currentUserIndex]}`);

			if (currentUserIndex === lastUserIndex) {
				currentUserIndex = 0;
				rounds++;
				users.reverse();
				return;
			}

			currentUserIndex++;
			//
		}, TIME_PER_PICK_IN_SECONDS * 1000);
	} catch (error) {
		console.log(error);
	}
});

client.login(TOKEN);
