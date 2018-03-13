import React, {Component} from 'react';

export default class Results extends Component {
	render() {
		return (
			<table className="table table-bordered table-hover">
				<thead>
					<tr>
						<th>Year</th>
						<th>Net Income ($)</th>
						<th>Savings ($)</th>
					</tr>
				</thead>
				<tbody>
					{this.props.resultData}
				</tbody>
			</table>
		);
	}
}