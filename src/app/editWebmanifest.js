
export default function editWebmanifest(sourceWebman, targetWebman, webmanProps) {

	if (!webmanProps) {
		return sourceWebman;
	}

	const webman = {
		...(sourceWebman || targetWebman),
		...webmanProps
	};

	return webman;
}
