import React from 'react';
import ReactDOM from 'react-dom';

import Debt from '../components/Debt';
import FormField from '../components/FormField';
import Message from '../components/Message';
import Results from '../components/Results';
import ResultsData from '../components/ResultsData';

let form;
let person = {};
let vars = {};

class Form extends React.Component {
	calculate() {
		form = this.form;
		setVars();
		makePerson();
		ReactDOM.render(<Results resultData={work()} />, document.querySelector('.results-wrapper'));
		retire();
		ReactDOM.render(<Message person={person} vars={vars} />, document.querySelector('.message-wrapper'));
	}

	render () {
		return (
			<form action="javascript:;" method="POST" name="retirement" ref={fm => this.form = fm}>
				<legend>Info</legend>

				<FormField handleBlur={() => this.calculate()} label="Annual Income (Gross)" name="income" placeholder="$50000" />
				<FormField handleBlur={() => this.calculate()} label="Current Age" name="curAge" placeholder="25" />
				<FormField handleBlur={() => this.calculate()} label="Target Retirement Age" name="retAge" placeholder="67" />
				<FormField handleBlur={() => this.calculate()} label="Current Savings" name="savings" placeholder="$0" />
				<FormField handleBlur={() => this.calculate()} label="Percent of Net income saved" name="savePercent" placeholder="15%" />
				<FormField handleBlur={() => this.calculate()} label="Expected average raise" name="raisePercent" placeholder="5%" />
				<FormField handleBlur={() => this.calculate()} label="Target Retirement Income" name="retIncome" placeholder="$200000" />

				<label>Debt</label>
				<Debt />

				<button type="submit" className="btn btn-primary" onClick={() => this.calculate()}>Calculate</button>
			</form>
		);
	}
}

ReactDOM.render(
	<Form />,
	document.querySelector('.form-wrapper')
);

function applyTax(amount, rate) {
	rate = rate || vars.curTotalTaxBurden;

	if (rate > 1) {
		rate = rate / 100;
	}

	let inverse = 1 - rate;

	return amount * inverse;
}

function getLoans() {
	let loans = [];
	let loanNodes = form.querySelectorAll('.debt-group');

	loanNodes.forEach(
		item => {
			var loan = {
				amount: parseInt(item.querySelector('.debt').value),
				interestRate: parseInt(item.querySelector('.interest').value)
			};

			loans.push(loan);
		}
	)

	return loans;
}

// finish this function
function getTaxBurden() {
	return 39;
}

function giveRaise(salery, percent) {
	if (!percent) {
		return;
	}

	if (percent >= 1) {
		percent = percent / 100;
	}

	let raise = 1 + percent;

	return salery * raise;
}

function interest(amount, rate) {
	rate = rate || vars.curInterestRate;

	if (rate < 1) {
		rate += 1;
	}

	return amount * rate;
}

function makePerson() {
	person = {
		debt: {
			loans: getLoans(),
			get total () {
				let amount = 0;
				const loans = this.loans;

				for (var i = 0; i < loans.length; i++) {
					amount += loans[i].amount;
				}

				return amount;
			}
		},
		income: parseInt(form.elements['income'].value || 50000),
		initialIncome: parseInt(form.elements['income'].value || 50000),
		get netIncome () {
			return applyTax(this.income);
		},
		nestEgg: 0,
		savings: parseInt(form.elements['savings'].value || 0),
		workingYears: vars.workingYears,
		yrsRetired: 0
	};
}

// finish this function
function payOffDebt(amount) {
	if (person.savings) {
		amount += person.savings;
	}

	person.debt.loans = [];

	let leftover = amount - person.debt.total;

	return (leftover > 0) ? leftover : 0;
}

function retire() {
	do {
		person.savings = interest(person.savings);
		person.savings = person.savings - vars.retirementIncome;

		person.yrsRetired++;
	} while (person.savings > vars.retirementIncome)
}

function setVars() {
	vars.curInterestRate = 0.04;
	vars.curTotalTaxBurden = getTaxBurden();
	vars.raisePercent = form.elements['raisePercent'].value ? parseFloat(form.elements['raisePercent'].value) : 5;
	vars.retirementIncome = form.elements['retIncome'].value ? parseInt(form.elements['retIncome'].value) : 200000;
	vars.savingPercent = form.elements['savePercent'].value ? parseFloat(form.elements['savePercent'].value / 100) : 0.15;
	vars.workingYears = 42;

	if (form.elements['retAge'].value && form.elements['curAge'].value) {
		vars.workingYears = parseInt(form.elements['retAge'].value) - parseInt(form.elements['curAge'].value);
	}
}

function work() {
	var rows = [];
	for (let year = 1; year <= vars.workingYears; year++) {
		var disposibleIncome = person.netIncome * vars.savingPercent;

		if (person.debt.total) {
			disposibleIncome = payOffDebt(disposibleIncome);
		}

		person.savings = interest(person.savings + disposibleIncome);

		person.income = giveRaise(person.income, vars.raisePercent);

		rows.push(
			<ResultsData
				income={person.netIncome.toFixed(2)}
				key={year}
				savings={person.savings.toFixed(2)}
				year={year}
			/>);
	}
	person.nestEgg = parseInt(person.savings);

	return rows;
}
