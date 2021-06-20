import fs from 'fs';

function getConfig() {
	// @ts-ignore
	let config = JSON.parse(fs.readFileSync('./config.json'));
	return config;
}

export function get(key: string) {
	let config = getConfig();

	return config[key];
}

export function set(key: string, value: any) {
	let config = getConfig();
	config[key] = value;
}
