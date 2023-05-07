let googleimages = require("./index")
let puppeteer = require("puppeteer")

puppeteer.launch({headless: false}).then((browser) => {
    googleimages.search(browser, "ea").then(console.log)
})