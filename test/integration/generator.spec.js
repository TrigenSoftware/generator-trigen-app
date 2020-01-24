/* eslint-disable import/unambiguous */
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk');
const del = require('del');
// Constants
const YO_RC = '.yo-rc.json';
const SANDBOX_PATH = path.join(__dirname, 'sandbox');
const WEATHER_PATH = path.join(SANDBOX_PATH, 'weather');
const shouldLeave = process.argv.includes('--leave');

function cleanup() {
	del.sync([path.join(SANDBOX_PATH, 'node_modules')]);
	del.sync([path.join(SANDBOX_PATH, 'yarn.lock')]);
	del.sync([WEATHER_PATH]);
}

try {

	console.log(chalk.blue('\n> Cleaning...\n'));

	cleanup();

	console.log(chalk.blue('\n> Creating `weather` directory...\n'));

	fs.mkdirSync(WEATHER_PATH);
	fs.copyFileSync(
		path.join(SANDBOX_PATH, YO_RC),
		path.join(WEATHER_PATH, YO_RC)
	);

	console.log(chalk.blue('\n> Installing sandbox dependencies...\n'));

	execSync('yarn', {
		stdio: 'inherit',
		cwd:   SANDBOX_PATH
	});

	console.log(chalk.blue('\n> Generating...\n'));

	execSync(`yarn yo weather -S -L`, {
		stdio: 'inherit',
		cwd:   SANDBOX_PATH
	});

	console.log(chalk.blue('\n> Testing...\n'));

	execSync(`yarn jest --clearCache`, {
		stdio: 'inherit',
		cwd:   WEATHER_PATH
	});
	execSync(`yarn test`, {
		stdio: 'inherit',
		cwd:   WEATHER_PATH
	});

} catch (err) {

	execSync(`yarn artifacts`, {
		stdio: 'inherit',
		cwd:   WEATHER_PATH
	});

	throw err;

} finally {

	if (!shouldLeave) {
		console.log(chalk.blue('\n> Cleaning...\n'));
		cleanup();
	}
}
