const methods = require('./method')
const sql = require('./mysql')
const fs = require('fs')
var arguments = process.argv;

// 可以使用循环迭代所有的命令行参数（包括node路径和文件路径）
const params = {
    code: "BJ"
}
for (let i = 0; i < arguments.length; i += 2) {
    switch (arguments[i]) {
        case "--code": params.code = arguments[i + 1]; break;
    }
}

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

//run一次就是0.01715rmb
async function run(code) {
    setTimeout(() => {
        process.exit(0)
    }, 180 * 1000)
    const center = centreList.find(n => n.code == code);
    try {
        const m = (await methods.openRegPage(center.code))()
        const data = await methods.getAvailableDate(m.page)
        if (Object.keys(data).length != 0) {
            sql.getSql()().query(`delete from available where city='${center.city}'`)
        }
        await wait()
        let sqltext = 'insert into available (city,ava_date,scan_time) values ';
        Object.keys(data).forEach(month => {
            data[month].forEach(day => {
                let monthNum = '01';
                switch (month) {
                    case "Janruary": monthNum = '01'; break;
                    case "February": monthNum = '02'; break;
                    case "March": monthNum = '03'; break;
                    case "April": monthNum = '04'; break;
                    case "May": monthNum = '05'; break;
                    case "June": monthNum = '06'; break;
                    case "July": monthNum = '07'; break;
                    case "August": monthNum = '08'; break;
                    case "September": monthNum = '09'; break;
                    case "October": monthNum = '10'; break;
                    case "November": monthNum = '11'; break;
                    case "December": monthNum = '12'; break;
                }
                const now = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0];
                let date = `${new Date().getFullYear()}-${monthNum}-${day < 10 ? '0' + day : day}`
                console.log(date)
                sqltext += `('${center.city}','${date}','${now}'),`
            })
        })
        sqltext = sqltext.substring(0, sqltext.length - 1)
        if (sqltext.includes(center.city)) {
            sql.getSql()().query(sqltext)
        }
        await wait(3000)
    } catch {
        await m.page.browser().close();
        m = null
        await wait()
        process.exit(0)
    }
}

async function wait(num = 1000) {
    return new Promise(r => {
        setTimeout(() => r(), num)
    })
}

run(centreList.find(n => n.code == params.code).code)