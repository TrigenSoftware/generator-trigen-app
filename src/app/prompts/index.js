import askForEditPackage from './editPackage';
import askForEditWebman from './editWebmanifest';
import askForGitInit from './gitInit';

const asks = [
	askForEditPackage,
	askForEditWebman,
	askForGitInit
];

export default async function prompts(generator, pkg, webman) {

	const props = generator.config.getAll();

	for (const ask of asks) {
		Object.assign(props, await ask(generator, props, pkg, webman));
	}

	generator.config.set(props);
	generator.config.save();

	return props;
}
