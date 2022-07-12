const puppeteer = require('puppeteer');
const URL = 'https://my.lptracker.ru/login.php';
const URL_autofunnel = 'https://my.lptracker.ru/#autofunnel';


async function test_autofunnel_open(){
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

    console.log('Переход в раздел автоворонка');
    await page.goto(URL_autofunnel);

    //await page.waitForSelector('.ivu-table-row');
    //console.log('Получение элементов раздела автоворонка');
    //const result_autofunnel = await page.$('.ivu-table-column-WhAIQf');
    await page.waitForSelector("iframe[class='autofunnel-page']");
    const frameHandle = await page.$("iframe[class='autofunnel-page']");
   // console.log(frameHandle);
    const frame = await frameHandle.contentFrame();

    //console.log(frame);
    console.log('Проверка загрузки раздела автоворонка');
    if (frame == null) {
        console.log('Раздел автоворонка не загрузился');
    } else {
          console.log('Раздел автоворонка загрузился')
    }
    //await page.waitForSelector("iframe[class='auto-funnel_row-41577']");
    console.log('Клик в кнопку "Шестеренка"');

    const search_settings_autofunnel = await page.$("iframe[class='ivu-table-body']");
    console.log(search_settings_autofunnel);
    const search_frame_settings_autofunnel = await search_settings_autofunnel.contentFrame();

    console.log(search_frame_settings_autofunnel);
    await search_frame_settings_autofunnel.click();

    console.log('Клик в кнопку "Редактировать схему"');
    const searchsearch_settings_redaktor = await page.$('.ivu-dropdown-item');
    await searchsearch_settings_redaktor.click();

    await page.waitForSelector('.main-node');
    console.log('Получение элементов раздела автоворонка');
    const result_autofunnel_shema = await page.$('.main-node');

    console.log('Проверка загрузки схемы автоворонки');
    if (result_autofunnel_shema == null) {
        console.log('схема автоворонки загрузилась');
    } else {
          console.log('схема автоворонки не загрузилась')
    }

    console.log('Закрытие браузера');
    await browser.close();
}
    test_autofunnel_open();