import React, {Component} from 'react';

export default class Message extends Component {
	render() {
		return (
			<p className="results-message">
				Your retirement savings would be ${this.props.nestEgg.toFixed(2)}. It would last {this.props.yrsRetired} years at ${this.props.retirementIncome} per year if you started work at age {this.props.startAge} and retired at {this.props.startAge + this.props.workingYears} with a starting salery of ${this.props.initialIncome} and a {this.props.raisePercent}% raise annually while saving {this.props.savingPercent * 100}% of your net income each year that accures interest at {this.props.curInterestRate * 100}%. Better not live past {this.props.yrsRetired + this.props.workingYears + 25}.
			</p>
		);
	}
}