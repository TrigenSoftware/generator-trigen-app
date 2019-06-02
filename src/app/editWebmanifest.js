
export default function editWebmanifest(projectWebman, templateWebman, webmanProps) {

	if (!webmanProps) {
		return projectWebman;
	}

	const webman = {
		...(projectWebman || templateWebman),
		...webmanProps
	};

	return webman;
}
