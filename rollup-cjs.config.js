import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const pjson = require('./package.json');
const filename = pjson['jsnext:main'];

export default {
    input: pjson['jsnext:main'],
    output: {
        file: `cjs/${filename}`,
        format: 'cjs'
    },
    plugins: [
        babel(),
        resolve(),
        commonjs()
    ]
};
