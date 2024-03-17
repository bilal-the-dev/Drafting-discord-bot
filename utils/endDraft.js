const endDraft = async function (channel) {
	const { data } = require("./startDraft");

	if (!data.isDraftOngoing) throw new Error("No draft is ongoing right now");

	clearInterval(data.intervalTask);
	data.isDraftOngoing = false;
	data.rounds = 1;
	data.currentUserIndex = 0;

	await channel.send("Ended the draft successfully.");
};

module.exports = { endDraft };
