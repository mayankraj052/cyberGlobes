module.exports = {
	apps: [
		{
			name: 'sveltekit-app',
			script: 'build/index.js',
			env: {
				NODE_ENV: 'production',
				PORT: 3000
			}
		}
	]
};
