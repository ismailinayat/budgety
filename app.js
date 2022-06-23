/*

  PERCENTAGES:

  Following is the todo list for calculating percentage of each expense item to the total income and then showing it on the UI.

    - CALCULATE PERCENTAGES
    - UPDATE PERCENTAGES IN UI
    - DISPLAY THE CURRENT MONTH AND YEAR
    - NUMBER FORMATING
    - IMPROVE INPUT FIELD UX

    The question is that when will these income percentages will actually be updated? The answer is that new percentages should be calculated each time we add or delete an item. Therefore we will create a
    new function called 'updatePercentages' for this in the 'controller' and then call it in 'ctrlAddItem' and 'ctrlDeleteItem' functions. So this function will accomplish following 3 tasks

          1) Calculate percentages and save these in the data object
          2) Read percentages from the budget controller
          3) Update the UI with the new percentages

    So we will create a seperate function called 'calculatePercentages' for calculating percentages in the 'budgetController' and call it in the 'updatePercentages' function in the 'controller'. Now what
    we need to do in this function is to get all of the expenses items and also the 'total income' and for each of the item we will calculate the percentage using 'totalIncome/current expense'. However
    because we need to do this for each expense item individually then we should actually create a method for this in the 'Expense' prototype. So we will do as follow:

                                                                this.percentage = -1;

                                                                Expense.prototype.calcPercentage = function (totalIncome) {
                                                                  if (totalIncome > 0) {

                                                                    this.percentage = Math.round((this.value / totalIncome ));
                                                                  
                                                                  } else {
                                                                    this.percentage = -1;
                                                                  }
                                                                };

                                                                Expense.prototype.getPercentage = function () {
                                                                  return this.percentage;
                                                                }

    Next we will go back to 'calculatePercentages' function and loop through each of the expense item and on each of the item we will call this and pass the 'data.totals.inc' as input to this method.
    
    
                                                                calculatePercentages: function() {

                                                                  data.allItems.exp.forEach(function(el) {

                                                                    el.calcPercentage(data.totals.inc);
                                                                  })
                                                                }
    
    Next we will create another seperate function 'getPercentages' which will then loop through the 'exp' array in the 'data' and for each of the 'exp' item we will get the 'percentage' out of it.

                                                                getPercentages: function() {
                                                                  var allPerc = data.allItems.exp.map(function(el) {

                                                                    // return this.percentage;
                                                                    //return el.percentage;
                                                                  })

                                                                  return allPerc;
                                                                }

    Now that we have created the seperate functions for calculatePercentages and then 'getPercentages' we will call both of these in the 'updatePercentages' function.


                                                                var updatePercentages = function () {

                                                                  calculatePercentages();

                                                                  var percentages = getPercentages();
                                                                }

    Now for each of the item added or deleted the updatePercentages function will give us an array where each element is a percentage of that exp to total income.

    UPDATING THE PERCENTAGES UI:

    In order to update the percentages for each expense item in our UI we will create a function called 'displayPercentages' in the 'UIController' and this function will take in the 'percentages' that is
    returned by the 'getPercentages' method. Now in our HTML markup we have given the 'item__percentage' to the 'div' element which displays the percentage. So we need to select all of these elements and
    we do that by using 'querySelectorAll' method and pass in the 'item__percentage'. However again instead of passing the class names directly we will create a reference for it in 'DOMstrings' and call
    it 'expensesPercLabel' and the pass this into 'querySelectorAll' method and save the result in a variable called 'fields'.

    Next we need to loop through all of the items returned by 'querySelectorAll' method but we know that we can't use the forEach method because 'querySelectorAll' returns a 'NodeList' instead of an array.
    Previously when we wanted to iterate over node list we implemented a sort of hack by using the 'slice' method. However as we said that is only a hack and instead what we will do is that we will create
    our own forEach function for node List called 'nodeListForEach'.

    So if we think about forEach what it does is that it takes an array as input and then gives us a callback function and in that callback function will have access to the current iteration of element and
    also the current index as well. And then for each of the element whatever we will write in our callback function body will be applied on each of the element in that array. So we can create a function like 
    that as follows:

                                                                var nodeListForEach = function(list, callback) {

                                                                  for (var i = 0; i < list.length; i++) {

                                                                    callback(list[i], i);
                                                                  }

                                                                }

    And then we will call it on our fields node list and for each of the element in it we will set its 'textContent' equal to the 'percentage' in the 'percentages' array on the same index.

                                                              nodeListForEach(fields, function (el, index) {

                                                                el.textContent = percentages[index] + '%';

                                                              })

    However before it we should also check if the percentage of the current index number is greater than 0 then do that else simply set the 'el.textContent' to '---'.

                                                              nodeListForEach(fields, function (el, index) {

                                                                if (percentages[i] > 0) {

                                                                  el.textContent = percentages[index] + '%';
                                                                } else {

                                                                  el.textContent = '---';
                                                                }

                                                              })

    And now our 'displayPercentages' function is ready we will call it in our 'updatePercentages' function and pass the 'percentages' that is returned by the 'getPercentages' function.


  FORMATTING OUR BUDGET NUMBERS: STRING MANIPULATION:

  There are following formatting that we want to apply to our numbers:

     - All numbers should be upto two decimal places even if they are integers.
     - All the expenses should have the - signs and all incomes should have the + sign.
     - If the numbers are in thousands than we should have a comma.
     
  The way we will implement this is that we will create a method in the UI controller and when each time these numbers are displayed on the UI we will call this method. This method will take the inputed number
  and this method will output the formatted number and along with that it will also take the 'type' as input.

                                                              formatNumber: function(num, type) {

                                                              }

  The first thing that we will do is simply convert the inputed number to an absolute number and again we will use the 'Math' module and call it 'abs' function and pass the num.
  Next step is to take care of the decimal places and there is a very handy method called 'toFixed' available on all the numbers for this and it takes the number of decimal places that we want. So just like
  that if we put a number '-2131.5479' it will be converted into '2131.55'. However this 'toFixed' method returns a string as a result after rounding the number upto two decimal places.

  Next we need to think about how to format the numbers in comma seperated. In order to do that we will split the result after formatting the number to round upto two decimal places. And we will split by the
  '.' and this way we will have the integers and floats seperate. Then we will store the first element returned by the 'split' method into the variable 'int' and the 2nd element into the variable 'dec'.
  Next on the 'int' variable we will use the if condition to check if its length is greater than the 3. The 'int' is the string therefore we will use the 'length' method on it and say if its length is greater 
  than 3 then we will need to implement comma. So how can we actually insert the comma? Well we will use a method called 'substr()' on this 'int' and this 'substr()' method takes in two inputs which are 
  the start position and end position of the string.

  So lets say we have a string '2345' then if we use the substr method on it and pass the '0, 1' as the two arguements then we will get 2. So we will insert the comma as follows:

                                                            var int = int.substr(0, 1) + ',' + int.substr(1, 3);

  And as a result we will get '2,345'. However this works with strings of length 4 but imagine that the string is '23456'. The above code will return 2,345 however it should be '23,456'. So in order to make
  it work we will make the 'substr' arguements dynamic by again using the length of the string.

                                                            var int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)

  The above code will work on the numbers upto the 6 length.

  Next we need to put the '+' or '-' sign. So we will use the ternery operator as following:


                                                              type === 'exp' ? sign = '-' : sign = '+';

  Finally we will return the whole string as follows:

                                                              return sign + ' ' + int + '.' + dec;

  And now we will call this 'formatNumber' function and pass the integers that we want to format.































                                                                
*/

///////////////////////////////////////////// /BUDGET/DATA CONTROLLER ///////////////////////////////////////////////

var budgetController = (function() {

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: 0
  }

  var calculateTotal = function (type) {

    var sum = 0;
    data.allItems[type].forEach(function(el){ 
      sum += el.value;
    })
    data.totals[type] = sum;
  }


  return {

    addItem: function(type, des, val) {

      var newItem, ID;

      // Creating a unique ID number for the newItem being added
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Creating the new item depending on what the user selected
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // Adding the item into relevent array
      data.allItems[type].push(newItem);
      return newItem
    },

    calculateBudget: function() {

      // 1) CALCULATE TOTAL INCOME AND EXPENSE AND UPDATE THE 'data.totals.inc' and 'data.totals.exp'.
      calculateTotal('inc');
      calculateTotal('exp');

      // 2) CALCULATE THE NET BUDGET AND UPDATE THE DATA

      data.budget = data.totals.inc - data.totals.exp;

      // 3) CALCULATE THE PERCENTAGE AND UPDATE THE DATA

      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }

    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    deleteItem: function(type, ID) {
      var ids, index;

      // Extracting ids out of all of the items inside the inc or exp array.
      ids = data.allItems[type].map(function(el) {
        return el.id;
      })

      // Getting the index of the item which has id property equal to the 'ID'.
      index = ids.indexOf(ID);

      // Deleting the item from the 'inc' or 'exp' array.
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    }


  }

})()

///////////////////////////////////////////// UI CONTROLLER //////////////////////////////////////////////////

var UIController = (function() {
  var DOMstrings = {
    inputType: '.add__type',
    inputDesciprtion: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container'
  }


  return {
     getInput: function() {

      return {
        type : document.querySelector(DOMstrings.inputType).value,
        description : document.querySelector(DOMstrings.inputDesciprtion).value,
        value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
      }
    },

    getDOMstrings: function() {
      return DOMstrings;
    },

    addListItem: function(obj, type) {
      var html, element

      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = `<div class="item clearfix" id="inc-${obj.id}">
        <div class="item__description">${obj.description}</div>
        <div class="right clearfix">
            <div class="item__value">+ ${obj.value}</div>
            <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
        </div>
      </div>`
      } else if (type === 'exp') {
        element = DOMstrings.expenseContainer;
        html = `<div class="item clearfix" id="exp-${obj.id}">
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

      document.querySelector(element).insertAdjacentHTML('beforeend', html)
    },

    deleteListItem: function (itemID) {

      var el = document.getElementById(itemID);

      el.parentNode.removeChild(el);
    },

    clearFields: function() {
      
      var fields, fieldsArr

      fields = document.querySelectorAll(DOMstrings.inputDesciprtion + ', ' + DOMstrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(el) {
        el.value = "";
      })
     
      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {

      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }

    }
  }

})()

///////////////////////////////////////////// APP CONTROLLER ///////////////////////////////////////////////////

var controller = (function(budgetCtrl, UICtrl) {

  var setupEventListeners = function() {

    var DOMstrings = UICtrl.getDOMstrings();
    document.querySelector(DOMstrings.container).addEventListener('click', ctrlDeleteItem)
    document.querySelector(DOMstrings.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(e) {

    if (e.keyCode === 13 || e.which === 13) {
      ctrlAddItem();
    }
  });

  };

  var updateBudget = function() {
    // 1) CALCULATE THE BUDGET

    budgetCtrl.calculateBudget();

    // 2) GET THE BUDGET DATA

    var budget = budgetCtrl.getBudget();

    // 3) UPDATE THE BUDGET UI
    UICtrl.displayBudget(budget);
  }

  var ctrlAddItem = function () {

    var input, newItem;
    // 1. GET THE FIELD INPUT DATA
    input = UICtrl.getInput();
    
    if (input.description !== "" && !isNaN(input.value) && input.value !== 0) {

      // 2. CREATE AN INCOME OR EXPENSE OBJECT AND ADD IT INTO THE BUDGET CONTROLLER
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. ADD THE ITEM TO THE UI

      UICtrl.addListItem(newItem, input.type);

      // 4. CLEARING THE INPUT FIELDS
      UICtrl.clearFields();

      // 5. CALCULATE AND UPDATING THE BUDGET

      updateBudget();

    }
    
  };

  var ctrlDeleteItem = function (e) {
    var itemID, splitID, type, ID;

    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1) DELETE ITEM FROM DATA STRUCTURE (BUDGET CONTROLLER)

      budgetCtrl.deleteItem(type, ID);


      // 2) DELETE ITEM FROM UI (UIController)

      UICtrl.deleteListItem(itemID);


      // 3) UPDATE THE BUDGET

      updateBudget();
    }

  }

  return {

    init: function () {
      console.log('Application has been started');
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  }

  
})(budgetController, UIController)

controller.init();