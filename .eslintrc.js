module.exports = {
  extends: ['alloy', 'alloy/typescript'],
  env: {
    // Your environments (which contains several predefined global variables)
    //
    // browser: true,
    node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // Your global variables (setting to false means it's not allowed to be reassigned)
    //
    // myGlobal: false
  },
  rules: {
    // Customize your rules
    complexity: ['warn', { max: 25 }],
  },
  ignorePatterns: [".DS_Store", "node_modules", "dist", "dist-ssr", "*.local", ".npmrc", "build", "release"],
}
