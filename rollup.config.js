import {
	external
} from '@trigen/scripts-plugin-rollup/helpers';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import pkg from './package.json';

const plugins = [
	eslint({
		exclude:      ['**/*.json', 'node_modules/**'],
		throwOnError: true
	}),
	commonjs(),
	babel({
		runtimeHelpers: true
	})
];

export default {
	input:    'src/app/index.js',
	plugins,
	external: external(pkg, true),
	output:   {
		file:      pkg.main,
		format:    'cjs',
		sourcemap: 'inline'
	}
};
