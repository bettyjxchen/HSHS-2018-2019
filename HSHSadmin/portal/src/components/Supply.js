// Author: Phil Wang
// TODO: Style sheet
// TODO: Clear input box once the user clicks add supply
// TODO: Add code to support modify

import React from "react";
import { withRouter } from "react-router-dom";
import * as firebase from "firebase";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from "./CheckboxComponent";
import Nav from "./navbar/Nav";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	paper: {
		height: 250,
		width: 100
	},
	control: {
		padding: theme.spacing.unit * 2
	}
});

const rootRef = firebase.database().ref();
const dateEntry = rootRef.child("dateEntry");
var regularItems = [
	"PB&J",
	"Tuna Sandwich",
	"Bottled Waters",
	"V8",
	"Juice",
	"Granola Bars",
	"Fruit Cups",
	"Fresh Fruit",
	"Socks",
	"Handwarmers",
	"Gloves",
	"Blankets",
	"Warm Clothing",
	"Toiletry Kits",
	"Female Hygiene Kits"
];

class SupplyPage extends React.Component {
	constructor(props) {
		super(props);
		this.addedItems = [];
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			spacing: "40"
		};
	}

	componentDidMount() {
		this.setState({
			value: ""
		});

		this.today = this.generateDate();
		this.checkedItems = new Set();
		this.checkEntryExist(this.today);
		this.forceUpdate();

		console.log(this.generateDate());
		console.log(firebase.database().ref("/interactions"));
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	toggleCheckbox = label => {
		if (this.checkedItems.has(label)) {
			this.checkedItems.delete(label);
			this.forceUpdate();
		} else {
			this.checkedItems.add(label);
			this.forceUpdate();
		}
	};

	createCheckbox = label => (
		// <Checkbox
		//   label={label}
		//   checked
		//   handleCheckboxChange={this.toggleCheckbox}
		//   key={label}
		// />

		<div>
			<input
				type="checkbox"
				id={label}
				name={label}
				onClick={() => this.toggleCheckbox(label)}
				defaultChecked
			/>
			<label htmlFor="supplies">{label}</label>
		</div>
	);

	//   addCheckboxesToChecked = label => {
	//     if (label.checked === true && !this.checkedItems.has(label)) {
	//       this.checkedItems.add(label);
	//     } else {
	//       if (label.checked !== true && this.checkedItems.has(label)) {
	//         this.checkedItems.delete(label);
	//       } else {
	//       }
	//     }
	//   };

	createCheckboxes = () => regularItems.map(this.createCheckbox);

	createAddedBoxes = () => this.addedItems.map(this.createCheckbox);

	//   addCheckboxesToChecked = () => regularItems.map(this.addCheckboxToChecked);

	//   addAddedboxesToChecked = () => this.addedItems.map(this.addCheckboxToChecked);

	checkEntryExist = date => {
		dateEntry.child(date).once("value", snapshot => {
			if (snapshot.val() !== null) {
				alert("You have already entered supplies");
				for (var item in snapshot.val().Supply) {
					if (regularItems.includes(item)) {
						this.checkedItems.add(item);
					} else {
						console.log("item is " + item);
						this.checkedItems.add(item);
						this.addedItems.push(item);
					}
				}
				console.log(this.checkedItems);
				this.forceUpdate();
			} else {
				alert("New Supply");
			}
		});
	};

	// Generate date of the day
	// Will be used as keys
	generateDate = () => {
		let today = new Date();
		let dd = today.getDate();
		let mm = today.getMonth() + 1; //January is 0!
		let yyyy = today.getFullYear();

		if (dd < 10) {
			dd = "0" + dd;
		}

		if (mm < 10) {
			mm = "0" + mm;
		}

		today = mm + "-" + dd + "-" + yyyy;

		return today;
	};

	handleAddItem = () => {
		this.addedItems.push(this.state.value);
		//this.checkedItems.add(this.state.value);
		this.forceUpdate();
	};

	handleSubmit = () => {
		let tempObject = {};

		for (const checkbox of this.checkedItems) {
			tempObject[checkbox] = 0;
		}

		dateEntry.update({
			[this.today]: {
				Supply: tempObject,
				Headcount: {
					totalPeople: 0,
					peopleAboutResource: 0,
					bedsCalled: 0,
					youth: 0
				}
			}
		});

		alert("Data entry saved successfully! Have a great shift");
	};

	handleFormSubmit = formSubmitEvent => {
		formSubmitEvent.preventDefault();
	};

	render() {
		// const { classes } = this.props;
		const { spacing } = this.state;

		return (
			<div
				style={{
					backgroundColor: "#dce0e2",
					width: "100%"
				}}
			>
				<Nav />
				<div
					style={{
						marginLeft: "218px",
						marginTop: "70px"
					}}
				>
					<Grid
						container
						spacing={16}
						style={{
							width: "100%"
						}}
					>
						<Grid item xs={12}>
							<div
								style={{
									padding: 30
								}}
							>
								<form onSubmit={this.handleFormSubmit}>
									{this.createCheckboxes()}
									{this.createAddedBoxes()}
									{/* {this.addCheckboxesToChecked()}
                {this.addAddedboxesToChecked()} */}
									<label style={{ padding: 10 }}>
										New Item:
										<input
											type="text"
											name="newItem"
											id="inputField"
											onChange={this.handleChange}
										/>
									</label>
									<button
										className="btn btn-default"
										type="add"
										onClick={() => {
											this.handleAddItem();
											document.getElementById("inputField").value = "";
										}}
									>
										Add Supply
									</button>

									<div>
										<button
											className="btn btn-default"
											type="submit"
											onClick={() => this.handleSubmit()}
										>
											Save
										</button>
									</div>
								</form>
							</div>
						</Grid>
					</Grid>
				</div>
			</div>
		);
	}
}

export default withRouter(SupplyPage);
