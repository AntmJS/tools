export default {
  '**/*.{js,jsx,ts,tsx}': ['npx eslint -c eslint.config.js --fix', 'npx prettier --write'],
  '**/*.ts?(x)': () => 'npx tsc -p tsconfig.json --skipLibCheck',
  '**/*.{css,less,scss}': ['npx stylelint --aei --config stylelint.config.js --fix'],
  '**/*.{md,html,css,less,scss}': ['npx prettier --write'],
}
