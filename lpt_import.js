const puppeteer = require('puppeteer');
const URL = 'https://my.lptracker.ru/login.php';
const URL_import = 'https://my.lptracker.ru/#leads/import';


async function test_import(){
    console.log('Запуск браузера');
   // const browser = await puppeteer.launch({headless: false, slowMo: 100 , args : [
   //     '--window-size=1920,1080'
   // ]});
   //const browser = await puppeteer.launch({headless: false, slowMo: 100 });

   // await browser._client.send( 'Emulation.clearDeviceMetricsOverride' );
    const browser = await puppeteer.launch({slowMo: 100});

    console.log('Создание новой вкладки в браузере');
    const page = await browser.newPage();
    await page.setViewport({width:0, height:0});

    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const current_time = date.getTime()
    const fullDate = `${day}${month}${year}time${current_time}`
    //console.log(fullDate);

    //const convertTime = new Date(current_time)
    //console.log(current_time);

    const date_import = date.toString();
    console.log('Запуск скрипта в '+ date_import);
    console.log('Создаем папку под screenshot');
    let fs = require('fs');
    fs.mkdir(fullDate, err => {
    if(err) throw err; // не удалось создать папку
   console.log('Папка успешно создана');
    });

    console.log('Переход на страницу https://my.lptracker.ru/login.php');
    await page.goto(URL);

    console.log('Ввод логина');
    await page.screenshot({path: fullDate +'/screenshot_login_username.png'});
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

    console.log('Переход в импорт');
    await page.goto(URL_import);
    await page.waitForSelector('.dropzone');
    await page.screenshot({path: fullDate +'/screenshot_import.png'});
    
    console.log('Пытаемся загрузить файл');
    const [fileChooser] = await Promise.all([
  page.waitForFileChooser(),
  page.click('.dropzone'), // some button that triggers file selection
]);
await fileChooser.accept(['c:/cygwin64/new.xlsx']);
    
console.log('Ждеем кнопки запуска импорта');
await page.screenshot({path: fullDate +'/screenshot_import_1.png'});
await page.waitForSelector('#button_process_import');
console.log('Клик на кнпоку запуска импорта');
const Button_import = await page.$('#button_process_import');
await Button_import.click();

    await page.waitForSelector('.messenger-message-inner');    
    console.log('Проверка текста в всплывашке');
    await page.waitForTimeout(5000);
    const text_save = await page.$eval('.messenger-message-inner', element => element.textContent);

    if (text_save.startsWith('Импорт завершен')) {
        await page.screenshot({path:fullDate + '/screenshot_import_2.png'});
        console.log('Текст в всплывашке - Импорт завершен' );
    } else {
          console.log('Проблема с импортом')
    }

   // const drop = await page.$('#leads_import_dropzone');
    //await drop.click();


    //await drop.accept(['/new.xlsx']);

    //await drop.uploadFile('/new.xlsx');
    //await drop.accept ('[/new.xlsx]');
   // const elementHandle = await page.$('.dropzone');
   // console.log (elementHandle)
    //await elementHandle.uploadFile('path/to/new.xlsx');
    //await page.click('.import_db_to'); 


    console.log('Закрытие браузера');
    await browser.close();
}
    test_import();




