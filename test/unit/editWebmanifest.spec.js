import editWebmanifest from '../../src/app/editWebmanifest';

describe('editWebmanifest', () => {

	it('should return project webman', () => {

		const projectWebman = {};

		expect(
			editWebmanifest(projectWebman, {}, null)
		).toBe(
			projectWebman
		);
	});

	it('should edit project webman', () => {

		const projectWebman = {
			some: true
		};
		const templateWebman = {
			ignore: true
		};
		const webmanProps = {
			include: 'yeah'
		};

		expect(
			editWebmanifest(projectWebman, templateWebman, webmanProps)
		).toEqual({
			...projectWebman,
			...webmanProps
		});
	});

	it('should edit template webman', () => {

		const projectWebman = null;
		const templateWebman = {
			ignore: true
		};
		const webmanProps = {
			include: 'yeah'
		};

		expect(
			editWebmanifest(projectWebman, templateWebman, webmanProps)
		).toEqual({
			...templateWebman,
			...webmanProps
		});
	});
});
