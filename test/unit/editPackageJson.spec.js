import editPackageJson from '../../src/app/editPackageJson';

describe('editPackageJson', () => {

	it('should return project package', () => {

		const projectPkg = {};

		expect(
			editPackageJson(projectPkg, {}, null)
		).toBe(
			projectPkg
		);
	});

	it('should edit project package', () => {

		const projectPkg = {
			license:    'private',
			repository: {
				type: 'git',
				url:  'http://someUrl'
			}
		};
		const templatePkg = {
			os:              '!win',
			scripts:         'scripts',
			dependencies:    'dependencies',
			devDependencies: 'devDependencies'
		};
		const pkgProps = {};

		expect(
			editPackageJson(projectPkg, templatePkg, pkgProps)
		).toEqual({
			...projectPkg,
			...templatePkg,
			bugs: {
				url: 'http://someUrl/issues'
			},
			license: 'UNLICENSED',
			private: true
		});
	});

	it('should edit template package', () => {

		const projectPkg = null;
		const templatePkg = {
			scripts:         'scripts2',
			dependencies:    'dependencies',
			devDependencies: 'devDependencies'
		};
		const pkgProps = {
			repository: 'git://someUrl',
			license:    'MIT'
		};

		expect(
			editPackageJson(projectPkg, {
				...templatePkg,
				private: true
			}, pkgProps)
		).toEqual({
			...pkgProps,
			...templatePkg,
			repository: {
				type: 'git',
				url:  'git://someUrl'
			},
			bugs: {
				url: ''
			}
		});
	});
});
