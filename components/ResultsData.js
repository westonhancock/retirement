import React, {Component} from 'react';

export default class ResultData extends Component {
	render() {
		return (
			<tr>
				<td>{this.props.year}</td>
				<td>{this.props.income}</td>
				<td>{this.props.savings}</td>
			</tr>
		);
	}
}
