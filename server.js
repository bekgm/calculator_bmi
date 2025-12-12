const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

function getBmiCategory(bmi) {
    let category = '';
    let color = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        color = 'orange';
    } else if (bmi < 24.9) {
        category = 'Normal weight';
        color = 'green';
    } else if (bmi < 29.9) {
        category = 'Overweight';
        color = 'yellow';
    } else {
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
            <title>Calculator BMI</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <div class="container">
                <h1>Калькулятор ИМТ</h1>
                <form action="/calculate-bmi" method="POST">
                    <label for="weight">Weight (kg):</label>
                    <input type="number" id="weight" name="weight" step="0.1" required>

                    <label for="height">Height (m):</label>
                    <input type="number" id="height" name="height" step="0.01" required>

                    <button type="submit">Calculate</button>
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
                <h1>Wrong data</h1>
                <p style="color: red; font-size: 18px;">Please, enter correct values!</p>
                <a href="/" style="display: inline-block; margin-top: 20px; padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Back to form</a>
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
            <title>Result</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <div class="container">
                <h1>Result of calculating BMI</h1>

                <p>Weight: ${weight} kg | Height: ${height} m</p>

                <div class="result-box ${color}">
                    <div class="result-value">${roundedBmi}</div>
                    <div class="result-category">${category}</div>
                </div>

                <a href="/" class="back-link">Calculate again</a>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server running: http://localhost:${port}`);
});
