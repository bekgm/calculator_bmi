const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

function getBmiCategory(bmi) {
    let category = '';
    let color = ''; 

    if (bmi < 18.5) {
        // Underweight: Оранжевый для предупреждения
        category = 'Underweight';
        color = 'orange'; 
    } else if (bmi < 24.9) {
        // Normal weight: Зеленый
        category = 'Normal weight';
        color = 'green';
    } else if (bmi < 29.9) {
        // Overweight: Желтый, как в примере требования
        category = 'Overweight';
        color = 'yellow'; // <--- Соответствует требованию 'yellow' для Overweight
    } else { 
        // Obese: Красный
        category = 'Obese';
        color = 'red';
    }

    return { category, color };
}

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <title>Калькулятор ИМТ</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f4f7f6;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                }
                .container {
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 400px;
                }
                h1 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 25px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    color: #555;
                    font-weight: bold;
                }
                input[type="number"] {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 20px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                button {
                    width: 100%;
                    padding: 12px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s ease;
                }
                button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Калькулятор ИМТ</h1>
                <form action="/calculate-bmi" method="POST">
                    <label for="weight">Вес (кг):</label>
                    <input type="number" id="weight" name="weight" step="0.1" placeholder="Например, 70.5" required>
                    
                    <label for="height">Рост (м):</label>
                    <input type="number" id="height" name="height" step="0.01" placeholder="Например, 1.75" required>
                    
                    <button type="submit">Рассчитать ИМТ</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

app.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);

    if (isNaN(weight) || isNaN(height) || height <= 0 || weight <= 0) {
        return res.status(400).send(`
            <div style="font-family: Arial; padding: 20px; text-align: center;">
                <h1>Ошибка Ввода Данных</h1>
                <p style="color: red; font-size: 18px;">Пожалуйста, введите корректные положительные числа для веса и роста.</p>
                <a href="/" style="display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Вернуться к форме</a>
            </div>
        `);
    }

    const bmi = weight / (height * height);
    const roundedBmi = bmi.toFixed(2);

    const { category, color } = getBmiCategory(bmi);

    res.send(`
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <title>Результат ИМТ</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f4f7f6;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                }
                .container {
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                }
                h1 {
                    color: #333;
                    margin-bottom: 25px;
                }
                .result-box {
                    margin-top: 20px;
                    padding: 15px;
                    border-radius: 4px;
                    color: white; /* Цвет текста по умолчанию белый */
                }
                .result-value {
                    font-size: 48px;
                    font-weight: bold;
                    margin: 10px 0;
                }
                .result-category {
                    font-size: 20px;
                    font-weight: 600;
                }
                /* ИСПРАВЛЕННЫЕ КЛАССЫ СТИЛЕЙ */
                .green { background-color: #28a745; } /* Normal */
                .orange { background-color: #f39c12; } /* Underweight - Оранжевый */
                .yellow { background-color: #ffc107; color: #333; } /* Overweight - Желтый, черный текст для контраста */
                .red { background-color: #dc3545; } /* Obese */
                
                .back-link {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 15px;
                    background-color: #6c757d;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    transition: background-color 0.3s ease;
                }
                .back-link:hover {
                    background-color: #5a6268;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Результат Расчета ИМТ</h1>
                <p>Вес: ${weight} кг | Рост: ${height} м</p>
                <div class="result-box ${color}">
                    <div class="result-value">${roundedBmi}</div>
                    <div class="result-category">${category}</div>
                </div>
                <a href="/" class="back-link">Рассчитать снова</a>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Open in your browser: http://localhost:${port}`);
});