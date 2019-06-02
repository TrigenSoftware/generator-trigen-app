
import {
	getValue
} from './helpers';

export default function editPackageJson(projectPkg, templatePkg, pkgProps) {

	if (!pkgProps) {
		return projectPkg;
	}

	const pkg = {
		...(projectPkg || templatePkg),
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

	if (templatePkg.os) {
		pkg.os = templatePkg.os;
	}

	pkg.scripts = templatePkg.scripts;

	if (pkg.license === 'private') {
		pkg.license = 'UNLICENSED';
		pkg.private = true;
	} else {
		Reflect.deleteProperty(pkg, 'private');
	}

	pkg.dependencies = templatePkg.dependencies;
	pkg.devDependencies = templatePkg.devDependencies;

	return pkg;
}
