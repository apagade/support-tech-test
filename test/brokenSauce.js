const {Builder, By, Key, until} = require('selenium-webdriver')
const utils = require('./utils')
const assert = require('assert');

const SAUCE_USERNAME = process.env.SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;
// const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.us-west-1.saucelabs.com:443/wd/hub`;
// NOTE: Use the URL below if using our EU datacenter (e.g. logged in to app.eu-central-1.saucelabs.com)
const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.eu-central-1.saucelabs.com:443/wd/hub`;


/**
 * Run this test before working on the problem.
 * When you view the results on your dashboard, you'll see that the test "Failed".
 * Your job is to figure out why the test failed and make the changes necessary to make the test pass.
 * Once you get the test working, update the code so that when the test runs, it can reach the Sauce Labs homepage,
 * hover over 'Resources' and then clicks the 'Documentation' link
 */

describe('Broken Sauce', function () {
    it('should go to Google and click Sauce', async function () {

        try {
            let driver = await new Builder().withCapabilities(utils.brokenCapabilities)
                .usingServer(ONDEMAND_URL).build();

            await driver.get("https://www.google.com");
            // If you see a German or English GDPR modal on google.com you
            // will have to code around that or use the us-west-1 datacenter.
            // You can investigate the modal elements using a Live Test(https://app.saucelabs.com/live/web-testing)

            let search = await driver.findElement(By.name("q"));
            await search.sendKeys("Sauce Labs");

            let button = await driver.findElement(By.name("btnK"))
            await button.click()

            let page = await driver.findElement(By.partialLinkText("Sauce Labs: Cross Browser Testing, Selenium Testing"));
            page.click();

            await driver.wait(until.titleContains('Sauce Labs'), 10000);
            const homepageTitle = await driver.getTitle();
            assert.ok(homepageTitle.includes('Sauce Labs'), 'The title should include "Sauce Labs"');

            // Resources does not contain 'Documentation' link. Using Developers instead which has 'Documentation' link
            let resourcesMenu = await driver.findElement(By.xpath("//*[@id=\"__next\"]/header/div/div/div[1]/div[2]/div[4]/div[1]/div[1]/span"));
            await driver.actions().move({origin: resourcesMenu}).perform();

            let documentationLink = await driver.findElement(By.xpath("//a[.//span[contains(text(), 'Documentation')]]"));
            await driver.wait(until.elementIsVisible(documentationLink), 10000);
            await documentationLink.click();

            await driver.quit();
        } catch (err) {
            // hack to make this pass for Gitlab CI
            // candidates can ignore this
            if (process.env.GITLAB_CI === 'true') {
                console.warn("Gitlab run detected.");
                console.warn("Skipping error in brokenSauce.js");
            } else {
                throw err;
            }
        }

    });
});
