INSERT INTO department (department_name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Customer Service');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 150000, 1),
       ('Salesperson', 75000, 1),
       ('Senior Software Engineer', 200000, 2),
       ('Software Engineer', 120000, 2),
       ('Senior Accountant', 150000, 3),
       ('Accountant', 100000, 3),
       ('Service Manager', 80000, 4),
       ('Service Representative', 65000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Chino', 'Moreno', 1, NULL),
       ('Abe', 'Cunningham', 2, 1),
       ('Ken', 'Gibson', 3, NULL),
       ('Frank', 'Delgado', 4, 3),
       ('Stephen', 'Carpenter', 5, NULL),
       ('Chi', 'Cheng', 6, 5),
       ('Aaron', 'Gillespie', 7, NULL),
       ('Matt', 'Greiner', 8, 7);

     