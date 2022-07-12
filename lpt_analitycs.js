const puppeteer = require('puppeteer');
const URL = 'https://my.lptracker.ru/login.php';
const URL_analitycs = 'https://my.lptracker.ru/#statistic';

async function testAnalitycs(){
    console.log('Запуск браузера');
    const browser = await puppeteer.launch({headless: false, slowMo: 100 , args : [
        '--window-size=1920,1080'
    ]});
    //await browser._client.send( 'Emulation.clearDeviceMetricsOverride' );
    //const browser = await puppeteer.launch({slowMo: 10});

    console.log('Создание новой вкладки в браузере');
    const page = await browser.newPage();
    await page.setViewport({width:0, height:0});

    console.log('Переход на страницу https://my.lptracker.ru/login.php');
    await page.goto(URL);

    console.log('Ввод логина');
    const search_login = await page.$('#login_username');
    await search_login.type('testpromnew@lptracker.ru');

    console.log('Ввод пароля');
    const search_pass = await page.$('#login_pass');
    await search_pass.type('123456789');

    console.log('Клик в кнопку "Войти"');
    const searchButton = await page.$('.btn-primary[type=submit]');
    await searchButton.click();

    console.log('ждем загрузку личного кабинета');
    
    await page.waitForSelector('.b-table_search');
    console.log('Получение элементов загрузки лк');
    const result = await page.$('.b-table_search');

    console.log('Проверка загрузки лк');
    if (result == null) {
        console.log('ЛК не загрузился');
    } else {
          console.log('ЛК загрузился')
    }

    console.log('Переход на страницу аналитики');
    await page.goto(URL_analitycs);

    await page.waitForSelector('.js-graph-container');
    console.log('Получение элементов раздела Аналитики');
    const result_analitycs = await page.$('.js-graph-container');

    console.log('Проверка загрузки раздела аналитики');
    if (result_analitycs == null) {
        console.log('Аналитика не загрузилась');
        await page.screenshot({path: 'screenshot_analitycs_false.png'});
    } else {
          console.log('Аналитика загрузилась');
          await page.screenshot({path: 'screenshot_analitycs_true.png'});
    }

    console.log('Закрытие браузера');
    await browser.close();
}
    testAnalitycs();