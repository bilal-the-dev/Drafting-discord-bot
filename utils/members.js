const { PermissionsBitField } = require("discord.js");

const { MAX_PEOPLE, MIN_PEOPLE } = process.env;

const isAdmin = async function (member) {
	if (!member.permissions.has(PermissionsBitField.Flags.Administrator))
		throw new Error("The command is admin only");
};

const isWithinLimit = async function (users) {
	if (users.size > MAX_PEOPLE || users.size < MIN_PEOPLE)
		throw new Error(
			`The min player amount is ${MIN_PEOPLE} and max amount is ${MAX_PEOPLE}`,
		);
};

module.exports = { isAdmin, isWithinLimit };
