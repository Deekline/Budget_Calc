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

    let data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        }
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
        testing: () => {
            console.log(data)
        }
    }



})();

class Budget {
    constructor(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
}

let exp = new Budget('EXP', "test", 1234);
console.log(exp)





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
                value: document.querySelector(DOMstings.inputValue).value,
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
        clearFields: () => {
            let fields = document.querySelectorAll(DOMstings.inputDescription + ', ' + DOMstings.inputValue);
            let fieldsArray = Array
                .prototype
                .slice
                .call(fields)
                .forEach((cur, ind, arr) => {
                    cur.value = "";
                })
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



    let ctrlAddItem = () => {
        // 1. Get the field input data
        let input = UICtrl.getInput();
        // 2. Add the item to the budget contoller
        let newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add new item to UI
        UICtrl.addListItem(newItem, input.type);
        // 4. Clear Fields
        UIController.clearFields()
        // 5. Calculate the budget
        // 6. Display the budget on UI
    };

    return {
        init: () => {
            console.log('Started');
            setupEventListeners();
        }
    }

})(budgetController, UIController);


controller.init();