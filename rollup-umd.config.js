import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const pjson = require('./package.json');

const banner = `/*!
 * ${pjson.name}
 * ${pjson.homepage}
 * @version ${pjson.version}
 * @license ${pjson.license} ${pjson.copyright}
 */`;

const filename = pjson['jsnext:main'];

export default {
    input: filename,
    output: {
        banner,
        file: `umd/${filename}`,
        format: 'umd',
        globals: {
            jquery: 'jQuery'
        },
        name: pjson['export'],
    },
    plugins: [
        babel(),
        resolve(),
        commonjs()
    ]
};
