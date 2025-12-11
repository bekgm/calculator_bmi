const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

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
                    <label for="weight">Weight (kg):</label>
                    <input type="number" id="weight" name="weight" step="0.1" placeholder="Example, 70.5" required>
                    
                    <label for="height">Height (м):</label>
                    <input type="number" id="height" name="height" step="0.01" placeholder="Example, 1.75" required>
                    
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
                <p style="color: red; font-size: 18px;">Please, enter correct values!.</p>
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
                    color: white;
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
                .green { background-color: #28a745; } 
                .orange { background-color: #f39c12; } 
                .yellow { background-color: #d7ff0fff; color: #333; }
                .red { background-color: #dc3545; }
                
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
                <h1>Result of calculating BMT</h1>
                <p>Weight: ${weight} kg | Height: ${height} cm</p>
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
    console.log(`Server is running on port ${port}`);
    console.log(`Open in your browser: http://localhost:${port}`);
});