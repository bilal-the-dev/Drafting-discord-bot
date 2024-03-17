const endDraft = async function () {
	const { data } = require("./startDraft");

	if (!data.isDraftOngoing) throw new Error("No draft is ongoing right now");

	clearInterval(data.intervalTask);
	data.isDraftOngoing = false;
	data.rounds = 1;
};

module.exports = { endDraft };
