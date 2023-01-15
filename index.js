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

  const query = 'SELECT * FROM department';

  database.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

const viewAllEmployees = () => {
  console.log('Viewing all employees...\n');

  const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;

  database.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

const viewAllRoles = () => {
  console.log('Viewing all employee roles...\n');

  const query = `SELECT role.title, role.id, role.department_id, role.salary;`;

  database.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

const addDepartment = () => {
  database.query(`SELECT * FROM department;`, (err, res) => {
    if (err) throw err;
    console.log(err);

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'department',
          choices: ['Sales', 'Engineering', 'Finance', 'Customer Service'],
        },
      ])
      .then((response) => {
        let query = `INSERT INTO department (department_name) VALUES (?)`;
        database.query(query, response.name, (err) => {
          if (err) throw err;
          console.log(response.name + ' department has been added.');
        });
      });
  });
};
