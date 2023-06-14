//自动重启scanjs

const process = require('child_process');

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

async function restart() {
    console.log("------ new process ------")
    for (let i = 0; i < centreList.length; i++) {
        console.log(`node ./scan.js --code ${centreList[i].code}`)
        process.exec(`node ./scan.js --code ${centreList[i].code}`, { windowsHide: true })
        await wait(15 * 1000);
    }
}

async function wait(num = 1000) {
    return new Promise(r => {
        setTimeout(() => r(), num)
    })
}

restart();
setInterval(() => {
    restart();
}, 1000 * 60 * 5);