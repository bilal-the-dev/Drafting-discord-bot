const { endDraft } = require("./endDraft");
const { isWithinLimit } = require("./members");

let users;

const data = {
	isDraftOngoing: false,
	rounds: 1,
	lastUserIndex: 0,
	currentUserIndex: 0,
	intervalTask: null,
};

const { TIME_PER_PICK_IN_SECONDS, ROUNDS } = process.env;

const startDraft = async function (message, parsedUsers) {
	if (data.isDraftOngoing) throw new Error("A Draft is already ongoing");

	await isWithinLimit(parsedUsers);

	// await message.reply(`Starting in ${TIME_PER_PICK_IN_SECONDS} seconds.`);

	data.isDraftOngoing = true;

	users = [...parsedUsers.values()];
	console.log(users.length);
	data.lastUserIndex = users.length - 1;

	intervalFunction();

	data.intervalTask = setInterval(
		intervalFunction,
		TIME_PER_PICK_IN_SECONDS * 1000,
	);

	async function intervalFunction() {
		if (data.rounds > ROUNDS) return await endDraft(message.channel);

		if (data.currentUserIndex > data.lastUserIndex) {
			if (data.rounds < ROUNDS)
				await message.channel.send("Reversing the order!");
			data.currentUserIndex = 0;
			data.rounds++;

			users.reverse();
			return;
		}

		const reply = `Current pick: ${users[data.currentUserIndex]}`;

		await message.channel.send(reply);

		data.currentUserIndex++;
	}
};
module.exports = { startDraft, data };
