import React, {Component} from 'react';

export default class FormField extends Component {
	render() {
		let className = 'form-control ' + this.props.name;
		let inputType = this.props.inputType;
		let selectOptions = this.props.selectOptions;

		if (inputType == 'select') {
			return (
				<div className="form-group">
					{this.props.label ? (<label htmlFor={this.props.name}>{this.props.label}</label>) : ''}
					<select className={className} id={this.props.name} name={this.props.name} onChange={this.props.handleBlur}>
						{selectOptions}
					</select>
				</div>
			);
		}
		else {
			return (
				<div className="form-group">
					{this.props.label ? (<label htmlFor={this.props.name}>{this.props.label}</label>) : ''}
					<input className={className} id={this.props.name} name={this.props.name} onBlur={this.props.handleBlur} placeholder={this.props.placeholder} type="{inputType}" />
				</div>
			);
		}
	}
}