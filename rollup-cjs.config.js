import babel from 'rollup-plugin-babel';

const pjson = require('./package.json');

export default {
    entry: pjson['jsnext:main'],
    dest: pjson.main,
    format: 'cjs',
    plugins: [ babel() ]
};
