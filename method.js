const axios = require('axios')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const centreList = [
    { "value": "3#14", "city": "北京", code: "BJ" },
    { "value": "4#15", "city": "上海", code: "SH" },
    { "value": "5#16", "city": "广州", code: "GZ" },
    { "value": "3#57", "city": "成都", code: "CD" },
    { "value": "5#64", "city": "昆明", code: "KM" },
    { "value": "5#65", "city": "福州", code: "FZ" },
    { "value": "5#66", "city": "长沙", code: "CS" },
    { "value": "3#67", "city": "重庆", code: "CQ" },
    { "value": "3#68", "city": "西安", code: "XA" },
    { "value": "4#69", "city": "杭州", code: "HZ" },
    { "value": "3#70", "city": "济南", code: "JN" },
    { "value": "4#71", "city": "南京", code: "NJ" },
    { "value": "3#72", "city": "武汉", code: "WH" },
    { "value": "5#73", "city": "深圳", code: "SZ" },
    { "value": "3#74", "city": "沈阳", code: "SY" },
]

//进启动浏览器，进入登记页面
async function openRegPage(city = "BJ") {
    const page = await new Promise(r => puppeteer.launch({
        headless: "new",
        args: ['--disable-web-security']
    }).then(async (browser) => {
        const page = await browser.newPage();
        console.log(new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0], `Scanning ${city}...`)
        let success = false
        while (!success) {
            try {
                await page.goto('https://web.blscn.cn/book_appointment.php', { waitUntil: 'networkidle0' });
                success = true
            } catch { }
        }
        await page.evaluateOnNewDocument(() => {
            window.chrome = {};
            window.chrome.app = {
                InstallState: 'hehe',
                RunningState: 'haha',
                getDetails: 'xixi',
                getIsInstalled: 'ohno',
            };
            window.chrome.csi = function () { };
            window.chrome.loadTimes = function () { };
            window.chrome.runtime = function () { };
        });
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'plugins', {
                //伪装真实的插件信息
                get: () => [
                    {
                        0: { type: 'application/pdf', suffixes: 'pdf', description: '', enabledPlugin: Plugin, },
                        description: '', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', length: 1, name: 'Chrome PDF Viewer',
                    },
                    {
                        0: { type: 'application/x-nacl', suffixes: '', description: 'Native Client Executable', enabledPlugin: Plugin, },
                        1: { type: 'application/x-pnacl', suffixes: '', description: 'Portable Native Client Executable', enabledPlugin: Plugin, },
                        description: '', filename: 'internal-nacl-plugin', length: 2, name: 'Native Client',
                    },
                ],
            });
        });
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en',
            authority: 'uk.blsspainvisa.com',
            'cache-control': 'max-age=0',
            'upgrade-insecure-requests': '1',
            'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko)',
            scheme: 'https',
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
        });
        await wait();
        await new Promise(async (r) => {
            let yet = true
            while (yet)
                try {
                    let inputElement = (await page.$$('.popup-appCloseIcon'))[0];
                    await inputElement.click();
                    yet = false
                    r()
                }
                catch {
                    await wait();
                }
        })
        await wait();

        const hcap = await page.$$eval(".h-captcha", (e) => e[0].getAttribute("data-sitekey"))

        const key = "d3582fd1784c7d1407a25d3dd1286499"
        let sendCap = null

        await new Promise(async (r) => {
            let yet = true
            while (yet) {
                try {
                    sendCap = await axios.get(`https://2captcha.com/in.php?key=${key}&method=hcaptcha&sitekey=${hcap}&pageurl=https://web.blscn.cn/book_appointment.php&JSON=1`)
                    if (sendCap.data.status == 1) {
                        yet = false
                        r()
                    }
                }
                catch {
                    return
                }
            }
        })

        const value = centreList.find(e => e.code == city).value
        await page.select('#centre', value);
        await page.mouse.move(300.125, 200.106);
        await page.mouse.down();
        await page.mouse.up();
        await wait(2000);
        await page.select('#category', 'Normal');
        inputElement = await page.$("#phone")
        await inputElement.type("18790594729", { delay: Math.random * 100 + 100 });
        inputElement = await page.$("#email")
        await inputElement.type("corfer@ye.net", { delay: Math.random * 100 + 100 });

        await wait(3000);

        const id = sendCap.data.request
        let text = "CAPCHA_NOT_READY"
        while (text == "CAPCHA_NOT_READY") {
            let getCap = null
            try {
                getCap = await axios.get(`https://2captcha.com/res.php?key=${key}&action=get&id=${id}&JSON=1`)
                if (getCap) text = getCap.data.request
            } catch {
            }
        }
        inputElement = (await page.$$(".h-captcha"))[0]
        await wait(3000)
        await page.evaluate((text) => {
            document.getElementsByClassName("h-captcha")[0].childNodes[1].style.display = "block"
            document.getElementsByClassName("h-captcha")[0].childNodes[1].value = text
            document.getElementsByClassName("h-captcha")[0].childNodes[2].style.display = "block"
            document.getElementsByClassName("h-captcha")[0].childNodes[2].value = text
            try {
                document.getElementsByTagName("input")[6].click()
            } catch { }
        }, text)
        await wait(4000)
        await new Promise(async (r) => {
            let yet = true
            while (yet)
                try {
                    inputElement = (await page.$$('.popup-appCloseIcon'))[0];
                    await inputElement.click();
                    yet = false
                    r()
                }
                catch {
                    await wait();
                }
        })

        await wait(3000);

        await page.mouse.move(100 + Math.random(), 0 + Math.random());
        await page.mouse.down();
        await page.mouse.up();

        await new Promise(async (r) => {
            let yet = true
            let wrong = 0;
            while (yet)
                try {
                    wrong++
                    inputElement = (await page.$$("button"))[0]
                    inputElement.click()
                    yet = false
                    r(true)
                } catch {
                    if (wrong > 10) {
                        page.browser().close()
                        r(false)
                    }
                    await wait();
                }
        })
        await wait();

        r(page)
    }));
    return function () {
        return { page }
    }
}

async function getAvailableDate(page) {
    await wait(3000);
    const pass = await new Promise(async (r) => {
        let yet = true
        let wrong = 0;
        while (yet)
            try {
                wrong++;
                inputElement = (await page.$$(".validate"))[0]
                inputElement.click()
                yet = false
                r(true)
            } catch {
                if (wrong > 10) {
                    r(false)
                }
                await wait();
            }
    })

    if (!pass) return {};

    await wait(2000);
    const result = await page.evaluate(() => {
        try {
            const available = {}
            document.getElementsByClassName("prev")[0].click()
            document.getElementsByClassName("prev")[0].click()

            for (let id = 0; id < 6; id++) {
                const y = ("" + document.getElementsByClassName("datepicker-switch")[0].innerText).split(" ")[0]
                available[y] = []
                const m = document.getElementsByClassName("activeClass")
                console.log(m)
                for (let i = 0; i < m.length; i++) {
                    //元素的class不能有old
                    if (m[i].getAttribute("class").indexOf("new") != -1) continue;
                    if (m[i].getAttribute("class").indexOf("old") != -1) continue;
                    available[y].push(m[i].innerText)
                }
                //往后跳一页
                if (document.getElementsByClassName("next")[0].getAttribute("style") == "visibility: visible;") {
                    document.getElementsByClassName("next")[0].click()
                }
            }
            return Promise.resolve(available)
        } catch (e) {
            console.log(e)
        }
    })
    return result;
}

async function register(page) {
    let inputElement = null;
    await new Promise(async (r) => {
        let yet = true
        while (yet)
            try {
                inputElement = (await page.$$(".validate"))[0]
                await inputElement.click()
                inputElement = (await page.$$(".next"))[0]
                await inputElement.click()
                inputElement = (await page.$$(".next"))[0]
                await inputElement.click()
                inputElement = (await page.$$(".activeClass"))[0]
                await inputElement.click()
                yet = false
                r()
            } catch {
                await wait();
            }
    })
    await wait()

    await new Promise(async (r) => {
        let yet = true
        while (yet)
            try {
                let selectElement = await page.$("#app_time")
                await selectElement.select("12:30 - 13:00")
                selectElement = await page.$("#VisaTypeId")
                await selectElement.select("93")
                let inputElement = await page.$("#passport_no")
                await inputElement.type("EC8425444", { delay: Math.random * 100 + 100 });
                yet = false
                r()
            } catch {
                await wait();
            }
    })

    inputElement = await page.$("#first_name")
    await inputElement.type("MINGZHU", { delay: Math.random * 100 + 100 });
    inputElement = await page.$("#last_name")
    await inputElement.type("MENG", { delay: Math.random * 100 + 100 });
    await page.evaluate(() => {
        document.getElementById("dateOfBirth").value = "1998-03-26"
        document.getElementById("pptIssueDate").value = "2018-04-03"
        document.getElementById("pptExpiryDate").value = "2028-04-02"
        document.getElementById("pptIssuePalace").value = "China"
    })

    const hcap = await page.$$eval(".h-captcha", (e) => e[0].getAttribute("data-sitekey"))
    const key = "d3582fd1784c7d1407a25d3dd1286499"
    let sendCap = null
    await new Promise(async (r) => {
        let yet = true
        while (yet) {
            try {
                sendCap = await axios.get(`https://2captcha.com/in.php?key=${key}&method=hcaptcha&sitekey=${hcap}&pageurl=https://web.blscn.cn/book_appointment.php&JSON=1`)
                if (sendCap.data.status == 1) {
                    yet = false
                    r()
                }
            }
            catch {
                return
            }
        }
    })

    await wait(5000);

    const id = sendCap.data.request
    let text = "CAPCHA_NOT_READY"
    while (text == "CAPCHA_NOT_READY") {
        let getCap = null
        try {
            getCap = await axios.get(`https://2captcha.com/res.php?key=${key}&action=get&id=${id}&JSON=1`)
            if (getCap) text = getCap.data.request
        } catch {
        }
    }
    //修改属性
    inputElement = (await page.$$(".h-captcha"))[0]
    await page.evaluate(async (text) => {
        document.getElementsByClassName("h-captcha")[0].childNodes[1].style.display = "block"
        document.getElementsByClassName("h-captcha")[0].childNodes[1].value = text
        document.getElementsByClassName("h-captcha")[0].childNodes[2].style.display = "block"
        document.getElementsByClassName("h-captcha")[0].childNodes[2].value = text
        setTimeout(() => {
            document.getElementsByClassName("primary-btn")[0].click();
        }, 1000)
    }, text)

    await wait(3000)

    await page.on('dialog', async dialog => {
        await dialog.accept();
    })
}

async function wait(num = 1000) {
    return new Promise(r => {
        setTimeout(() => r(), num)
    })
}

module.exports = {
    openRegPage,
    getAvailableDate,
    register
}