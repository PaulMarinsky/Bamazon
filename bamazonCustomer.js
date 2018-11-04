//========== Required Dependencies ==========
var Table = require("cli-table"); //https://www.npmjs.com/package/cli-table
var inquirer = require("inquirer");
var mysql = require("mysql");

//========== Connect to the mySQL database ==========

var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);
    welcome();
});

//========= Welcome to Bamazon ==========
//---------------------------------
function welcome() {
    inquirer.prompt([{
        type: "confirm",
        name: "confirmation",
        message: "Welcome to Bamazon! Would you like to view our inventory?",
        default: true

    }]).then(function (user) {
        if (user.confirmation === true) {
            inventory();
        } else {
            console.log("Thank you for stopping by. Come back and shop with us anytime!");
            console.log("\n ================================================= \n");

            connection.end();
        }
    });
}

// ========= Available Scuba Gear Equipment in Stock =========
//------------------------------------------------------------
function inventory() {
    // Create the inventory table
    var table = new Table({
        head: ["Product ID", "Item", "Department", "Price", "Stock"],
        column_width: [10, 40, 40, 20, 20]
    });

    displayInventory();

    //---------- Function when called displays the available inventory ---------
    function displayInventory() {
        connection.query("SELECT * FROM products", function (err, res) {
            for (var i = 0; i < res.length; i++) {
                var itemId = res[i].item_id,
                    productName = res[i].product_name,
                    departmentName = res[i].department_name,
                    price = res[i].price,
                    stockQuantity = res[i].stock_quantity;

                table.push(
                    [itemId, productName, departmentName, price, stockQuantity]
                );
            }
            console.log("\n ========== Current Available Inventory ========== \n");
            console.log(table.toString());

            purchasePrompt();
        });
    }
}
// ========== Prompt the user if they"d like to make a purchase ==========
function purchasePrompt() {
    inquirer.prompt([{
        type: "confirm",
        name: "purchase",
        message: "Would you like to make a purchase?",
        default: true

    }]).then (function (user) {
        if (user.purchase === true) {
            itemSelect();
        } else {
            console.log("\n =================================================\n");
            console.log("Thank you for stopping by. Come back and shop with us anytime!");

            connection.end();
        }
    });
}

// ========== Shopper will make a selection from inventory ==========

function itemSelect() {
    inquirer.prompt([{
            type: "input",
            name: "inputId",
            message: "Enter the ID of the product you would like to purchase: "
        },

        {
            type: "input",
            name: "inputQuantity",
            message: "How many of this item would you like to purchase?"
        }

    ]).then (function (userPurchase) {

        // ---------- Connect to bamazonDB and query stock_quantity ----------

        connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function (err, res) {
            for (var i = 0; i < res.length; i++) {
                if (userPurchase.inputQuantity > res[i].stock_quantity) {
                    console.log("======================================================================");
                    console.log("\n === Sorry! We currently do not have " + userPurchase.inputQuantity + " of this item in stock === \n");

                    welcome();

                } else {
                    console.log("\n ========================================================================= \n");
                    console.log("We have your order in stock!");
                    console.log("\n ------------------------------------------ \n");
                    console.log("Your order for " + res[i].product_name + " has been placed");
                    console.log("You may review your order below:");
                    console.log("\n ====================================================================== \n");
                    console.log("Item: " + res[i].product_name);
                    console.log("Department: " + res[i].department_name);
                    console.log("Price: " + res[i].price);
                    console.log("Quantity Ordered: " + userPurchase.inputQuantity);
                    console.log("---------------------------------------------------------------\n");
                    console.log("Total: " + res[i].price * userPurchase.inputQuantity);
                    console.log("=============================================================");

                    // Define a variable named 'updateStock' which will be the stock on hand minus the amount ordered
                    var updateStock = (res[i].stock_quantity - userPurchase.inputQuantity);
                    var purchaseId = (userPurchase.inputId);

                    orderConfirm(updateStock, purchaseId);
                }
            }
        });
    });
}

//========== Order Confirmation ==========

function orderConfirm(updateStock, purchaseId) {
    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Are you sure you want to place this order?",
        default: true

    }]).then(function (userConfirm) {
        if (userConfirm.confirmPurchase === true) {
            connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: updateStock
                    },
                    {
                        item_Id: purchaseId
                    }
                ],

                function (err, res) {});

            console.log("================================================== \n");
            console.log("Your transaction has been completed. Thank you for your order!");
            console.log("\n ==================================================");

            welcome();
        } else {
            console.log("================================================== \n");
            console.log("You have canceled this order. You will not be charged");
            console.log("\n ==================================================");

            welcome();
        }
    });
}