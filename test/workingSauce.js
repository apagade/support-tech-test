const {Builder, By, Key, until} = require('selenium-webdriver')
const SauceLabs = require('saucelabs').default;
const assert = require('assert');
const utils = require('./utils')

const SAUCE_USERNAME = process.env.SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;
// const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:443/wd/hub`;
// NOTE: Use the URL below if using our EU datacenter (e.g. logged in to app.eu-central-1.saucelabs.com)
const REGION = `eu-central-1`;
const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.${REGION}.saucelabs.com:443/wd/hub`;

// Initialize Sauce Labs client
const saucelabs = new SauceLabs({
    user: SAUCE_USERNAME,
    key: SAUCE_ACCESS_KEY,
    region: REGION
});

/**
 * Task I: Update the test code so when it runs, the test clicks the "I am a link" link.
 *
 * Task II - Comment out the code from Task I. Update the test code so when it runs,
 * the test is able to write "Sauce" in the text box that currently says "I has no focus".
 *
 * Task III - Update the test code so when it runs, it adds an email to the email field,
 * adds text to the comments field, and clicks the "Send" button.
 * Note that email will not actually be sent!
 *
 * Task IV - Add a capability that adds a tag to each test that is run.
 * See this page for instructions: https://docs.saucelabs.com/dev/test-configuration-options/
 *
 * Task V: Set the status of the test so it shows as "passed" instead of "complete".
 * We've included the node-saucelabs package already. For more info see:
 * https://github.com/saucelabs/node-saucelabs
 */

describe('Working Sauce', function () {
    it('should go to guinea-pig and submit form', async function () {
        let driver = await new Builder().withCapabilities(utils.workingCapabilities)
            .usingServer(ONDEMAND_URL).build();

        /**
         * Goes to Sauce Lab's guinea-pig page and verifies the title
         */

        await driver.get("https://saucelabs.com/test/guinea-pig");
        await assert.strictEqual("I am a page title - Sauce Labs", await driver.getTitle());

        // Task I - Uncomment below lines
        //     let expectedNewUrl = 'https://saucelabs.com/test-guinea-pig2.html';
        //
        //     const link = await driver.findElement(By.id('i am a link'));    // Find the link by its ID
        //     await link.click(); // Click the link
        //
        //     assert.strictEqual(await driver.getCurrentUrl(), expectedNewUrl, 'URL should be https://saucelabs.com/test-guinea-pig2.html');

        // Task II
        let newText = 'Sauce';

        const textbox = await driver.findElement(By.id('i_am_a_textbox'));  // Find the textbox by its ID
        await textbox.clear();  // Clear the existing text
        await textbox.sendKeys(newText);    // Write new text

        const actualNewText = await textbox.getAttribute('value');
        assert.strictEqual(actualNewText, newText, 'Textbox value should be updated');

        // Task III
        // Define test variables
        const TEST_EMAIL = 'ashwinipagade@gmail.com';
        const TEST_COMMENT = 'This is a test from Selenium';

        // Find form elements
        const emailField = await driver.findElement(By.id('fbemail'));
        const commentsField = await driver.findElement(By.id('comments'));
        const submitButton = await driver.findElement(By.id('submit'));

        // Enter email
        await emailField.sendKeys(TEST_EMAIL);
        // Enter comments
        await commentsField.sendKeys(TEST_COMMENT);
        // Click submit button
        await submitButton.click();

        // Verify comments display changed
        const updatedCommentsText = await driver.findElement(By.id('your_comments')).getText();
        assert.ok(updatedCommentsText.includes(TEST_COMMENT), 'Comments should be displayed');

        // Task V
        // Retrieve the session ID (Job ID) from the WebDriver
        const sessionId = (await driver.getSession()).getId();

        // Update test status to "passed"
        await saucelabs.updateJob(SAUCE_USERNAME, sessionId, {
            passed: true,
        });

        await driver.quit();
    });
});
