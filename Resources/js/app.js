

//Separations of concerns + Encapsulations + MVC + MODULES + CLOSURES + IEFE


// @ BUDGET CONTROLLER
var budgetController = (function () {

	// @ create a custom data type for expense (a constructor)
	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};
	
	Expense.prototype.calcPercentage = function (totalIncome) {
		
		if(totalIncome > 0)
			this.percentage = Math.round((this.value / totalIncome) * 100);
		else
			this.percentage = -1;
	};
	
	Expense.prototype.getPercentage = function () {
		return this.percentage;
	};


	// @ create a custom data type for Income (a constructor)
	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	// @ dataStructures to store all the important data and calculate them in need
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals:{
			exp:0,
			inc:0
		},
		budget: 0,
		percentage: -1

	};

	var calculateTotal = function (type) {
		var sum = 0;

		/*Using forEach method summing all the income or expense*/
		data.allItems[type].forEach(function (curElement) {
			sum+= curElement.value;
		});

		data.totals[type] = sum;
	};
	return{/*Creating a new Item according to input and storing them in ds + a public method*/
		addItem: function (type, des, val) {
			var newItem, ID;

			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1; //@ create new ID
			}
			else ID = 0;
			//	console.log('I am id - ' + ID);
			if(type=== 'exp'){/*Create new Item according to type*/
				newItem = new Expense(ID,des,val);
			}
			else if(type === 'inc'){
				newItem = new Income(ID, des, val);
			}
			/*Adding them to ds*/
			data.allItems[type].push(newItem);
			return newItem; /*Only returing the new item (object from constructor) not the whole ds*/
		},

		testing: function () {
			console.log(data);
		},

		deleteItem: function (type, id) {

			/*Why map method????
			 Ans:
			 for example:
			 id = 6
			 data.alltems[type][id] will not able to do the operations usually
			 because we want the id to delete not the index*/

			var ids, index;
			ids = data.allItems[type].map(function (current) {
				return current.id;
			});

			index = ids.indexOf(id);
			if(index !== -1){
				data.allItems[type].splice(index,1); /*splice is used to delete an item*/
			}

		},

		calculateBudget: function () {

			// @ Calculate total income and expenses

			calculateTotal('inc'); /*Total income*/
			calculateTotal('exp'); /*Total expense*/

			// @ Calculate the budget: income - expenses

			data.budget = data.totals.inc - data.totals.exp;

			// @ calculate the percentage of income that we spent already

			if(data.totals.inc>0)
			data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
		},

		calculatePercentages: function () {

			/*Example of work:
			  Expense:
			  a = 20
			  b = 10
			  c = 40
			  income = 100
			  for a = 20/100 = 20%
			  b = 10/100 = 10%
			  c = 40/100 = 40%
			*/

			data.allItems.exp.forEach(function (current) {

				current.calcPercentage(data.totals.inc);
			});
		},
		
		getPercent: function () {

			var allPerc = data.allItems.exp.map(function (cur) {
				return cur.getPercentage();
			});
			return allPerc;
		},

		getBudget: function () {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},
		initBudget: function () {
			return {
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1

			}
		}
	};


})();


// @ UI CONTROLLER
var UIController = (function () {


	/*Storing all the class in variable is a good tricks*/
	var DomStrings = {
		inputTypes: '.add__type',
		inputDesc: '.add__description',
		inputValue: '.add__value',
		inputbtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expneseLabel: '.budget__expenses--value',
		percentageLable: '.budget__expenses--percentage',
		container: '.container',
		expPerLabel: '.item__percentage',
		dateLabel: '.budget__title--month'


	};

	var formatNUmber = function (num,type) {

		/*
		Task:
		+ or - before number
		exactly 2 decimal points
		comma separating the thousands
		*/
		var numSplit,int,dec, sign;
		num = Math.abs(num); /*A method from math prototype*/
		num = num.toFixed(2); /*A method from number prototype returns a string*/

		numSplit = num.split('.');

		int = numSplit[0];
		dec = numSplit[1];

		if(int.length > 3){
			int = int.substr(0,int.length-3) + ',' + int.substr(int.length-3,3); /*A part of the string to
				return Exp: 2310 -> 2,310*/
		}

		return (type === 'exp' ? '-' : '+') + ' '+ int+ '.' + dec;
	};

	var nodeListForEach = function (list,callback) {
		for(var i=0; i<list.length; i++){
			callback(list[i], i);
		}
	};
	return{/*I am the one who is public to all call and returns input value of the apps*/
		getInput: function () {
			return{ /*Returning all the inputs as objects*/
				type: document.querySelector(DomStrings.inputTypes).value, // will be either inc or exp, check the html code
				description: document.querySelector(DomStrings.inputDesc).value,
				value: parseFloat(document.querySelector(DomStrings.inputValue).value)/*Converting a strig to float*/
			};
		},
		getDomStrings: function () {
			return DomStrings;
		},


		addListItem: function (obj, type) {

			var html, newHtml , element;
			// @ create HTML string with placeholder text

			if(type === 'inc'){
				element = DomStrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			else if(type === 'exp'){
				element = DomStrings.expenseContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}


			// @ Replace the placeholder text with actual data

			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);

			newHtml = newHtml.replace('%value%', formatNUmber(obj.value,type));

			// @ Insert the HTML into the DOM

			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		displayPercentages: function (percentages) {

			var fields = document.querySelectorAll(DomStrings.expPerLabel);

			/*Own for each function for travesing nodelist + a good example of function callback + Reusable codes*/

			nodeListForEach(fields, function (current, index) {

				if(percentages[index] > 0)
				current.textContent = percentages[index] + '%';
				else
					current.textContent = '---';
			});
		},

		clearFields: function () {
			/*quite similar to css selectors*/
			var fields;
			fields = document.querySelectorAll(DomStrings.inputDesc +
												',' + DomStrings.inputValue);/*Return a list not array*/
			var fieldsArr = Array.prototype.slice.call(fields); /*Converting a list to array*/

			fieldsArr.forEach(function (current, index, array) {/*callBack func with three arg*/
				current.value = "";
			});

			/*focusing on decription fields after clearing them*/
			fieldsArr[0].focus();

		},
		displayBudget: function (obj) {

			var type;
			obj.budget >0 ? type = 'inc' : type = 'exp';
			document.querySelector(DomStrings.budgetLabel).textContent = formatNUmber(obj.budget,type);
			document.querySelector(DomStrings.incomeLabel).textContent = formatNUmber(obj.totalInc,'inc');
			document.querySelector(DomStrings.expneseLabel).textContent = formatNUmber(obj.totalExp,'exp');
			if(obj.percentage > 0){
				document.querySelector(DomStrings.percentageLable).textContent = obj.percentage + '%';
			}
			else{
				document.querySelector(DomStrings.percentageLable).textContent = '---';
			}
		},
		rmvItemFromDisplay: function (selectorID) {

			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el); /*Weird way of removing, we only can remove parents child!!!! DNW*/
		},

		displayMonth: function () {
			var now = new Date();

			var year = now.getFullYear();
			document.querySelector(DomStrings.dateLabel).textContent = year;

		},

		changeType: function () {
			var fields = document.querySelectorAll(DomStrings.inputTypes + ','  + DomStrings.inputDesc + ','
			+ DomStrings.inputValue);


			nodeListForEach(fields, function (cur) {
				cur.classList.toggle('red-focus');
			});

			document.querySelector(DomStrings.inputbtn).classList.toggle('red');
		}
	};

})();


// @ GLOBAL APP CONTROLLER - delegating task to other controller on event call
var Controller = (function (budgetCtrl, UICtrl) {

	var setupEventListeners = function () {

		var DOM = UICtrl.getDomStrings();
		document.querySelector(DOM.inputbtn).addEventListener('click', ctrlAddItem);

		// @ A global keyboard event
		document.addEventListener('keypress', function (event) {
			if(event.keyCode === 13 || event.which === 13){
				ctrlAddItem();
			}
		});

		/*EVNET DELEGATION ** IMPORTANT CONCEPT*/
		document.querySelector(DOM.container).addEventListener('click',ctrlDelItem);

		document.querySelector(DOM.inputTypes).addEventListener('change',UICtrl.changeType);
		
	};


	var updateBudget = function () {
		// @Calculate the budget

		budgetCtrl.calculateBudget();

		// @ Return the budget

		var budget = budgetCtrl.getBudget();
		// @Display the budget on the UI

		UICtrl.displayBudget(budget);
	};

	var updatePercentages = function () {

		// @Calculate the percentages

		budgetCtrl.calculatePercentages();

		// @Read percentages from the budget controller

		var percentages = budgetCtrl.getPercent();
		//@Update the UI with the new percentages

		console.log(percentages);
		UICtrl.displayPercentages(percentages);

	};
	var ctrlAddItem = function () {

		var input, newItem;
		// @ Get the field input data
		input = UIController.getInput();

		if(input.description !== "" && !isNaN(input.value) && input.value >0)
		{
			//console.log(input);
			// @ Add the item to the budget controller

			newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			// @ Add the item to the UI

			UICtrl.addListItem(newItem, input.type);

			// @ clear the fields after every input

			UICtrl.clearFields();

			// @ Calculate and Update budget

			updateBudget();

			//@ calculate and update percentages

			updatePercentages();

		}

	};
	
	var ctrlDelItem = function (event) {
		var itemId, splitId, type , ID;

		/*Event Delegation **** IMPORTANT CONCEPT*/
		itemId = (event.target.parentNode.parentNode.parentNode.id);
		if(itemId){
		//	itemID = either income-1 or expense-1 -- we should split

			splitId = itemId.split('-');

			ID = parseInt(splitId[1]);
			type = splitId[0];

			// @ Delete the item from the data structure

			budgetCtrl.deleteItem(type, ID);

			// @ Delete the item from the UI

			UICtrl.rmvItemFromDisplay(itemId);
			// @ Update the new budget

			updateBudget();

			//@Calculate and update percentages

			updatePercentages();

		}
	};

	return{
		init: function () {
			console.log('Application has started');
			UICtrl.displayBudget(budgetCtrl.initBudget());
			setupEventListeners();
			UICtrl.displayMonth();
		}
	};
})(budgetController, UIController);

Controller.init();
