import util from 'util';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import unzip from 'unzipper';
import del from 'del';

const WEATHER_RELEASES = 'https://api.github.com/repos/TrigenSoftware/weather/releases';
const TEMPLATE_DIR = '.trigen-template';
const TEMPLATE_CACHE = path.join(__dirname, 'trigen-template-cache.zip');
const readdir = util.promisify(fs.readdir);

async function getLatestWeatherTemplate() {

	const response = await axios.get(WEATHER_RELEASES, {
		responseType: 'json'
	});

	return response.data[0].zipball_url;
}

async function getTemplateStream(templateUrl) {

	if (/^http/.test(templateUrl)) {

		const response = await axios.get(templateUrl, {
			responseType: 'stream'
		});

		return response.data;
	}

	return fs.createReadStream(templateUrl);
}

async function getCacheableTemplateStream(customTemplateUrl) {

	if (typeof customTemplateUrl === 'string') {
		return getTemplateStream(customTemplateUrl);
	}

	try {

		const latestWeatherTemplateUrl = await getLatestWeatherTemplate();
		const downloadStream = await getTemplateStream(latestWeatherTemplateUrl);

		downloadStream.pipe(
			fs.createWriteStream(TEMPLATE_CACHE)
		);

		return downloadStream;

	} catch (err) {

		if (err.request && fs.existsSync(TEMPLATE_CACHE)) {
			return fs.createReadStream(TEMPLATE_CACHE);
		}

		throw err;
	}
}

export async function getTemplate(destinationPath, customTemplateUrl) {

	const projectTemplateDir = destinationPath(TEMPLATE_DIR);
	const templateReadStream = await getCacheableTemplateStream(customTemplateUrl);

	return new Promise((resolve, reject) => {
		templateReadStream
			.pipe(unzip.Extract({
				path: projectTemplateDir
			}))
			.on('error', reject)
			.on('close', async () => {

				const [dir] = await readdir(projectTemplateDir);

				resolve(path.join(projectTemplateDir, dir));
			});
	});
}

export function deleteTemplate(projectTemplateDir) {
	return del([
		path.join(
			projectTemplateDir.split(TEMPLATE_DIR)[0],
			TEMPLATE_DIR
		)
	]);
}

export function getFiles({
	license,
	src
}, projectTemplatePath, templatePath) {

	const allFiles = [
		projectTemplatePath('.*'),
		projectTemplatePath('**', '*')
	];
	const readme = [
		templatePath('README.md')
	];
	const files = [
		[false, allFiles],
		[true, readme]
	];

	if (!license) {
		allFiles.push(`!${projectTemplatePath('LICENSE')}`);
	}

	if (!src) {
		allFiles.push(`!${projectTemplatePath('src', '**', '*')}`);
	}

	return files;
}
