## Неофициальная библиотека для работы с платежной системой CrystalPAY ([crystalpay.ru](https://crystalpay.ru/docs/API-docs.html "crystalpay.ru"))

**[Официальная документация по API](https://crystalpay.ru/docs/API-docs.html "Официальная документация по API")**

### Начало
    const { CrystalPAY } = require(".");
    
    const LOGIN = "mrenigman", // Логин кассы
      SECRET1 = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Секретный ключ 1
      SECRET2 = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Секретный ключ 2
      WEBHOOK = false, // Включен ли вебхук (false = выключен, true = включен)
      WEBHOOK_PARAMS = {
        // Параметры вебхука
        host: "127.0.0.1", // Хост вебхука
        port: 5000, // Порт вебхука
        path: "/", // Путь вебхука
      };
    
    const crystalPAY = new CrystalPAY(
      LOGIN,
      SECRET1,
      SECRET2,
      WEBHOOK,
      WEBHOOK_PARAMS
    );
    
    // Генерация ссылки для оплаты (Receipt)
    
    crystalPAY.createReceipt(
      100, //сумма
      "qw", // Если необходимо принудительно указать платёжную систему, qw - код платёжной системы
      "https://google.ru", // Ссылка для перенаправления после оплаты (необязательно),
      "https://google.ru/index.php" // Ссылка на скрипт, на который будет отправлен запрос, после успешного зачисления средств на счёт кассы (необязательно)
    );
    
    // Получение статуса оплаты (Receipt)
    
    crystalPAY.checkReceipt(
      "1_xxxxxxx" // ID чека ( Операции )
    );
    
    // Получение баланса кассы
    
    crystalPAY.balance();
    
    // Вывод средств с кассы
    
    crystalPAY.withdraw(
      100, // Сумма в рублях
      "79001234567", // Номер кошелька
      "QIWI" // Сервис (тип валюты) для вывода, используются названия из полученного баланса
    );
    
    // Перевод средств на другую кассу (P2P)
    
    crystalPAY.p2pTransfer(
      "crystalpay", // Логин кассы получателя
      100, // Сумма в рублях,
      "QIWI" // Сервис (тип валюты) для вывода, используются названия из полученного баланса
    );
    
    // Создание ваучера (Voucher)
    
    crystalPAY.createVoucher(
      100, // Сумма в рублях
      "QIWI", // Сервис (тип валюты) для вывода, используются названия из полученного баланса
      "Комментарий" // Комментарий к ваучеру (необязательно)
    );
    
    // Получение информации о ваучере (Voucher)
    
    crystalPAY.voucherInfo(
      "code" // Код ваучера
    );
    
    // Активация ваучера (Voucher)
    
    crystalPAY.activateVoucher(
      "code" // Код ваучера
    );
    
