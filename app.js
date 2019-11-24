const budgetController = (function () {

    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    let calculateTotal = (type) => {
        let sum = 0;
        data.allItems[type].forEach ((cur) => {
            return sum += cur.value;
        });
        data.totals[type] = sum
    }

    let data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
    };

    return {
        addItem: (type, des, val) => {
            let newItem, ID;

            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Creace new item  inc or exp type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push it into our data
            data.allItems[type].push(newItem);

            //return new element
            return newItem;
        },

        calculateBudget:  () => {
            //calc total incomes and expenses
            calculateTotal('exp')

            calculateTotal('inc')
            //calc budget
            data.budget = data.totals.inc - data.totals.exp;
            //calc % of income
            data.percentage = Math.round(data.totals.exp / data.totals.inc * 100)
        },
        getBudget: () => {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
            }
        },
        testing: () => {
            console.log(data)
        }
    }



})();


const UIController = (function () {

    let DOMstings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        deleteItem: '.item__delete--btn',
    }

    return {
        getInput: () => {
            return {
                type: document.querySelector(DOMstings.inputType).value, // Will be inc or exp
                description: document.querySelector(DOMstings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstings.inputValue).value),
            }
        },

        addListItem: (obj, type) => {
            //create HTML sting with placeholder 
            let html, element;
            if (type === 'inc') {
                element = DOMstings.incomeContainer;

                html = `<div class="item clearfix" id="income-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">+ ${obj.value}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
                </div>`
            } else if (type === 'exp') {
                element = DOMstings.expensesContainer;

                html = `<div class="item clearfix" id="expense-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">- ${obj.value}</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
                </div>`
            }

            //insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
            
        },

        addBudgets: (obj) => {
            document.querySelector('.budget__expenses--value').innerHTML = `- ${obj.totalExp}`;
            document.querySelector('.budget__expenses--percentage').innerHTML = `- ${obj.percentage} %`;
            document.querySelector('.budget__income--value').innerHTML = `+ ${obj.totalInc}`;
            document.querySelector('.budget__value').innerHTML =`+ ${obj.budget}`;
        },

        clearFields: () => {
            let fields = document.querySelectorAll(DOMstings.inputDescription + ', ' + DOMstings.inputValue);
            let fieldsArray = Array
                .prototype
                .slice
                .call(fields);
            fieldsArray.forEach((cur, ind, arr) => {
                cur.value = "";
            });
            fieldsArray[0].focus();
        },
        getDOMstrings: () => {
            return DOMstings;
        }
    };
})();



const controller = (function (budgetCtrl, UICtrl) {

    let setupEventListeners = () => {
        let DOM = UIController.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
        document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        });
    };

    let updateBudget = () => {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        // 2. Return the budget
        let budget = budgetCtrl.getBudget();
        // 3. Display the budget on UI
        UICtrl.addBudgets(budget);
    }

    let ctrlAddItem = () => {
        // 1. Get the field input data
        let input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
        // 2. Add the item to the budget contoller
        let newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add new item to UI
        UICtrl.addListItem(newItem, input.type);
        // 4. Clear Fields
        UIController.clearFields();
        //5 Calculate and upd budget
        updateBudget();
        } else {
            console.log('Fields!!!!')
        }
 

    };

    return {
        init: () => {
            console.log('Started');
            setupEventListeners();
        }
    }

})(budgetController, UIController);


controller.init();