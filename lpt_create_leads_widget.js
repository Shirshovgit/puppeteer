const puppeteer = require('puppeteer');
const URL = 'https://my.lptracker.ru/login.php';
const URL_1 = 'https://jiu4ep.ru/ash/prom.php';

async function testCreateLeads_site(){
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
    await page.goto(URL_1);

    console.log('Ввод номера телефона в форму заявки');
    const search_phone_site = await page.$('.phone');
    await search_phone_site.type('71116548783')


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
    await page.waitForSelector('#dmList');   
   console.log('Переключение на отображение таблицей');
    const searchButton_create_leads = await page.$('#dmList');
    await searchButton_create_leads.click();
        
    
    

    await page.waitForSelector('.b-tbl-col__dropdown');    
    console.log('Проверка создался ли лид');
    const text_save = await page.$eval('.b-tbl-col__dropdown', element => element.textContent);

    if (text_save.startsWith('71116548783')) {
        console.log('Лид создался');
    } else {
          console.log('Лид не создался')
    }

    console.log('Закрытие браузера');
    await browser.close();


}

testCreateLeads_site();