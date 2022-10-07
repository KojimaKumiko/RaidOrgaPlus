import { Spieler } from "models/Spieler";
import nodemailer from "nodemailer";
import config from "./config.json";

export { sendPasswortResetMail as passwortReset };

function sendEmail(user: Spieler, subject: string, text: string): void {
	const mailAdress = "raidorgakontakt@gmail.com";
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: mailAdress,
			pass: config.password,
		},
	} as any);
	const to = user.email;

	const mail = {
		from: {
			name: "RaidOrga+",
			address: mailAdress,
		},
		to,
		subject,
		text,
	};

	transporter.sendMail(mail);
}

function sendPasswortResetMail(user: Spieler, token: string): void {
	const subject = "Passwort-Reset angefordert";
	const link = `https://orga.rising-light.de/#/reset/${token}`;
	const text =
		`Hallo ${user.name},` +
		`\nfür deinen Account mit dem Accountnamen ${user.accname} wurde ein Passwort-Reset angefordert. Unter folgendem Link kannst du dein Passwort neu setzen:` +
		`\n` +
		`\n${link}` +
		`\n` +
		`\nDer Link ist gültig für 24 Stunden. Falls du keinen Password-Reset angefordert hast, ignoriere diese Mail einfach.` +
		`\n` +
		`\nViele Grüße` +
		`\nDas Leitungsteam von Rising-Light.`;
	sendEmail(user, subject, text);
}
