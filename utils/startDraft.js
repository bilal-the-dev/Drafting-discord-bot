const { endDraft } = require("./endDraft");
const { isWithinLimit } = require("./members");

let users;

const data = {
	isDraftOngoing: false,
	lastUserIndex: 0,
	intervalTask: null,
	rounds: 1,
};

let currentUserIndex = 0;

const { TIME_PER_PICK_IN_SECONDS, ROUNDS } = process.env;

const startDraft = async function (message, parsedUsers) {
	if (data.isDraftOngoing) throw new Error("A Draft is already ongoing");

	await isWithinLimit(parsedUsers);

	await message.reply(`Starting in ${TIME_PER_PICK_IN_SECONDS} seconds.`);

	data.isDraftOngoing = true;

	users = [...parsedUsers.values()];
	data.lastUserIndex = users.length - 1;

	data.intervalTask = setInterval(async () => {
		if (data.rounds > ROUNDS) return await endDraft(message.channel);
		await message.channel.send(`Current pick: ${users[currentUserIndex]}`);

		if (currentUserIndex === data.lastUserIndex) {
			currentUserIndex = 0;
			data.rounds++;
			users.reverse();
			return;
		}

		currentUserIndex++;
	}, TIME_PER_PICK_IN_SECONDS * 1000);
};
module.exports = { startDraft, data };
