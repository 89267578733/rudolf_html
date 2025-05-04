// Массив для хранения использованных задач
let usedTasks = [];

// Уровни сложности
const difficulties = ['easy', 'medium', 'hard', 'expert'];

// Новая структура задач
const tasks = {
    bug: {
        easy: [
            { question: 'Что выведет console.log(1 + 1);', answer: '2' },
            { question: 'Что выведет console.log(typeof []);', answer: 'object' },
            { question: 'Что выведет console.log(2 * 2);', answer: '4' },
            { question: 'Что выведет console.log(3 - 1);', answer: '2' },
            { question: 'Что выведет console.log(10 / 2);', answer: '5' },
            { question: 'Что выведет console.log("Hello" + "World");', answer: 'HelloWorld' },
            { question: 'Что выведет console.log(5 % 2);', answer: '1' },
            { question: 'Что выведет console.log(2 ** 3);', answer: '8' },
            { question: 'Что выведет console.log(Math.floor(3.7));', answer: '3' },
            { question: 'Что выведет console.log(Math.ceil(3.2));', answer: '4' }
        ],
        medium: [
            { question: 'Что выведет console.log([] == false);', answer: 'true' },
            { question: 'Что выведет console.log(null == undefined);', answer: 'true' },
            { question: 'Что выведет console.log(!![]);', answer: 'true' },
            { question: 'Что выведет console.log(1 + "2" + "2");', answer: '122' },
            { question: 'Что выведет console.log("5" + 3);', answer: '53' },
            { question: 'Что выведет console.log(+"5" + 3);', answer: '8' },
            { question: 'Что выведет console.log(+"abc");', answer: 'NaN' },
            { question: 'Что выведет console.log(!!0);', answer: 'false' },
            { question: 'Что выведет console.log(!!1);', answer: 'true' },
            { question: 'Что выведет console.log(!!"");', answer: 'false' }
        ],
        hard: [
            { question: 'Что выведет console.log(NaN === NaN);', answer: 'false' },
            { question: 'Что выведет let x = 5; console.log(x++ + ++x);', answer: '12' },
            { question: 'Что выведет let obj = { a: 1 }; console.log(obj.toString());', answer: '[object Object]' },
            { question: 'Что выведет console.log(typeof null);', answer: 'object' },
            { question: 'Что выведет console.log(0.1 + 0.2 === 0.3);', answer: 'false' },
            { question: 'Что выведет let a = [1,2,3]; a[10] = 4; console.log(a.length);', answer: '11' },
            { question: 'Что выведет let a = [1,2,3]; delete a[1]; console.log(a.length);', answer: '3' },
            { question: 'Что выведет let a = [1,2,3]; a.length = 1; console.log(a);', answer: '[1]' },
            { question: 'Что выведет let a = [1,2,3]; a.length = 5; console.log(a);', answer: '[1,2,3,,]' },
            { question: 'Что выведет let a = [1,2,3]; a[3.5] = 4; console.log(a.length);', answer: '3' }
        ],
        expert: [
            { question: 'Что выведет let a = [1,2,3]; console.log(typeof a);', answer: 'object' },
            { question: 'Что выведет let a = {}; a["__proto__"] = 123; console.log(a.__proto__);', answer: '[object Object]' },
            { question: 'Что выведет let a = {}; Object.setPrototypeOf(a, null); console.log(a.__proto__);', answer: 'undefined' },
            { question: 'Что выведет let a = Object.create(null); console.log(a.__proto__);', answer: 'undefined' },
            { question: 'Что выведет let a = []; a[100] = 1; console.log(a.length);', answer: '101' },
            { question: 'Что выведет let a = new Array(3); console.log(a);', answer: '[, , ,]' },
            { question: 'Что выведет let a = Array(3).fill(undefined); console.log(a);', answer: '[undefined, undefined, undefined]' },
            { question: 'Что выведет let a = [1,2,3]; a.splice(1, 0, 4); console.log(a);', answer: '[1,4,2,3]' },
            { question: 'Что выведет let a = [1,2,3]; a.splice(1, 1); console.log(a);', answer: '[1,3]' },
            { question: 'Что выведет let a = [1,2,3]; a.splice(1, 1, 4); console.log(a);', answer: '[1,4,3]' }
        ]
    },
    sql: {
        easy: [
            { question: 'Напишите SQL-запрос для выбора всех пользователей из таблицы users.', answer: 'SELECT * FROM users;' },
            { question: 'Как получить количество строк в таблице orders?', answer: 'SELECT COUNT(*) FROM orders;' },
            { question: 'Напишите запрос для удаления всех записей из таблицы logs.', answer: 'DELETE FROM logs;' },
            { question: 'Как выбрать уникальные значения из колонки status?', answer: 'SELECT DISTINCT status FROM table;' },
            { question: 'Как отсортировать пользователей по имени в обратном порядке?', answer: 'SELECT * FROM users ORDER BY name DESC;' },
            { question: 'Как выбрать пользователей с определенным статусом?', answer: 'SELECT * FROM users WHERE status = "active";' },
            { question: 'Как выбрать записи с определенной датой?', answer: 'SELECT * FROM table WHERE date = "2023-01-01";' },
            { question: 'Как выбрать записи за последние 7 дней?', answer: 'SELECT * FROM table WHERE date >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY);' },
            { question: 'Как выбрать записи между двумя датами?', answer: 'SELECT * FROM table WHERE date BETWEEN "2023-01-01" AND "2023-12-31";' },
            { question: 'Как выбрать записи с определенным значением в колонке?', answer: 'SELECT * FROM table WHERE column = "value";' }
        ],
        medium: [
            { question: 'Как выбрать пользователей старше 18 лет?', answer: 'SELECT * FROM users WHERE age > 18;' },
            { question: 'Как обновить статус пользователя на "active"?', answer: 'UPDATE users SET status = "active";' },
            { question: 'Как добавить новую колонку "email" в таблицу users?', answer: 'ALTER TABLE users ADD COLUMN email VARCHAR(255);' },
            { question: 'Как выбрать первые 10 записей из таблицы?', answer: 'SELECT * FROM table LIMIT 10;' },
            { question: 'Как объединить таблицы users и orders?', answer: 'SELECT * FROM users JOIN orders ON users.id = orders.user_id;' },
            { question: 'Как выбрать пользователей с определенным статусом и возрастом?', answer: 'SELECT * FROM users WHERE status = "active" AND age > 18;' },
            { question: 'Как обновить несколько колонок одновременно?', answer: 'UPDATE users SET status = "active", last_login = CURRENT_TIMESTAMP;' },
            { question: 'Как удалить записи старше определенной даты?', answer: 'DELETE FROM logs WHERE date < DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR);' },
            { question: 'Как выбрать записи с группировкой?', answer: 'SELECT status, COUNT(*) FROM users GROUP BY status;' },
            { question: 'Как выбрать записи с сортировкой по нескольким колонкам?', answer: 'SELECT * FROM users ORDER BY status DESC, name ASC;' }
        ],
        hard: [
            { question: 'Как выбрать пользователей, у которых есть заказы?', answer: 'SELECT DISTINCT u.* FROM users u JOIN orders o ON u.id = o.user_id;' },
            { question: 'Как выбрать пользователей без заказов?', answer: 'SELECT u.* FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE o.id IS NULL;' },
            { question: 'Как посчитать сумму заказов для каждого пользователя?', answer: 'SELECT u.id, u.name, SUM(o.amount) FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id, u.name;' },
            { question: 'Как выбрать пользователей с максимальной суммой заказов?', answer: 'SELECT u.id, u.name, SUM(o.amount) FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id, u.name ORDER BY SUM(o.amount) DESC LIMIT 1;' },
            { question: 'Как выбрать пользователей, сделавших заказы в последний месяц?', answer: 'SELECT DISTINCT u.* FROM users u JOIN orders o ON u.id = o.user_id WHERE o.date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH);' },
            { question: 'Как выбрать пользователей с более чем 5 заказами?', answer: 'SELECT u.id, u.name FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id, u.name HAVING COUNT(*) > 5;' },
            { question: 'Как выбрать среднюю сумму заказов по статусу?', answer: 'SELECT u.status, AVG(o.amount) FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.status;' },
            { question: 'Как выбрать пользователей с заказами в определенном диапазоне сумм?', answer: 'SELECT DISTINCT u.* FROM users u JOIN orders o ON u.id = o.user_id WHERE o.amount BETWEEN 100 AND 1000;' },
            { question: 'Как выбрать последний заказ каждого пользователя?', answer: 'SELECT u.id, u.name, o.date FROM users u JOIN orders o ON u.id = o.user_id WHERE o.date = (SELECT MAX(date) FROM orders WHERE user_id = u.id);' },
            { question: 'Как выбрать пользователей с возрастающей суммой заказов?', answer: 'SELECT u.id, u.name FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.id, u.name HAVING SUM(o.amount) > LAG(SUM(o.amount)) OVER (ORDER BY u.id);' }
        ],
        expert: [
            { question: 'Как создать представление для пользователей с активными заказами?', answer: 'CREATE VIEW active_users AS SELECT DISTINCT u.* FROM users u JOIN orders o ON u.id = o.user_id WHERE o.status = "active";' },
            { question: 'Как создать индекс для ускорения поиска по email?', answer: 'CREATE INDEX idx_email ON users(email);' },
            { question: 'Как создать триггер для автоматического обновления времени модификации?', answer: 'CREATE TRIGGER update_modified BEFORE UPDATE ON users FOR EACH ROW SET NEW.modified_at = CURRENT_TIMESTAMP;' },
            { question: 'Как создать хранимую процедуру для добавления заказа?', answer: 'CREATE PROCEDURE add_order(IN user_id INT, IN amount DECIMAL(10,2)) BEGIN INSERT INTO orders(user_id, amount) VALUES(user_id, amount); END;' },
            { question: 'Как создать транзакцию для атомарного обновления баланса?', answer: 'START TRANSACTION; UPDATE users SET balance = balance - 100 WHERE id = 1; UPDATE users SET balance = balance + 100 WHERE id = 2; COMMIT;' },
            { question: 'Как создать материализованное представление?', answer: 'CREATE MATERIALIZED VIEW mv_users AS SELECT * FROM users WITH DATA;' },
            { question: 'Как создать рекурсивный запрос для иерархических данных?', answer: 'WITH RECURSIVE hierarchy AS (SELECT id, parent_id, 1 AS level FROM table WHERE parent_id IS NULL UNION ALL SELECT t.id, t.parent_id, h.level + 1 FROM table t JOIN hierarchy h ON t.parent_id = h.id) SELECT * FROM hierarchy;' },
            { question: 'Как создать оконную функцию для подсчета нарастающего итога?', answer: 'SELECT id, amount, SUM(amount) OVER (ORDER BY date) AS running_total FROM orders;' },
            { question: 'Как создать запрос с PIVOT?', answer: 'SELECT * FROM (SELECT status, COUNT(*) as count FROM users GROUP BY status) AS src PIVOT (SUM(count) FOR status IN ([active], [inactive], [pending])) AS pvt;' },
            { question: 'Как создать запрос с UNPIVOT?', answer: 'SELECT id, status_type, status_value FROM users UNPIVOT (status_value FOR status_type IN (status, last_status, previous_status)) AS unpvt;' }
        ]
    },
    prioritization: {
        easy: [
            { question: 'Что важнее: исправить баг или добавить новую фичу?', answer: 'исправить баг' },
            { question: 'Что важнее: написать тесты или оптимизировать код?', answer: 'написать тесты' },
            { question: 'Что важнее: исправить ошибку в продакшене или добавить новую функцию?', answer: 'исправить ошибку в продакшене' },
            { question: 'Что важнее: обновить документацию или добавить новую фичу?', answer: 'обновить документацию' },
            { question: 'Что важнее: исправить баг в UI или добавить анимацию?', answer: 'исправить баг в UI' },
            { question: 'Что важнее: исправить баг в безопасности или добавить новую фичу?', answer: 'исправить баг в безопасности' },
            { question: 'Что важнее: исправить баг в производительности или добавить новую фичу?', answer: 'исправить баг в производительности' },
            { question: 'Что важнее: исправить баг в доступности или добавить новую фичу?', answer: 'исправить баг в доступности' },
            { question: 'Что важнее: исправить баг в совместимости или добавить новую фичу?', answer: 'исправить баг в совместимости' },
            { question: 'Что важнее: исправить баг в масштабируемости или добавить новую фичу?', answer: 'исправить баг в масштабируемости' }
        ],
        medium: [
            { question: 'Что важнее: рефакторинг legacy кода или написание документации?', answer: 'написание документации' },
            { question: 'Что важнее: оптимизировать скорость или улучшить UX?', answer: 'улучшить UX' },
            { question: 'Что важнее: добавить новые тесты или исправить старые?', answer: 'исправить старые' },
            { question: 'Что важнее: обновить библиотеки или добавить новую функциональность?', answer: 'обновить библиотеки' },
            { question: 'Что важнее: исправить баг в тестах или добавить новые тесты?', answer: 'исправить баг в тестах' },
            { question: 'Что важнее: оптимизировать запросы или добавить кэширование?', answer: 'оптимизировать запросы' },
            { question: 'Что важнее: исправить баг в UI или добавить новую анимацию?', answer: 'исправить баг в UI' },
            { question: 'Что важнее: обновить API или добавить новую фичу?', answer: 'обновить API' },
            { question: 'Что важнее: исправить баг в безопасности или добавить новую функцию?', answer: 'исправить баг в безопасности' },
            { question: 'Что важнее: оптимизировать память или улучшить производительность?', answer: 'оптимизировать память' }
        ],
        hard: [
            { question: 'Что важнее: переписать архитектуру или добавить новую фичу?', answer: 'переписать архитектуру' },
            { question: 'Что важнее: исправить баг в ядре или добавить новый модуль?', answer: 'исправить баг в ядре' },
            { question: 'Что важнее: обновить фреймворк или добавить новую функциональность?', answer: 'обновить фреймворк' },
            { question: 'Что важнее: исправить баг в базе данных или добавить новую таблицу?', answer: 'исправить баг в базе данных' },
            { question: 'Что важнее: оптимизировать алгоритм или добавить новую фичу?', answer: 'оптимизировать алгоритм' },
            { question: 'Что важнее: исправить баг в микросервисе или добавить новый сервис?', answer: 'исправить баг в микросервисе' },
            { question: 'Что важнее: обновить инфраструктуру или добавить новую функциональность?', answer: 'обновить инфраструктуру' },
            { question: 'Что важнее: исправить баг в CI/CD или добавить новый пайплайн?', answer: 'исправить баг в CI/CD' },
            { question: 'Что важнее: оптимизировать мониторинг или добавить новые метрики?', answer: 'оптимизировать мониторинг' },
            { question: 'Что важнее: исправить баг в логировании или добавить новые логи?', answer: 'исправить баг в логировании' }
        ],
        expert: [
            { question: 'Что важнее: переписать архитектуру или добавить новую фичу?', answer: 'переписать архитектуру' },
            { question: 'Что важнее: исправить баг в ядре или добавить новый модуль?', answer: 'исправить баг в ядре' },
            { question: 'Что важнее: обновить фреймворк или добавить новую функциональность?', answer: 'обновить фреймворк' },
            { question: 'Что важнее: исправить баг в базе данных или добавить новую таблицу?', answer: 'исправить баг в базе данных' },
            { question: 'Что важнее: оптимизировать алгоритм или добавить новую фичу?', answer: 'оптимизировать алгоритм' },
            { question: 'Что важнее: исправить баг в распределенной системе или добавить новый узел?', answer: 'исправить баг в распределенной системе' },
            { question: 'Что важнее: обновить систему кэширования или добавить новый кэш?', answer: 'обновить систему кэширования' },
            { question: 'Что важнее: исправить баг в балансировщике или добавить новый сервер?', answer: 'исправить баг в балансировщике' },
            { question: 'Что важнее: оптимизировать систему очередей или добавить новую очередь?', answer: 'оптимизировать систему очередей' },
            { question: 'Что важнее: исправить баг в системе репликации или добавить новую реплику?', answer: 'исправить баг в системе репликации' }
        ]
    },
    algorithm: {
        easy: [
            { question: 'Сколько будет 2 в степени 3?', answer: '8' },
            { question: 'Сколько будет факториал 3?', answer: '6' },
            { question: 'Какова сложность линейного поиска?', answer: 'O(n)' },
            { question: 'Какова сложность пузырьковой сортировки?', answer: 'O(n²)' },
            { question: 'Сколько будет 2 в степени 4?', answer: '16' },
            { question: 'Сколько будет факториал 2?', answer: '2' },
            { question: 'Какова сложность поиска в хеш-таблице?', answer: 'O(1)' },
            { question: 'Какова сложность вставки в массив?', answer: 'O(n)' },
            { question: 'Сколько будет 2 в степени 2?', answer: '4' },
            { question: 'Сколько будет факториал 1?', answer: '1' }
        ],
        medium: [
            { question: 'Сколько будет факториал 4?', answer: '24' },
            { question: 'Какова сложность бинарного поиска?', answer: 'O(log n)' },
            { question: 'Какова сложность быстрой сортировки?', answer: 'O(n log n)' },
            { question: 'Сколько будет 2 в степени 5?', answer: '32' },
            { question: 'Сколько будет факториал 5?', answer: '120' },
            { question: 'Какова сложность сортировки вставками?', answer: 'O(n²)' },
            { question: 'Какова сложность сортировки выбором?', answer: 'O(n²)' },
            { question: 'Сколько будет 2 в степени 6?', answer: '64' },
            { question: 'Сколько будет факториал 6?', answer: '720' },
            { question: 'Какова сложность сортировки Шелла?', answer: 'O(n log² n)' }
        ],
        hard: [
            { question: 'Какова сложность сортировки слиянием?', answer: 'O(n log n)' },
            { question: 'Какова сложность сортировки кучей?', answer: 'O(n log n)' },
            { question: 'Сколько будет 2 в степени 10?', answer: '1024' },
            { question: 'Сколько будет факториал 7?', answer: '5040' },
            { question: 'Какова сложность алгоритма Дейкстры?', answer: 'O((V + E) log V)' },
            { question: 'Какова сложность алгоритма Беллмана-Форда?', answer: 'O(VE)' },
            { question: 'Сколько будет 2 в степени 12?', answer: '4096' },
            { question: 'Сколько будет факториал 8?', answer: '40320' },
            { question: 'Какова сложность алгоритма Флойда-Уоршелла?', answer: 'O(V³)' },
            { question: 'Какова сложность алгоритма Крускала?', answer: 'O(E log E)' }
        ],
        expert: [
            { question: 'Какова сложность алгоритма Прима?', answer: 'O(E log V)' },
            { question: 'Какова сложность алгоритма Тарьяна для поиска компонент сильной связности?', answer: 'O(V + E)' },
            { question: 'Сколько будет 2 в степени 20?', answer: '1048576' },
            { question: 'Сколько будет факториал 10?', answer: '3628800' },
            { question: 'Какова сложность алгоритма Косарайю?', answer: 'O(V + E)' },
            { question: 'Какова сложность алгоритма Хопкрофта-Карпа?', answer: 'O(E√V)' },
            { question: 'Сколько будет 2 в степени 24?', answer: '16777216' },
            { question: 'Сколько будет факториал 12?', answer: '479001600' },
            { question: 'Какова сложность алгоритма Эдмондса-Карпа?', answer: 'O(VE²)' },
            { question: 'Какова сложность алгоритма Диница?', answer: 'O(V²E)' }
        ]
    },
    "go-syntax": {
        easy: [
            { question: 'Как объявить переменную типа int?', answer: 'var x int', options: ['var x int', 'int x', 'let x int', 'x := int'] },
            { question: 'Как объявить функцию, возвращающую int?', answer: 'func foo() int { ... }', options: ['func foo() int { ... }', 'function foo() int { ... }', 'def foo() int { ... }', 'func foo() -> int { ... }'] }
        ],
        medium: [
            { question: 'Как создать срез строк длиной 3?', answer: 'make([]string, 3)', options: ['make([]string, 3)', 'new([]string, 3)', '[]string{3}', 'make(string[3])'] },
            { question: 'Как объявить структуру с полем Name типа string?', answer: 'type Person struct { Name string }', options: ['type Person struct { Name string }', 'struct Person { Name string }', 'type Person { Name: string }', 'Person := struct { Name string }'] }
        ],
        hard: [
            { question: 'Как реализовать метод String() для структуры?', answer: 'func (p Person) String() string { ... }', options: ['func (p Person) String() string { ... }', 'func String(p Person) string { ... }', 'def String(self): ...', 'func String(p Person): string { ... }'] },
            { question: 'Как объявить map с ключами string и значениями int?', answer: 'map[string]int', options: ['map[string]int', 'map(int, string)', 'map[string->int]', 'dict[string]int'] }
        ],
        expert: [
            { question: 'Как объявить анонимную функцию, принимающую int и возвращающую int?', answer: 'func(x int) int { ... }', options: ['func(x int) int { ... }', 'lambda x: int { ... }', 'func int(x) { ... }', 'function(x int): int { ... }'] },
            { question: 'Как вложить одну структуру в другую?', answer: 'type B struct { A }', options: ['type B struct { A }', 'type B struct { A: struct }', 'struct B { struct A }', 'type B { struct A }'] }
        ]
    },
    "go-stdlib": {
        easy: [
            { question: 'Как вывести строку в консоль?', answer: 'fmt.Println("Hello")', options: ['fmt.Println("Hello")', 'console.log("Hello")', 'print("Hello")', 'System.out.println("Hello")'] },
            { question: 'Как считать строку из стандартного ввода?', answer: 'fmt.Scanln(&s)', options: ['fmt.Scanln(&s)', 'input(s)', 'scanf(s)', 'readline(s)'] }
        ],
        medium: [
            { question: 'Как преобразовать строку "42" в int?', answer: 'strconv.Atoi("42")', options: ['strconv.Atoi("42")', 'parseInt("42")', 'int("42")', 'strconv.ParseInt("42")'] },
            { question: 'Как прочитать все байты из файла file.txt?', answer: 'ioutil.ReadFile("file.txt")', options: ['ioutil.ReadFile("file.txt")', 'os.ReadFile("file.txt")', 'readFile("file.txt")', 'file.readAll()'] }
        ],
        hard: [
            { question: 'Как получить текущую дату и время?', answer: 'time.Now()', options: ['time.Now()', 'datetime.now()', 'getTime()', 'Date.now()'] },
            { question: 'Как записать строку в файл?', answer: 'ioutil.WriteFile("file.txt", []byte(s), 0644)', options: ['ioutil.WriteFile("file.txt", []byte(s), 0644)', 'os.WriteFile("file.txt", s, 0644)', 'writeFile("file.txt", s)', 'file.write(s)'] }
        ],
        expert: [
            { question: 'Как распарсить строку времени "2023-01-01" в time.Time?', answer: 'time.Parse("2006-01-02", "2023-01-01")', options: ['time.Parse("2006-01-02", "2023-01-01")', 'parseTime("2023-01-01")', 'time.Parse("2023-01-01")', 'datetime.strptime("2023-01-01")'] },
            { question: 'Как сериализовать структуру в JSON?', answer: 'json.Marshal(v)', options: ['json.Marshal(v)', 'json.Encode(v)', 'marshalJSON(v)', 'JSON.stringify(v)'] }
        ]
    },
    "go-concurrency": {
        easy: [
            { question: 'Как запустить функцию в отдельной горутине?', answer: 'go myFunc()', options: ['go myFunc()', 'start myFunc()', 'thread myFunc()', 'goroutine myFunc()'] },
            { question: 'Как создать канал для передачи int?', answer: 'make(chan int)', options: ['make(chan int)', 'chan int()', 'new chan int', 'make(int chan)'] }
        ],
        medium: [
            { question: 'Как получить значение из канала ch?', answer: '<-ch', options: ['<-ch', 'ch<-', 'get(ch)', 'receive(ch)'] },
            { question: 'Как закрыть канал ch?', answer: 'close(ch)', options: ['close(ch)', 'ch.close()', 'end(ch)', 'shutdown(ch)'] }
        ],
        hard: [
            { question: 'Как использовать select для чтения из двух каналов?', answer: 'select { case x := <-ch1: ... case y := <-ch2: ... }', options: ['select { case x := <-ch1: ... case y := <-ch2: ... }', 'switch { <-ch1; <-ch2 }', 'select (ch1, ch2)', 'choose { ch1, ch2 }'] },
            { question: 'Как создать буферизированный канал на 5 элементов?', answer: 'make(chan int, 5)', options: ['make(chan int, 5)', 'make(chan 5, int)', 'chan int[5]', 'bufferedChan(5)'] }
        ],
        expert: [
            { question: 'Как использовать sync.Mutex для защиты разделяемых данных?', answer: 'var mu sync.Mutex; mu.Lock(); ...; mu.Unlock()', options: ['var mu sync.Mutex; mu.Lock(); ...; mu.Unlock()', 'lock(mu); ...; unlock(mu)', 'sync.Lock(mu); ...; sync.Unlock(mu)', 'mutex.Lock(); ...; mutex.Unlock()'] },
            { question: 'Как дождаться завершения всех горутин с помощью sync.WaitGroup?', answer: 'var wg sync.WaitGroup; wg.Add(1); go func(){ ... wg.Done() }(); wg.Wait()', options: ['var wg sync.WaitGroup; wg.Add(1); go func(){ ... wg.Done() }(); wg.Wait()', 'waitgroup.Add(1); go ...; waitgroup.Wait()', 'sync.Wait(wg)', 'goroutines.WaitAll()'] }
        ]
    },
    "go-idioms": {
        easy: [
            { question: 'Для чего используется defer?', answer: 'Для отложенного выполнения функции при выходе из текущей.', options: ['Для отложенного выполнения функции при выходе из текущей.', 'Для объявления переменной', 'Для запуска горутины', 'Для создания интерфейса'] },
            { question: 'Как проверить ошибку err после вызова функции?', answer: 'if err != nil { ... }', options: ['if err != nil { ... }', 'if error(err) { ... }', 'if err == null { ... }', 'if err { ... }'] }
        ],
        medium: [
            { question: 'Как вернуть несколько значений из функции?', answer: 'func foo() (int, error) { ... }', options: ['func foo() (int, error) { ... }', 'func foo() int, error { ... }', 'func foo() -> (int, error) { ... }', 'function foo() returns (int, error)'] },
            { question: 'Как реализовать интерфейс Stringer?', answer: 'type Stringer interface { String() string }', options: ['type Stringer interface { String() string }', 'interface Stringer { String() string }', 'type Stringer { String() string }', 'Stringer := interface { String() string }'] }
        ],
        hard: [
            { question: 'Как сделать тип, реализующий интерфейс io.Reader?', answer: 'func (t *T) Read(p []byte) (int, error) { ... }', options: ['func (t *T) Read(p []byte) (int, error) { ... }', 'func Read(t *T, p []byte) (int, error) { ... }', 'def Read(self, p): ...', 'func (t *T) Read(p []byte): (int, error)'] },
            { question: 'Как объявить константу с помощью iota?', answer: 'const (A = iota)', options: ['const (A = iota)', 'const A = iota', 'let A = iota', 'const A := iota'] }
        ],
        expert: [
            { question: 'Как реализовать собственную ошибку с помощью type и Error()?', answer: 'type MyErr struct{}; func (e MyErr) Error() string { ... }', options: ['type MyErr struct{}; func (e MyErr) Error() string { ... }', 'type MyErr struct{}; func Error(e MyErr) string { ... }', 'func (e MyErr) error() string { ... }', 'type MyErr error { ... }'] },
            { question: 'Как использовать пустой интерфейс interface{}?', answer: 'var x interface{}', options: ['var x interface{}', 'interface x', 'x := interface', 'var x = interface{}()'] }
        ]
    }
};

export function generateTask(type, difficulty, playerName) {
    // Если не передан тип — выбираем случайный
    if (!type) {
        const types = Object.keys(tasks);
        type = types[Math.floor(Math.random() * types.length)];
    }
    // Если не передан уровень — выбираем easy
    if (!difficulty) difficulty = 'easy';

    // Получаем список использованных задач для игрока
    let usedTasksByPlayer = [];
    if (playerName) {
        usedTasksByPlayer = JSON.parse(localStorage.getItem('usedTasks_' + playerName) || '[]');
    } else {
        usedTasksByPlayer = usedTasks;
    }

    const taskList = tasks[type][difficulty];
    // Фильтруем неиспользованные задачи для этого игрока
    const availableTasks = taskList.filter(task => !usedTasksByPlayer.includes(task.question));
    if (availableTasks.length === 0) {
        usedTasksByPlayer = [];
        if (playerName) {
            localStorage.setItem('usedTasks_' + playerName, JSON.stringify([]));
        } else {
            usedTasks = [];
        }
        return generateTask(type, difficulty, playerName);
    }
    const task = availableTasks[Math.floor(Math.random() * availableTasks.length)];
    usedTasksByPlayer.push(task.question);
    if (playerName) {
        localStorage.setItem('usedTasks_' + playerName, JSON.stringify(usedTasksByPlayer));
    } else {
        usedTasks = usedTasksByPlayer;
    }
    return { type, difficulty, ...task };
}

export { tasks, difficulties }; 