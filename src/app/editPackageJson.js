
import {
	getValue
} from './helpers';

export default function editPackageJson(sourcePkg, targetPkg, pkgProps) {

	if (!pkgProps) {
		return sourcePkg;
	}

	const pkg = {
		...(sourcePkg || targetPkg),
		...pkgProps
	};

	pkg.repository = {
		type: 'git',
		url:  getValue(
			[pkg, 'repository', 'url'],
			[pkg, 'repository'],
			''
		)
	};
	pkg.bugs = {
		url: /^http/.test(pkg.repository.url)
			? `${pkg.repository.url}/issues`
			: ''
	};

	if (targetPkg.os) {
		pkg.os = targetPkg.os;
	}

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
