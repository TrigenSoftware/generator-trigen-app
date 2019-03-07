import { getValue } from '../helpers';
import askForWebmanInfo from './webmanifestInfo';

export default async function askForEditWebman(generator, props, pkg, webman) {

	let editWebman = true;

	if (webman) {

		const editWebmanPrompts = [{
			type:    'confirm',
			name:    'editWebman',
			message: `Would you edit manifest.json file?`,
			default: getValue(
				[props, 'editWebman'],
				true
			)
		}];
		const result = await generator.prompt(editWebmanPrompts);

		editWebman = result.editWebman;
	}

	if (editWebman) {

		const webmanInfo = await askForWebmanInfo(generator, props, pkg, webman);

		return {
			editWebman,
			webman: webmanInfo
		};
	}

	return { editWebman };
}
