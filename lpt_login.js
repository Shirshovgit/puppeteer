const puppeteer = require('puppeteer');
const fs = require('fs');
const URL = 'https://my.lptracker.ru/login.php';

async function testlogin(){
    console.log('Запуск браузера');
    const browser = await puppeteer.launch({headless: false, slowMo: 100 , args : [
       '--window-size=1920,1080'
    ]});
    
    //const browser = await puppeteer.launch({slowMo: 100});
   //await browser._client.send( 'Emulation.clearDeviceMetricsOverride' );

    console.log('Создание новой вкладки в браузере');
    const page = await browser.newPage();
    await page.setViewport({width:0, height:0});
    await page.setDefaultTimeout(60000);        


    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const current_time = date.getTime()
    const fullDate = `login_${day}${month}${year}time${current_time}`;
    const date_import = date.toString();

    console.log('Запуск скрипта в '+ date_import);
    console.log('Создаем папку под screenshot');
    let fs = require('fs');
    fs.mkdir(fullDate, err => {
    if(err) throw err; // не удалось создать папку
   console.log('Папка успешно создана');
    });

    console.log('Переход на страницу login.php');
    await page.goto(URL);
    //await page.waitForSelector('#login_username');
    console.log('Получение элементов загрузки страницы входа');
    const result_login = await page.$('#login_username');
    console.log('Проверка загрузки страницы входа');
    if (result_login == null) {
        console.log('Страница входа не загрузилась');
        await page.screenshot({path: fullDate +'/screenshot_login_false.png'});

    } else {
          console.log('Страница входа загрузилась')
        await page.screenshot({path: fullDate + '/screenshot_login_true.png'});
    }    

    console.log('Ввод логина');
    const search_login = await page.$('#login_username');
    await search_login.type('testpromnew@lptracker.ru');

    console.log('Ввод пароля');
    const search_pass = await page.$('#login_pass');
    await search_pass.type('123456789');

    console.log('Клик на кнопку "Войти"');
    await page.screenshot({path: fullDate + '/screenshot_login_pass_click.png'});
    const searchButton = await page.$('.m-t-5');
    await searchButton.click();

    console.log('ждем загрузку личного кабинета');
    await page.waitForSelector('.js-kanban-column__leads');
    await page.screenshot({path: fullDate +'/screenshot_lk_after_login.png'});
    
    console.log('Получение элементов загрузки лк');
    let result = await page.$('.js-kanban-column__leads');

   // console.log('Проверка загрузки лк');
    //if (result == null) {
   //     console.log('ЛК не загрузился');
   //     await page.screenshot({path: 'screenshot_lk_false.png'});
   // } else {
   //       console.log('ЛК загрузился')
   //     await page.screenshot({path: 'screenshot_lk_true.png'});
  //  }    

    console.log('Проверка загрузки лк');
    for (let i = 0; i < 5; i++) {
    if (result == null) {
    console.log('ЛК не загрузился'+' проход номер '+ i);
    await page.screenshot({path:fullDate + `/${i}screenshot_lk_false.png`});
    await page.reload(URL);
    await page.waitForSelector('.js-kanban-column__leads');
    await page.screenshot({path: fullDate + `/${i}screenshot_lk_false_reload.png`})
    result = await page.$('.js-kanban-column__leads');

    } else {
        console.log('ЛК загрузился'+' проход номер '+ i)
        await page.screenshot({path: fullDate + `/${i}screenshot_lk_true.png`});
        await page.reload(URL);
        await page.waitForSelector('.js-kanban-column__leads');
        await page.screenshot({path: fullDate + `/${i}screenshot_lk_true_reload.png`})
        result = await page.$('.js-kanban-column__leads');
    }
    };

   
    console.log('Закрытие браузера');
    await browser.close();


}

testlogin();