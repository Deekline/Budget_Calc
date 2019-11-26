const budgetController = (function () {

    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }
    }

    Expense.prototype.calcPerc = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPerc = function () {
        return this.percentage
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
        data.allItems[type].forEach((cur) => {
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
        deleteItem: (type, id) => {

            let ids = data.allItems[type].map((el) => el.id)

            let index = ids.indexOf(id)

            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }


        },
        calculateBudget: () => {
            //calc total incomes and expenses
            calculateTotal('exp')

            calculateTotal('inc')
            //calc budget
            data.budget = data.totals.inc - data.totals.exp;
            //calc % of income
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100)
            } else {
                data.percentage = -1
            }

        },
        calculatePercentages: () => {
            data.allItems.exp.forEach((cur) => {
                cur.calcPerc(data.totals.inc);
            })
        },
        getPercentages: () => {
            let allPercentages = data.allItems.exp.map((cur) => {
                return cur.getPerc()
            })
            return allPercentages
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
            console.log(Expense)
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
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    let formatNumber = function (num, type) {
        num = Math.abs(num);
        num = num.toFixed(2);
        let numSplit = num.split('.');
        let int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];

        return (type == 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    }
    let nodeListForEach = function (list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i)
        }
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

                html = `<div class="item clearfix" id="inc-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${formatNumber(obj.value, type)}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="fas fa-backspace"></i></i></button>
                    </div>
                </div>
                </div>`
            } else if (type === 'exp') {
                element = DOMstings.expensesContainer;

                html = `<div class="item clearfix" id="exp-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${formatNumber(obj.value, type)}</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="fas fa-backspace"></i></i></button>
                    </div>
                </div>
                </div>`
            }

            //insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);

        },
        deleteListItem: (selectorID) => {
            let el = document.getElementById(selectorID);
            el.parentNode.removeChild(el)
        },

        addBudgets: (obj) => {
            let type;
            obj.budget >= 0 ? type = 'inc' : type = 'exp'
            document.querySelector('.budget__expenses--value').innerHTML = `${formatNumber(obj.totalExp, 'exp')}`;
            if (obj.percentage <= 0) {
                document.querySelector('.budget__expenses--percentage').innerHTML = '---';
            } else {
                document.querySelector('.budget__expenses--percentage').innerHTML = `- ${obj.percentage} %`;
            }
            document.querySelector('.budget__income--value').innerHTML = `${formatNumber(obj.totalInc, 'inc')}`;

            document.querySelector('.budget__value').innerHTML = `${formatNumber(obj.budget, type)}`;
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
        displayPerc: (perc) => {
            let fields = document.querySelectorAll(DOMstings.expensesPercLabel);
            nodeListForEach(fields, function (cur, index) {
                if (perc[index] > 0) {
                    cur.textContent = perc[index] + '%'
                } else {
                    cur.textContent = '---';
                }

            })
        },
        displayMonth: () => {
            let now = new Date();
            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            let month = now.getMonth();
            let year = now.getFullYear();
            document.querySelector(DOMstings.dateLabel).textContent = months[month] + ' ' + year;
        },
        changedType: () => {
            let fields = document.querySelectorAll(
                DOMstings.inputType + ',' +
                DOMstings.inputDescription + ',' +
                DOMstings.inputValue)

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            })
            document.querySelector(DOMstings.inputBtn).classList.toggle('red')
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
    };

    let updateBudget = () => {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        // 2. Return the budget
        let budget = budgetCtrl.getBudget();
        // 3. Display the budget on UI
        UICtrl.addBudgets(budget);

    }
    let updatePercentages = () => {
        //Calc
        budgetCtrl.calculatePercentages();
        //Read from BudgetCtrl
        let perc = budgetCtrl.getPercentages();

        //Upd UI
        UICtrl.displayPerc(perc)
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
            //6. Calc and update Perc
            updatePercentages();
        } else {
            console.log('Fields!!!!')
        }


    };
    let ctrlDeleteItem = (event) => {
        let itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            let splitID = itemID.split('-');
            let type = splitID[0]
            let ID = Number(splitID[1])

            //  delete item from the data structure
            budgetController.deleteItem(type, ID)
            //  delete the item form the UI
            UIController.deleteListItem(itemID);
            // update and show the new budget
            updateBudget();
        }

    };

    return {
        init: () => {
            console.log('Started');
            UICtrl.addBudgets({
                budget: 0,
                percentage: -1,
                totalInc: 0,
                totalExp: 0,
            })
            setupEventListeners();
            UICtrl.displayMonth();
        }
    }

})(budgetController, UIController);


controller.init();