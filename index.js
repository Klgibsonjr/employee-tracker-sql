const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

const database = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log('Connected to company database.')
);

database.connect((err) => {
  if (err) throw err;
  mainMenu();
});

const mainMenu = () => {
  return inquirer
    .prompt([
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
    ])
    .then((response) => {
      switch (response.mainMenu) {
        case 'View alll departments':
          viewAllDepartments();
          break;

        case 'Add a department':
          addDepartment();
          break;

        case 'View all employees':
          viewAllEmployees();
          break;

        case 'Add a new employee':
          addEmployee();
          break;

        case 'View all roles':
          viewAllRoles();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'Update employee role':
          updateEmployeeRole();
          break;

        case 'Quit':
          database.end();
          break;
      }
    });
};

const viewAllDepartments = () => {
  console.log('Viewing all departments...\n');

  let query = 'SELECT * FROM department';

  database.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};
