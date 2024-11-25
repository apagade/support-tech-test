const date = new Date().toISOString();
const brokenCapabilities = {
    'browserName': 'googlechrome',
    'platformName': 'macOS 10.15',
    'browserVersion': 'latest',
    'sauce:options': {
        'name': 'Broken Google Search',
        'screenResolution': '1920x1440',
        'build': process.env.GITLAB_CI ? `${process.env.CI_JOB_NAME}-${date}` : `support-tech-test-${date}`
    }
};

const workingCapabilities = {
    'browserName': 'googlechrome',
    'platformName': 'macOS 10.15',
    'browserVersion': 'latest',
    'sauce:options': {
        'name': 'Guinea-Pig Sauce',
        'screenResolution': '1280x960',
        'tags': ['guinea-pig-test', 'selenium-test', 'sauce-test'], // Tags to add to each test
        'build': process.env.GITLAB_CI ? `${process.env.CI_JOB_NAME}-${date}` : `support-tech-test-${date}`
    }
};

exports.brokenCapabilities = brokenCapabilities
exports.workingCapabilities = workingCapabilities
