const { PermissionsBitField } = require("discord.js");

const isAdmin = function (member) {
	if (!member.permissions.has(PermissionsBitField.Flags.Administrator))
		throw new Error("Admin only");
};

module.exports = { isAdmin };
