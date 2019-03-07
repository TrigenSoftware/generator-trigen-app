import { getValue } from '../helpers';
import askForPackageInfo from './packageInfo';

export default async function askForEditPackage(generator, props, pkg) {

	let editPackage = true;

	if (pkg) {

		const editPackagePrompts = [{
			type:    'confirm',
			name:    'editPackage',
			message: 'Would you edit package.json file?',
			default: getValue(
				[props, 'editPackage'],
				true
			)
		}];
		const result = await generator.prompt(editPackagePrompts);

		editPackage = result.editPackage;
	}

	if (editPackage) {

		const pkgInfo = await askForPackageInfo(generator, props, pkg);

		return {
			editPackage,
			pkg: pkgInfo
		};
	}

	return { editPackage };
}
