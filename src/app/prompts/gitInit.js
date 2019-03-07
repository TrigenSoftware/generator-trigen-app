import fs from 'fs';
import {
	hasGit,
	getValue
} from '../helpers';

export default async function gitInit(generator, props) {

	const withGit = await hasGit();

	if (!withGit || fs.existsSync(generator.destinationPath('.git'))) {
		return {};
	}

	const gitInitPrompts = [{
		type:    'confirm',
		name:    'gitInit',
		message: `Would you init git repository and add sources into it?`,
		default: getValue(
			[props, 'gitInit'],
			true
		)
	}];

	return generator.prompt(gitInitPrompts);
}
