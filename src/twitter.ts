// https://api.twitter.com/1.1/search/tweets.json?q=%23pa_rtx3070?result_type=recent

import axios from 'axios';
import * as config from './config';
import fs from 'fs';

export function initMostRecentDbFileIfNotExists() {
	if (!fs.existsSync(config.get('mostRecentDbFile'))) {
		console.log(`Creating ${config.get('mostRecentDbFile')}...`);
		let newFile = { hashtags: {} };
		for (let ht of config.get('followedHashtags')) {
			//@ts-ignore
			newFile.hashtags[ht] = -1;
		}
		fs.writeFileSync(
			config.get('mostRecentDbFile'),
			JSON.stringify(newFile, null, 4)
		);
	}
}

// @ts-ignore
export async function getMostRecentTweet(hashtag: string): Promise<Object> {
	const url = 'https://api.twitter.com/1.1/search/tweets.json';
	let res = await axios.get(url, {
		headers: { Authorization: 'Bearer ' + process.env.TWITTER_BEARER },
		params: { q: hashtag, result_type: 'recent' },
	});

	return res.data.statuses[0];
}

export function getMostRecentTweets(): Promise<Object>[] {
	let tweets = [];
	for (let ht of config.get('followedHashtags')) {
		tweets.push(getMostRecentTweet(ht));
	}

	return tweets;
}

export function getMostRecentId(hashtag: string): number {
	initMostRecentDbFileIfNotExists();
	let mostRecents = JSON.parse(
		// @ts-ignore

		fs.readFileSync(config.get('mostRecentDbFile'))
	);
	return mostRecents.hashtags[hashtag];
}
export function getHashtags() {
	return config.get('followedHashtags');
}
export function setMostRecentId(hashtag: string, id: number): void {
	initMostRecentDbFileIfNotExists();
	let mostRecentId = JSON.parse(
		// @ts-ignore
		fs.readFileSync(config.get('mostRecentDbFile'))
	);
	mostRecentId.hashtags[hashtag] = id;
	fs.writeFileSync(
		config.get('mostRecentDbFile'),
		JSON.stringify(mostRecentId, null, 4)
	);
}
