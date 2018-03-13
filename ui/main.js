import React from 'react';
import ReactDOM from 'react-dom';

import Debt from '../components/Debt';
import FormField from '../components/FormField';
import Message from '../components/Message';
import Results from '../components/Results';
import ResultsData from '../components/ResultsData';

let form;

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			curInterestRate: 0.04,
			curTotalTaxBurden: getTaxBurden(),
			debt: {
				loans: getLoans(),
				get total () {
					let amount = 0;
					const loans = this.loans;

					for (let i = 0; i < loans.length; i++) {
						amount += loans[i].amount;
					}

					return amount;
				}
			},
			income: 50000,
			initialIncome: 50000,
			get netIncome () {
				return applyTax(this.income);
			},
			nestEgg: 0,
			raisePercent: 5,
			resultData: [],
			retirementIncome: 200000,
			savingPercent: 0.15,
			savings: 10,
			workingYears: 42,
			yrsRetired: 0,
		};
	}

	handleReset() {
		let stateObj = this.state;
		form = this.form;

		this.setState(
			{
				curTotalTaxBurden: getTaxBurden(),
				debt: {
					loans: getLoans(),
					get total () {
						let amount = 0;
						const loans = this.loans;

						for (let i = 0; i < loans.length; i++) {
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
				raisePercent: form.elements['raisePercent'].value ? parseFloat(form.elements['raisePercent'].value) : 5,
				resultData: [],
				retirementIncome: form.elements['retIncome'].value ? parseInt(form.elements['retIncome'].value) : 200000,
				savingPercent: form.elements['savePercent'].value ? parseFloat(form.elements['savePercent'].value / 100) : 0.15,
				savings: parseInt(form.elements['savings'].value || 0),
				get workingYears () {
					let value = stateObj.workingYears;

					if (form.elements['retAge'].value && form.elements['curAge'].value) {
						value = parseInt(form.elements['retAge'].value) - parseInt(form.elements['curAge'].value);
					}

					return value;
				},
				yrsRetired: 0,
			},
			this.work
		);
	}

	work() {
		let rows = [];
		let income = this.state.income;
		let savings = this.state.savings;
		let graphData = [];

		for (let year = 1; year <= this.state.workingYears; year++) {
			let disposibleIncome = this.state.netIncome * this.state.savingPercent;

			if (this.state.debt.total) {
				disposibleIncome = payOffDebt(disposibleIncome);
			}

			savings = interest(savings + disposibleIncome);

			income = giveRaise(income, this.state.raisePercent);

			graphData.push({Age: year, 'Net Income': applyTax(income.toFixed(2)), savings: savings.toFixed(2)});

			rows.push(
				<ResultsData
					income={applyTax(income).toFixed(2)}
					key={year}
					savings={savings.toFixed(2)}
					year={year}
				/>
			);
		}

		this.setState(
			{
				income: income,
				nestEgg: savings,
				resultData: rows,
				savings: savings,
				graphData: graphData,
			},
			this.retire
		);
	}

	// finish this function
	payOffDebt(amount) {
		// if (this.state.savings) {
		// 	amount += this.state.savings;
		// }

		// this.state.debt.loans = [];

		// let leftover = amount - this.state.debt.total;

		// return (leftover > 0) ? leftover : 0;
		return amount;
	}

	retire() {
		let savings = this.state.savings;
		let yrsRetired = this.state.yrsRetired;

		do {
			savings = interest(savings, this.state.curInterestRate) - this.state.retirementIncome
			yrsRetired++
		} while (savings > this.state.retirementIncome)

		this.setState({
			savings: savings,
			yrsRetired: yrsRetired,
		});
	}

	calculate() {
		this.work();
		// this.retire();
	}

	render () {
		return (
			<div className="wrapper">
				<form action="javascript:;" method="POST" name="retirement" ref={fm => this.form = fm}>
					<legend>Info</legend>

					<FormField handleBlur={() => this.handleReset()} label="Annual Income (Gross)" name="income" placeholder="$50000" />
					<FormField handleBlur={() => this.handleReset()} label="Current Age" name="curAge" placeholder="25" />
					<FormField handleBlur={() => this.handleReset()} label="Target Retirement Age" name="retAge" placeholder="67" />
					<FormField handleBlur={() => this.handleReset()} label="Current Savings" name="savings" placeholder="$0" />
					<FormField handleBlur={() => this.handleReset()} label="Percent of Net income saved" name="savePercent" placeholder="15%" />
					<FormField handleBlur={() => this.handleReset()} label="Expected average raise" name="raisePercent" placeholder="5%" />
					<FormField handleBlur={() => this.handleReset()} label="Target Retirement Income" name="retIncome" placeholder="$200000" />

					<label>Debt</label>
					<Debt />

					<button type="submit" className="btn btn-primary" onClick={() => this.handleReset()}>Calculate</button>
				</form>

				<Results resultData={this.state.resultData} />

				<Message
					nestEgg={this.state.nestEgg}
					yrsRetired={this.state.yrsRetired}
					retirementIncome={this.state.retirementIncome}
					workingYears={this.state.workingYears}
					initialIncome={this.state.initialIncome}
					raisePercent={this.state.raisePercent}
					savingPercent={this.state.savingPercent}
					curInterestRate={this.state.curInterestRate}
					yrsRetired={this.state.yrsRetired}
					workingYears={this.state.workingYears}
				/>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.querySelector('.app')
);

function applyTax(amount, rate) {
	rate = rate || getTaxBurden();

	if (rate > 1) {
		rate = rate / 100;
	}

	let inverse = 1 - rate;

	return amount * inverse;
}

function getLoans() {
	let loans = [];

	if (form) {
		let loanNodes = form.querySelectorAll('.debt-group');

		loanNodes.forEach(
			item => {
				let loan = {
					amount: parseInt(item.querySelector('.debt').value),
					interestRate: parseInt(item.querySelector('.interest').value)
				};

				loans.push(loan);
			}
		);
	}

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
	rate = rate || 0;

	if (rate < 1) {
		rate += 1;
	}

	return amount * rate;
}