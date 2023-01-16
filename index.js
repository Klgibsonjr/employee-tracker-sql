const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
require('console.table');

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
          'View all employees',
          'View all roles',
          'Add a department',
          'Add a new employee',
          'Add a role',
          'Update employee role',
          'Update employee manager',
          'View employees by department',
          'View employee by manager',
          'View total budget by department',
          'Quit',
        ],
      },
    ])
    .then((response) => {
      switch (response.main_menu) {
        case 'View all departments':
          viewAllDepartments();
          break;

        case 'View all employees':
          viewAllEmployees();
          break;

        case 'View all roles':
          viewAllRoles();
          break;

        case 'Add a department':
          addDepartment();
          break;

        case 'Add a new employee':
          addEmployee();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'Update employee role':
          updateEmployeeRole();
          break;

        case 'Update employee manager':
          updateEmployeeManager();
          break;

        case 'View employees by department':
          viewEmployeesByDepartment();
          break;

        case 'View employees by manager':
          viewAllEmployeesByManager();
          break;

        case 'View total budget by department':
          viewDepartmentBudget();
          break;

        case 'Quit':
          database.end();
          break;
      }
    });
};

const viewAllDepartments = () => {
  console.log('Viewing all departments...\n');

  const query = `SELECT department.id AS id, department.department_name AS department FROM department`;

  database.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

const viewAllEmployees = () => {
  console.log('Viewing all employees...\n');

  const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
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

  const query = `SELECT role.id, role.title, role.department_id, role.salary FROM role;`;

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

const addEmployee = () => {};

const addRole = () => {};

const updateEmployeeRole = () => {};

const updateEmployeeManager = () => {};

const viewEmployeesByDepartment = () => {};

const viewAllEmployeesByManager = () => {};

const viewDepartmentBudget = () => {};
