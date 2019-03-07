import path from 'path';
import {
	whoAmI,
	gitUrl,
	getValue
} from '../helpers';

const licenses = [
	'MIT',
	'private'
];

function indexOfLicense(inputLicense) {

	const license = inputLicense == 'UNLICENSED'
		? 'private'
		: inputLicense;

	return licenses.indexOf(license);
}

export default async function askForPackageInfo(generator, props, pkg) {

	generator.log(`${pkg ? 'Editing' : 'Creation'} of package.json:`);

	const destinationRoot = generator.destinationRoot();
	const packagePrompts = [{
		type:    'input',
		name:    'name',
		message: 'name:',
		default: getValue(
			[pkg, 'name'],
			[props, 'pkg', 'name'],
			path.basename(destinationRoot)
		)
	}, {
		type:     'input',
		name:     'version',
		message:  'version:',
		default:  getValue(
			[pkg, 'version'],
			[props, 'pkg', 'version'],
			'1.0.0'
		),
		validate: _ => /^\d+\.\d+\.\d+$/.test(_)
	}, {
		type:    'input',
		name:    'description',
		message: 'description:',
		default: getValue(
			[pkg, 'description'],
			[props, 'pkg', 'description']
		)
	}, {
		type:    'input',
		name:    'repository',
		message: 'repository url:',
		default: getValue(
			[pkg, 'repository'],
			[props, 'pkg', 'repository'],
			await gitUrl(destinationRoot)
		)
	}, {
		type:    'input',
		name:    'author',
		message: 'author:',
		default: getValue(
			[pkg, 'author'],
			[props, 'pkg', 'author'],
			await whoAmI()
		)
	}, {
		type:    'list',
		name:    'license',
		message: 'license:',
		choices: licenses,
		default: getValue(
			[pkg, 'license', indexOfLicense],
			[props, 'pkg', 'license', indexOfLicense],
			0
		)
	}];

	return generator.prompt(packagePrompts);
}
