import path from 'path';
import { getValue } from '../helpers';

const dir = [
	'auto',
	'ltr',
	'rtl'
];
const display = [
	'fullscreen',
	'standalone',
	'minimal-ui',
	'browser'
];
const orientation = [
	'any',
	'natural',
	'landscape',
	'landscape-primary',
	'landscape-secondary',
	'portrait',
	'portrait-primary',
	'portrait-secondary'
];
const defaultOrientation = 5;

export default async function askForWebmanInfo(generator, props, pkg, webman) {

	generator.log(`${webman ? 'Editing' : 'Creation'} of manifest.json:`);

	const destinationRoot = generator.destinationRoot();
	const webmanPrompts = [{
		type:    'input',
		name:    'name',
		message: 'name:',
		default: getValue(
			[webman, 'name'],
			[props, 'webman', 'name'],
			[props, 'pkg', 'name'],
			[pkg, 'name'],
			path.basename(destinationRoot)
		)
	}];
	const result = await generator.prompt(webmanPrompts);
	const webmanPrompts2 = [{
		type:    'input',
		name:    'short_name',
		message: 'short name:',
		default: getValue(
			[webman, 'short_name'],
			[props, 'webman', 'short_name'],
			[result, 'name'],
			[props, 'pkg', 'name'],
			[pkg, 'name'],
			path.basename(destinationRoot)
		)
	}, {
		type:    'input',
		name:    'description',
		message: 'description:',
		default: getValue(
			[webman, 'description'],
			[props, 'webman', 'description'],
			[props, 'pkg', 'description'],
			[pkg, 'description']
		)
	}, {
		type:    'list',
		name:    'dir',
		message: 'text directionality:',
		choices: dir,
		default: getValue(
			[webman, 'dir', _ => dir.indexOf(_)],
			[props, 'webman', 'dir', _ => dir.indexOf(_)],
			0
		)
	}, {
		type:    'input',
		name:    'lang',
		message: 'language:',
		default: getValue(
			[webman, 'lang'],
			[props, 'webman', 'lang'],
			'en-US'
		)
	}, {
		type:    'list',
		name:    'display',
		message: 'display:',
		choices: display,
		default: getValue(
			[webman, 'display', _ => display.indexOf(_)],
			[props, 'webman', 'display', _ => display.indexOf(_)],
			1
		)
	}, {
		type:    'list',
		name:    'orientation',
		message: 'orientation:',
		choices: orientation,
		default: getValue(
			[webman, 'orientation', _ => orientation.indexOf(_)],
			[props, 'webman', 'orientation', _ => orientation.indexOf(_)],
			defaultOrientation
		)
	}, {
		type:    'input',
		name:    'scope',
		message: 'scope:',
		default: getValue(
			[webman, 'scope'],
			[props, 'webman', 'scope'],
			'/'
		)
	}, {
		type:    'input',
		name:    'start_url',
		message: 'start_url:',
		default: getValue(
			[webman, 'start_url'],
			[props, 'webman', 'start_url'],
			'/?homescreen=1'
		)
	}, {
		type:    'input',
		name:    'background_color',
		message: 'background_color:',
		default: getValue(
			[webman, 'background_color'],
			[props, 'webman', 'background_color']
		)
	}];

	Object.assign(result, await generator.prompt(webmanPrompts2));

	const webmanPrompts3 = [{
		type:    'input',
		name:    'theme_color',
		message: 'theme_color:',
		default: getValue(
			[webman, 'theme_color'],
			[props, 'webman', 'theme_color'],
			[result, 'background_color']
		)
	}];

	Object.assign(result, await generator.prompt(webmanPrompts3));

	return result;
}
