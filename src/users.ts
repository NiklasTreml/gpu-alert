import * as fs from 'fs';
import * as config from './config';

export function initUsersIfNotExists() {
	if (!fs.existsSync(config.get('usersDbFile'))) {
		console.log(`Creating ${config.get('usersDbFile')}...`);
		fs.writeFileSync(
			config.get('usersDbFile'),
			JSON.stringify({ users: [] }, null, 4)
		);
	}
}

export function AddUser(id: number) {
	initUsersIfNotExists();
	console.log(`Adding user ${id} to list`);
	let joinedUsers = JSON.parse(
		fs.readFileSync(config.get('usersDbFile')).toString()
	);
	if (joinedUsers.users.includes(id)) {
		return;
	}

	joinedUsers.users.push(id);

	fs.writeFileSync(config.get('usersDbFile'), JSON.stringify(joinedUsers));
}

export function RemoveUser(id: number) {
	initUsersIfNotExists();
	console.log(`Removing user ${id} from list`);
	let joinedUsers = JSON.parse(
		//@ts-ignore
		fs.readFileSync(config.get('usersDbFile'))
	);
	//@ts-ignore
	joinedUsers.users = joinedUsers.users.filter((x) => {
		x != id;
	});

	fs.writeFileSync(config.get('usersDbFile'), JSON.stringify(joinedUsers));
}

export function GetUsers() {
	initUsersIfNotExists();
	let users = JSON.parse(
		//@ts-ignore
		fs.readFileSync(config.get('usersDbFile'))
	);
	return users;
}
