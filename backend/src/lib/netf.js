const { Builder, By, Key, until } = require('selenium-webdriver');
//const express = require('express');

/*const { id } = req.params;
console.log(id);
const { description } = req.body;
console.log(description);*/

(async function cliente() {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        await driver.get('https://www.netflix.com/co/login');
        //await driver.findElement(By.name('q')).sendKeys('fecebook', Key.RETURN);
        //await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
        await driver.findElement(By.id('id_userLoginId')).sendKeys('jhonyleon05@yopmail.com');
        await driver.findElement(By.id('id_password')).sendKeys('12345', Key.RETURN);
    } finally {
        //await driver.quit();
    }
})();