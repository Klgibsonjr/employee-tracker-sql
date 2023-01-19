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
          'View employees by manager',
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

  const query = `SELECT department.id AS id, department.department_name AS department FROM department;`;

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

  const query = `SELECT role.id, role.title, role.department_id AS department, role.salary FROM role;`;

  database.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department',
        message: 'What department would you like to add?',
      },
    ])
    .then((response) => {
      console.log(response);
      let query = `INSERT INTO department SET ?`;

      database.query(query, { department_name: response.department }, (err) => {
        console.log(response.department);
        if (err) throw err;
        console.log(response.department + ' department has been added.');

        mainMenu();
      });
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Please enter employees first name:',
        validate: (inputFirstName) => {
          if (inputFirstName) {
            return true;
          } else {
            console.log('Please enter a first name.');
          }
        },
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Please enter a last name:',
        validate: (inputLastName) => {
          if (inputLastName) {
            return true;
          } else {
            console.log('Please enter a last name.');
          }
        },
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'Please enter a role id for new employee:',
        validate: (inputRoleId) => {
          if (inputRoleId) {
            return true;
          } else {
            console.log('Please enter a role id.');
          }
        },
      },
      {
        type: 'input',
        name: 'manager_id',
        message:
          'Please enter a manager id if applicable (enter `null` if not applicable):',
      },
    ])
    .then((response) => {
      if (response.manager_id === 'null') {
        response.manager_id = null;
      }
      let query = `INSERT INTO employee SET ?`;

      database.query(
        query,
        {
          first_name: response.first_name,
          last_name: response.last_name,
          role_id: response.role_id,
          manager_id: response.manager_id,
        },
        (err) => {
          if (err) throw err;
          console.log('New employee has been added successfully!');
          mainMenu();
        }
      );
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Please enter the title for the new role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Please enter a salary for this role:',
      },
      {
        type: 'input',
        name: 'department_id',
        message: 'Please enter the corresponding department id for this role:',
      },
    ])
    .then((response) => {
      let query = `INSERT INTO role SET ?`;

      database.query(
        query,
        {
          title: response.title,
          salary: response.salary,
          department_id: response.department_id,
        },
        (err) => {
          if (err) throw err;
          console.log('New role has been added successfully!');
          mainMenu();
        }
      );
    });
};

const updateEmployeeRole = () => {
  let query = `SELECT * FROM employee`;
  database.query(query, (err, employees) => {
    if (err) throw err;
    let enrolledEmployees = employees.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Please select the employee you want to update:',
          choices: enrolledEmployees,
        },
        {
          type: 'input',
          name: 'role_id',
          message: 'Please enter a new role id for this employee:',
        },
      ])
      .then((response) => {
        let query = `UPDATE employee SET role_id = ? WHERE id = ?`;
        database.query(query, [response.role_id, response.employee], (err) => {
          if (err) throw err;
          console.log('Employee role has been updated successfully!');
          mainMenu();
        });
      });
  });
};

const updateEmployeeManager = () => {
  let query = `SELECT * FROM employee`;
  database.query(query, (err, employees) => {
    if (err) throw err;
    let enrolledEmployees = employees.map((employee, manager) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        manager: `${manager.first_name} ${manager.last_name}`,
        value: employee.id,
      };
    });

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'Please select the employee you want to update:',
          choices: enrolledEmployees,
        },
        {
          type: 'input',
          name: 'manager_id',
          message: 'Please enter a new manager id for this employee:',
        },
      ])
      .then((response) => {
        if (response.manager_id === 'null') {
          response.manager_id = null;
        }
        let query = `UPDATE employee SET manager_id = ? WHERE id = ?`;
        database.query(
          query,
          [response.manager_id, response.employee],
          (err) => {
            if (err) throw err;
            console.log('Manager role has been updated successfully!');
            mainMenu();
          }
        );
      });
  });
};

const viewEmployeesByDepartment = () => {
  console.log('Viewing employees by departments...\n');

  let query = `
    SELECT employee.first_name, employee.last_name, department.department_name AS department
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id`;
  database.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

const viewAllEmployeesByManager = () => {
  console.log('Viewing employees by manager...\n');

  let query = `
    SELECT employee.first_name, employee.last_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id`;
  database.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};

const viewDepartmentBudget = () => {
  console.log('Viewing department total budgets...\n');

  let query = `
    SELECT department.department_name AS department,
    SUM(salary) As budget
    FROM role
    INNER JOIN department ON role.department_id = department.id
    GROUP BY role.department_id;`;
  database.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
};
