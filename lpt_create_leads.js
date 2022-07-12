const puppeteer = require('puppeteer');
const URL = 'https://my.lptracker.ru/login.php';

async function testCreateLeads_lk(){
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
    await page.waitForSelector('.btn-primary.js-add');   
   console.log('Клик на кнопку "новая сделка"');
    const searchButton_create_leads = await page.$('.btn-primary.js-add');
    await searchButton_create_leads.click();
        
    console.log('Ввод  номер телефона');
    await page.waitForSelector('#person-phone-0-0');
    const search_phone = await page.$('#person-phone-0-0');
    await search_phone.type('71119548689');
    
    console.log('Клик на кнопку "сохранить"');
    const searchButton_save_leads = await page.$('.js-btn-save');
    await searchButton_save_leads.click();

    await page.waitForSelector('.js-btn-ok');   
    console.log('Клик на кнопку "сохранить в поп апе"');
    const searchButton_create_leads_duble = await page.$('.js-btn-ok');
    await searchButton_create_leads_duble.click();
    

    await page.waitForSelector('.messenger-message-inner');    
    console.log('Проверка текста в всплывашке');
    const text_save = await page.$eval('.messenger-message-inner', element => element.textContent);

    if (text_save.startsWith('Сохранено')) {
        console.log('Лид сохранился');
    } else {
          console.log('Лид не сохранился')
    }

    console.log('Закрытие браузера');
    await browser.close();


}

testCreateLeads_lk();