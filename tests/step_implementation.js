/* globals gauge*/
"use strict";
const path = require('path');
const {
    $,
    openBrowser,
    write,
    closeBrowser,
    goto,
    press,
    screenshot,
    above,
    click,
    checkBox,
    listItem,
    toLeftOf,
    link,
    text,
    into,
    textBox,
    evaluate,
    hover,
    resizeWindow,
    goBack,
    toRightOf,
    currentURL,
    waitFor
} = require('taiko');
const assert = require("assert");
const { Console } = require('console');
const expect = require("chai").expect;
const headless = process.env.headless_chrome.toLowerCase() === 'true';

/*beforeSuite(async () => {
   await console.log('before suite');
});

beforeSpec(async () => {
    await console.log('before spec');
});
beforeScenario(async () => {
    await console.log('before scenario');
});
beforeStep(async () => {
    await console.log('before step');
});
afterStep(async () => {
    await console.log('after step');
});
*/
afterScenario(async () => {
    await console.log('after scenario');
    await closeBrowser();
});

/*afterSpec(async () => {
    await console.log('after spec');
});

afterSuite(async () => {
   // await console.log('after suite');
   // await closeBrowser();
});*/

// Return a screenshot file name
gauge.customScreenshotWriter = async function () {
    const screenshotFilePath = path.join(process.env['gauge_screenshots_dir'],
        `screenshot-${process.hrtime.bigint()}.png`);

    await screenshot({
        path: screenshotFilePath
    });
    return path.basename(screenshotFilePath);
};

step("Add task <item>", async (item) => {
    await write(item, into(textBox("What needs to be done?")));
    await press('Enter');
});

step("View <type> tasks", async function (type) {
    await click(link(type));
});

step("Complete tasks <table>", async function (table) {
    for (var row of table.rows) {
        await click(checkBox(toLeftOf(row.cells[0])));
    }
});

step("Clear all tasks", async function () {
    await evaluate(() => localStorage.clear());
});

step("Open todo application", async function () {
    await goto("todo.taiko.dev");
});

step("Must not have <table>", async function (table) {
    for (var row of table.rows) {
        assert.ok(!await text(row.cells[0]).exists(0, 0));
    }
});

step("Must display <message>", async function (message) {
    assert.ok(await text(message).exists(0, 0));
});



step("Add tasks <table>", async function (table) {
    for (var row of table.rows) {
        await write(row.cells[0]);
        await press('Enter');
    }
});

step("Must have <table>", async function (table) {
    for (var row of table.rows) {
        assert.ok(await text(row.cells[0]).exists());
    }
});

step("Open <page> with headless mode <isheadless>", {continueOnFailure : true}, async function (page, isheadless) {
    var headlessParam = isheadless.toLowerCase() === 'true';
    await openBrowser({headless: headlessParam});
    //await resizeWindow({width: 700, height: 800});
    await goto(page);
    var currentUrl = await currentURL();
    expect(currentUrl).to.contain(page);
});

step("Click on Documentation button", async function () {
    await click("Documentation");
});

step("Click on Search input", async function () {
    await click($(`#search`));
});

step("Click on error button", async function () {
    /*try {
        await click($(`#error`));
    } catch(e) {
        console.log('Az error gomb nem található');
        console.log(e);
    }*/
});

step("Hover on Blog button", async function() {
	await hover($(`.link_examples`));
});

step("Write <searchParam> in the search field", async function(searchParam) {
	await write(searchParam, $(`#search`));
});

step("Press Enter", async function() {
	await press('Enter');
});

step("Find Plugins nav item", async function() {
    var pluginsListItem = await listItem('Plugins');
    console.log(await pluginsListItem.attribute('class'));
    if (pluginsListItem.isVisible() == true) {
	    await click(pluginsListItem);
    }
});

step("Find Plugins nav item2", async function() {
    var pluginsListItem = await $(`.link_plugins`);
    console.log(await pluginsListItem.attribute('class'));
    if (pluginsListItem.isVisible() == true) {
	    await click(pluginsListItem);
    }
});

step("Click on bejelentkezes", async function() {
	var loginBtn = await $(`a[class='site-sub-nav__link site-sub-nav__link--has-icon']`);
    var hamburgerMenu = await $(`.hamburger-box`);
    var megjelentALogin = await loginBtn.isVisible();
    if (megjelentALogin == true) {
        await click(loginBtn);
    } else {
        await click(hamburgerMenu);
        await click($(`a[href='/belepes']`), { navigationTimeout: 5000 , waitForEvents: ['DOMContentLoaded']});
    }
});

step("Write out category names", {continueOnFailure : true}, async function() {
	let categoryList = await link({class:'home-shop-categories__card__link'}).elements();
    try {
        expect(await categoryList[0].text()).to.equal("Gépösszerak");
    } catch(e) {
        console.log(e);
    }
    assert.strictEqual(await categoryList[0].text(), "Gépösszerakó");
    expect(await categoryList[0].text() == "Gépösszerakó").to.be.ok;
    expect(categoryList).to.have.lengthOf(1);
    expect(categoryList.length == 10).to.be.ok;
    /*for (let category of categoryList) {
        let szoveg = await category.text();
        console.log(await link(szoveg).attribute('href'));
    }*/
});

step("Fill login form using id, name, classname", async function () {
	await click("Bejelentkezés");
    await write("micimacko", into($(`#_username`)));
    await write("mez", into($(`//*[@name="_password"]`)));
    await click($(`.control__label--remember-me-checkout.control__label`));
    await press('Escape');
});

step("Search for dell products using Taiko smart selector", async () => {
    await write("dell", into(textBox("Keresés...")));
    await press("Enter", {waitForEvents: ['DOMContentLoaded']});
});

step("Open product with product id ms116 in its URL using CSS", async function () {
    await click($(`a[href*="ms116"]`));
    await goBack(); // convenience step
});

step("Add 3rd product to cart using XPath", async function () {
    await click(($(`(//*[@title='Kosárba'])[3]`)));
    await waitFor("Kosár tartalma");
    await waitFor(5000);
    await press('Escape');
});

step("Open product right to KB216 using relative selector + XPath", async function () {
    await click(link("dell"), toRightOf($(`//div[contains(text(),"KB216")]`)));
});

step("Check shop menuitem", async function() {
	let menuItem = (await listItem({class:'site-nav__item'}).elements());
    //expect(await menuItem.text()).to.equal("Shop");
    expect(await menuItem[0].text()).to.be.a('String');
});

git clone

git add
git commit -m "ez az..."
git push