var path = require('path');

module.exports = async () => {
    return {
        rootDir: path.resolve(__dirname),
        transform: {
            '^.+\\.tsx?$': 'ts-jest',
        },
        testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
        moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
        setupFiles: ['./tests/Setup.ts']
    };
};