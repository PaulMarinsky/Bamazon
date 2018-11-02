/* DO NOT DROP THE DATABASE! 
    DO NOT DROP THE DATABASE!
    DO NOT DROP THE DATABASE!
*/

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT (100) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Aqualung Legend LX', 'Regulators', 889.00, 10),
       ('Aqualung ABS', 'Alternate Air Sources', 139.00, 10),
       ('Solla fins', 'Fins', 89.00, 20), 
       ('Tusa - Paragon', 'Masks', 249.00, 20),
       ('Tusa - Freedom One', 'Masks', 119.00, 20),
       ('Aqualung i450T w/ wireless transmitter', 'Dive Computers', 1249.00, 15),
       ('Aqualung Axiom i3', 'BCDs', 349.00, 12),
       ('Velocity gloves', 'Gloves', 49.00, 10), 
       ('Aqualung HydroFlex 3mm Jump Suit', 'Wet Suits', 239.00, 5),
       ('Aqualung "Short Squeeze" knife', 'Accessories', 69.00, 10)
       
SELECT * FROM products;