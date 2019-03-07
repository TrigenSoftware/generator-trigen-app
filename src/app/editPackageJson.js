
export default function editPackageJson(sourcePkg, targetPkg, pkgProps) {

	if (!pkgProps) {
		return sourcePkg;
	}

	const pkg = {
		...(sourcePkg || targetPkg),
		...pkgProps
	};

	pkg.engines = targetPkg.engines;
	pkg.scripts = targetPkg.scripts;

	if (pkg.license == 'private') {
		pkg.license = 'UNLICENSED';
		pkg.private = true;
	} else {
		Reflect.deleteProperty(pkg, 'private');
	}

	pkg.dependencies = targetPkg.dependencies;
	pkg.devDependencies = targetPkg.devDependencies;

	return pkg;
}
