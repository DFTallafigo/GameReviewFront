const puppeteerCache = require('path').join(require('os').homedir(), '.cache', 'puppeteer');
const chromeDir = require('fs').readdirSync(puppeteerCache)
  .filter(d => d.startsWith('chrome'))
  .map(d => require('path').join(puppeteerCache, d))
  .find(p => {
    try { return require('fs').statSync(p).isDirectory(); } catch { return false; }
  });
if (chromeDir) {
  const chromeExe = require('child_process').execSync(
    `where /R "${chromeDir}" chrome.exe`,
    { encoding: 'utf-8' }
  ).trim().split('\n')[0];
  if (chromeExe) process.env.CHROME_BIN = chromeExe;
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-spec-reporter')
    ],
    client: {
      clearContext: false,
      jasmine: {
        random: true
      }
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'lcovonly' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['spec', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: true
  });
};