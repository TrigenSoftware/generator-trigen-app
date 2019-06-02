import {
	sshToUrl
} from '../../src/app/helpers';

describe('helpers', () => {

	describe('sshToUrl', () => {

		it('should return url from url', () => {

			expect(
				sshToUrl('https://github.com/TrigenSoftware/weather')
			).toBe(
				'https://github.com/TrigenSoftware/weather'
			);
		});

		it('should return url from ssh', () => {

			expect(
				sshToUrl('git@github.com:TrigenSoftware/weather.git')
			).toBe(
				'https://github.com/TrigenSoftware/weather'
			);
		});

		it('should ignore conversion', () => {

			expect(
				sshToUrl('ftp@github.com:TrigenSoftware/weather.git')
			).toBe(
				''
			);
		});
	});
});
