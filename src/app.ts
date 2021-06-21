require('dotenv').config();
import { Telegraf } from 'telegraf';
import * as fs from 'fs';

import * as users from './users';
import * as twitter from './twitter';

// @ts-ignore
const bot = new Telegraf(process.env.BOT_TOKEN);

users.initUsersIfNotExists();
twitter.initMostRecentDbFileIfNotExists();

bot.command('join', async (ctx) => {
	//add user to notification list

	let sender_id = ctx.message.from.id;
	users.AddUser(sender_id);

	ctx.reply('You were added to the broadcast');
});

bot.command('leave', (ctx) => {
	//add user to notification list

	let sender_id = ctx.message.chat.id;
	users.RemoveUser(sender_id);

	ctx.reply('You were removed from the broadcast');
});

bot.command('recent', async (ctx) => {
	let part = ctx.message.text.split(' ');
	if (part.length < 2) {
		ctx.reply('No parameter given');
	} else if (part.length > 2) {
		ctx.reply('Too many parameters given');
	} else {
		let recent = await twitter.getMostRecentTweet(part[1]);

		//@ts-ignore
		if (recent) {
			//@ts-ignore
			ctx.reply(recent.text);
		} else {
			ctx.reply('Could not find any recent posts');
		}
	}
});

bot.command('recents', async (ctx) => {
	Promise.all(twitter.getMostRecentTweets()).then((values) => {
		for (let i of values) {
			// @ts-ignore
			ctx.reply(i.text);
		}
	});
});

bot.command('parts', (ctx) => {
	let devices = [];
	for (let ht of twitter.getHashtags()) {
		devices.push(ht.replace('#pa_', ''));
	}

	ctx.reply(`Currently watching:\n${devices.join('\n')}`);
});

bot.launch().then(() => {
	console.log('Bot running');
});

function broadcast(msg: string) {
	console.log('\t=> Broadcasting');
	for (let u of users.GetUsers().users) {
		bot.telegram.sendMessage(u, msg);
	}
}

setInterval(() => {
	console.log('updating...');

	for (let ht of twitter.getHashtags()) {
		console.log(`Checking for ${ht}`);

		twitter.getMostRecentTweet(ht).then((mr) => {
			//@ts-ignore
			if (twitter.getMostRecentId(ht) !== mr.id) {
				console.log('Found new tweet');
				//@ts-ignore
				twitter.setMostRecentId(ht, mr.id);
				broadcast(
					'--- NEW:\t' +
						ht.replace('#pa_', '') +
						' ---\n\n\n' +
						//@ts-ignore
						mr.full_text
				);
			}
		});
	}
}, 10000);

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
