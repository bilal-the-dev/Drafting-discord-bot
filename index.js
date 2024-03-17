/* eslint-disable no-undef */
const {
	Client,
	Events,
	IntentsBitField: { Flags },
} = require("discord.js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const { isAdmin } = require("./utils/members");
const { startDraft } = require("./utils/startDraft");
const { endDraft } = require("./utils/endDraft");

const { TOKEN } = process.env;

// console.log(process.env);

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
		} = message;

		const [prefix] = content.split(" ");

		if (!["!startDraft", "!endDraft"].includes(prefix)) return;

		await isAdmin(member);

		if (prefix === "!startDraft") await startDraft(message, parsedUsers);
		if (prefix === "!endDraft") await endDraft();
	} catch (error) {
		await message.reply(`Err! \`${error.message}.\``);
		console.log(error);
	}
});

client.login(TOKEN);
