require('dotenv').config();

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://coingecko.com/en');

  const loginSelector = 'a.text-body[data-target="#signInModal"]';

  await page.waitForSelector(loginSelector);
  await page.click(loginSelector);
  await page.waitForSelector('form#signInModalForm');

  await page.type('input#signInEmail', process.env.USERNAME);
  await page.type('input#signInPassword', process.env.PASSWORD);

  await page.keyboard.press('Enter');

  await page.waitForNavigation();

  await page.goto('https://www.coingecko.com/account/candy?locale=en');

  const buttonCollectSelector = 'form.button_to input.collect-candy-button';

  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });

  const rewardButton = await page.$(buttonCollectSelector);

  if (rewardButton === null) {
    console.log('Daily reward already collected.');
  } else {
    rewardButton.click();
    console.log('Reward collected!');
  }

  await browser.close();
})();