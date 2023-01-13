const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: 'localhost',
  port: { PORT },
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  mainMenu();
});

const mainMenu = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'main_menu',
      message: 'What would you like to do? ',
      choices: [
        'View all departments',
        'Add a department',
        'View all employees',
        'Add a new employee',
        'View all roles',
        'Add a role',
        'Update employee role',
        'Quit',
      ],
    },
  ]);
};
