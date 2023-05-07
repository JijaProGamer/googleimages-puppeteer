const path = require("path")
const gaxios = require('gaxios').request;

const {
    uploadFileXPath,
    uploadFileSelector,
    clickSelector,
    clickXPath,
    goto,
    waitForSelector,
    waitForXPath,
    typeSelector,
    typeXPath,
    sleep
} = require(path.join(__dirname, "/functions.js"))

module.exports = async (browser, search) => {
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            let page = (await browser.pages())[0]

            goto(page, `https://www.google.com/search?q=${search}&tbm=isch`, 0).then(async () => {
                let images = await page.evaluate(() => {
                    return new Promise((resolve) => {
                        let getElementByXpath = (path) => {
                            let elemenent = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
                            return elemenent && elemenent.childNodes
                        }
    
                        let items = Array.from(getElementByXpath(`/html/body/div[2]/c-wiz/div[3]/div[1]/div/div/div/div/div[1]/div[1]/span/div[1]/div[1]`))
                        items = items.filter((item) => item.tagName.toLowerCase() === "div")
    
                        let images = []
    
                        items.forEach((item) => {
                            let childNode = item.childNodes[1]
                            if(childNode){
                                childNode = childNode.childNodes[0].childNodes[0]
                                let parentNode = childNode.parentNode.parentNode.parentNode

                                let src =  childNode.getAttribute('src') || childNode.getAttribute('data-src');
                                let title = parentNode.childNodes[0].innerHTML
                                let owner = parentNode.childNodes[2].getAttribute('href')

                                images.push({
                                    src,
                                    owner,
                                    title
                                })
                            }
                        })
                        resolve(images)
                    })
                })

                let result = []

                for (let [index, image] of images.entries()){
                    result.push({
                        src: image.src,
                        owner: image.owner,
                        title: image.title
                    })
                }

                resolve(result)
            }).catch(err => {
                reject(err)
            })
        }, 500);
    })
}
