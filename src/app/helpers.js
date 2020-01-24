import {
	exec
} from 'child_process';

export function getValue(...values) {

	let result = global.undefined;

	values.some((value) => {

		if (Array.isArray(value)) {

			const [obj, ...keys] = value;
			let tres = obj;
			let counter = 1;

			keys.some((key) => {

				if (typeof key == 'function') {
					tres = key(tres);
					counter++;
				} else
				if (tres && Reflect.has(tres, key)) {
					tres = tres[key];
					counter++;
				} else {
					return true;
				}

				return false;
			});

			if (value.length == counter) {
				result = tres;
			}

		} else {
			result = value;
		}

		return typeof result != 'undefined';
	});

	return result;
}

export function hasYarn() {
	return new Promise((resolve) => {
		exec('yarn -v', (err, stdout) => {
			resolve(
				!err
				&& typeof stdout === 'string' && stdout.trim().length
			);
		});
	});
}

export function hasGit() {
	return new Promise((resolve) => {
		exec('git --version', (err, stdout) => {
			resolve(
				!err
				&& typeof stdout === 'string' && stdout.trim().length
			);
		});
	});
}

export function whoAmI() {
	return new Promise((resolve) => {
		exec('whoami', (err, stdout) => {
			resolve(
				!err && typeof stdout === 'string' && stdout.trim().length
					? stdout.trim()
					: ''
			);
		});
	});
}

export function sshToUrl(ssh) {

	if (/^http/.test(ssh)) {
		return ssh;
	}

	if (!/^git@/.test(ssh)) {
		return '';
	}

	return `https://${
		ssh
			.replace(/^git@/i, '')
			.replace(/\.git$/i, '')
			.replace(/:/g, '/')
	}`;
}

export function gitUrl(cwd) {
	return new Promise((resolve) => {
		exec('git config --get remote.origin.url', { cwd }, (err, stdout) => {

			const url = !err && typeof stdout === 'string' && stdout.trim().length
				? stdout.trim()
				: '';

			resolve(sshToUrl(url));
		});
	});
}

export function gitInit(cwd) {
	return new Promise((resolve, reject) => {
		exec('git init', { cwd }, (err) => {

			if (err) {
				reject(err);
				return;
			}

			exec('git add .', { cwd }, (err) => {

				if (err) {
					reject(err);
					return;
				}

				resolve();
			});
		});
	});
}
