





//ES5


var name5 = 'Jane Smith';

var age5 = 23;

name5 = 'Jane Miller'; /*Can mutate simply*/

/*console.log(name5);*/



function es5(passedTest) {
	if(passedTest){
		var firstName = 'john';
		var year = 1990;

	}
	/*console.log(firstName + ' ' + year);*/
}
es5(true);


//ES6

const name6 = 'Ahmed Maruf';

let age = 23; // by let it is mutable and its block scope where var is function scope



function es6(passedTest) {
	if(passedTest){
		let firstName = 'john';
		const year = 19690;

	}
	/*console.log(firstName + ' ' + year);*/
}
es6(true);



/*Es5*/

(function () {
	var c = 4;
})();

/*ES6*/
//Block and IFFEs

{
	const a = 1;
	let b = 2;
	/*a and b cant be accesible*/
	var c  = 3;/*c is accesible from outside*/
}


//STRINGS

let firstName = 'jon';
let lastName = 'snow';
const yearOfBirth = 1990;

function calcAge(year) {
	return 2016 - year;

}

/*
ES5*/

console.log('This is ' + firstName + ' ' + lastName + ' and he knows nothing at a age of ' + yearOfBirth);

/*ES6 uses template laterals*/

console.log(`This is ${firstName} ${lastName}`);

const n = `John Snow`;

console.log(n.startsWith('J'));
console.log(n.endsWith('w'));
console.log(n.includes('n S'));
console.log(`${firstName} `.repeat(5));

//ARROW FUNCTIONS in ES6 new

const year = [1990, 1234, 1434 ,2342 , 234];

//ES5

var ages5 = year.map(function (cur) {
	return 2017-cur;
});

var box5 = {
	color: 'green',
	position: '1',
	clickMe: function () {
		var self = this; /*Hack because normally this not worked rather worked as window obs by
		default*/
		alert('This is working!!!!');
		document.querySelector('.green').addEventListener('click', function () {
			var str = 'This is box number ' + self.position + ' and it is ' + self.color;
			alert(str);
		});
	}
};

box5.clickMe();

//ES6

var box6 = {
	color: 'blue',
	position: '2',
	clickMe: function () {
		alert('This is working!!!!');
		document.querySelector('.blue').addEventListener('click',
			() => { /*Share the closest this keyword*/
			var str = 'This is box number ' + this.position + ' and it is ' + this.color;
			alert(str);
		});
	}
};

box6.clickMe();



/*Instead of callback function*/

let ages6 = year.map(cur => 2016-cur); /*for only one argument*/

ages6 = year.map((el,ind) => `Age element ${ind+1}: ${2016-el}.`); /*for two arguments*/

//console.log(ages6);

ages6 = year.map((el,ind) => {
	const now = new Date().getFullYear();
	const age = now -el;
	return `Age element is ${ind+1}: ${age}`;
});


