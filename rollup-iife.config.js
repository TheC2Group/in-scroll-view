import babel from 'rollup-plugin-babel';

const pjson = require('./package.json');

const banner = `/*!
 * ${pjson.name}
 * ${pjson.homepage}
 * @version ${pjson.version}
 * @license ${pjson.license} ${pjson.copyright}
 */`;

const filename = pjson['jsnext:main'];

export default {
    entry: filename,
    dest: `iife/${filename}`,
    format: 'iife',
    plugins: [
        babel()
    ],
    moduleName: pjson['export'],
    banner,
    globals: {
        jquery: 'jQuery'
    }
};
