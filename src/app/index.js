import path from 'path';
import fs from 'fs';
import Generator from 'yeoman-generator';
import chalk from 'chalk';
import yosay from 'yosay';
import {
	hasYarn,
	gitInit
} from './helpers';
import prompts from './prompts';
import editPackageJson from './editPackageJson';
import editWebmanifest from './editWebmanifest';
import {
	getTemplate,
	deleteTemplate,
	makeReadme,
	getFiles
} from './template';

export default class GeneratorTrigenFrontend extends Generator {

	constructor(args, opts) {

		super(args, opts);

		this.option('silent', {
			description: 'Run generator without prompts, using defaults from .yo-rc.json.',
			alias:       'S',
			default:     false
		});

		this.props = {};
		this.pkg = false;
		this.webman = false;
		this.projectTemplateDir = null;
	}

	projectTemplatePath(...args) {
		return path.join(
			this.projectTemplateDir,
			...args
		);
	}

	_package() {

		const pathToPkg = this.destinationPath('package.json');

		if (this.fs.exists(pathToPkg)) {
			return this.fs.readJSON(pathToPkg);
		}

		return false;
	}

	_webmanifest() {

		const pathToWebman = this.destinationPath('src', 'manifest.json');

		if (this.fs.exists(pathToWebman)) {
			return this.fs.readJSON(pathToWebman);
		}

		return false;
	}

	async prompting() {

		this.log(
			yosay(`Welcome to the delightful ${chalk.green('trigen-app')} generator!`)
		);

		const { silent } = this.options;
		const pkgOrNot = this._package();
		const webmanOrNot = this._webmanifest();

		if (pkgOrNot) {
			this.pkg = pkgOrNot;
		}

		if (webmanOrNot) {
			this.webman = webmanOrNot;
		}

		if (silent) {

			const props = this.config.getAll();

			if (!Object.keys(props).length) {
				throw new Error(chalk.red('`.yo-rc.json` file not found.'));
			}

			this.props = props;

			return;
		}

		this.props = await prompts(this, this.pkg, this.webman);
	}

	_readTargetPackage() {
		return this.fs.readJSON(
			this.projectTemplatePath('package.json')
		);
	}

	_editPackageJson() {

		const targetPkg = this._readTargetPackage();
		const { pkg: pkgProps } = this.props;
		const { pkg } = this;

		this.pkg = editPackageJson(pkg, targetPkg, pkgProps);
	}

	_readTargetWebmanifest() {
		return this.fs.readJSON(
			this.projectTemplatePath('src', 'manifest.json')
		);
	}

	_editWebmanifest() {

		const targetWebman = this._readTargetWebmanifest();
		const { webman: webmanProps } = this.props;
		const { webman } = this;

		this.webman = editWebmanifest(webman, targetWebman, webmanProps);
	}

	async configuring() {
		this.log('Downloading template...');
		this.projectTemplateDir = await getTemplate(
			this.destinationPath.bind(this),
			process.env.TEMPLATE
		);
		this._editPackageJson();
		this._editWebmanifest();
	}

	_makeReadme() {

		const projectReadme = this.fs.read(
			this.projectTemplatePath('README.md')
		);
		const readme = makeReadme(projectReadme, this.props);

		this.fs.write(
			this.destinationPath('README.md'),
			readme
		);
	}

	async writing() {

		const {
			pkg,
			webman,
			props
		} = this;
		const {
			pkg: pkgProps,
			webman: webmanProps
		} = props;

		if (pkgProps && pkg) {
			this.fs.extendJSON(
				this.destinationPath('package.json'),
				pkg
			);
		}

		if (webmanProps && webman) {
			this.fs.extendJSON(
				this.destinationPath('src', 'manifest.json'),
				webman
			);
		}

		this._makeReadme();

		const files = getFiles(
			{
				license: pkgProps && pkgProps.license == 'MIT',
				src:     !fs.existsSync(this.destinationPath('src'))
			},
			this.projectTemplatePath.bind(this)
		);

		this.fs.copy(files, this.destinationRoot());

		await deleteTemplate(this.projectTemplateDir);
	}

	async _gitInit() {

		if (this.props.gitInit) {
			await gitInit(this.destinationRoot());
		}
	}

	async install() {

		await this._gitInit();

		const withYarn = await hasYarn();

		if (withYarn) {
			this.yarnInstall();
		} else {
			this.npmInstall();
		}
	}
}
