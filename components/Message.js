import React, {Component} from 'react';

export default class Message extends Component {
	render() {
		const person = this.props.person;
		const vars = this.props.vars;

		return (
			<p className="results-message">
				Your retirement savings would be ${person.nestEgg.toFixed(2)}. It would last {person.yrsRetired} years at ${vars.retirementIncome} per year if you started work at age 25 and retired at {25 + vars.workingYears} with a starting salery of ${person.initialIncome} and a {vars.raisePercent}% raise annually while saving {vars.savingPercent * 100}% of your net income each year that accures interest at {vars.curInterestRate * 100}%. Better not live past {person.yrsRetired + vars.workingYears + 25}.
			</p>
		);
	}
}