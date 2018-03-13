import React, {Component} from 'react';

import FormField from './FormField';

export default class Debt extends Component {
	render() {
		return (
			<div className="debt-group">
				<FormField name="debt" placeholder="Loan Balance" />
				<FormField name="interest" placeholder="Interest Rate" />
			</div>
		);
	}
}