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
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';




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
	},
	chip: {
		margin: theme.spacing.unit,
	},
});

const rootRef = firebase.database().ref();
const dateEntry = rootRef.child("dateEntry");
var regularItems = [
	["PB&J", true],
	["Tuna Sandwich", true],
	["Bottled Waters", true],
	["V8", true],
	["Juice", true],
	["Granola Bars", true],
	["Fruit Cups", true],
	["Fresh Fruit", true],
	["Socks", true],
	["Handwarmers", true],
	["Gloves", true],
	["Blankets", true],
	["Warm Clothing", true],
	["Toiletry Kits", true],
	["Female Hygiene Kits", true]
];

class SupplyPage extends React.Component {
	constructor(props) {
		super(props);
		this.addedItems = [];
		this.handleChange = this.handleChange.bind(this);
		this.chip = [["Loading...", false]]
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
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	clearRegular = () => {
		for (let i = 0; i < regularItems.length; i++) {
			regularItems[i][1] = false;
		}
	}

	itemRegularIndex = (item) => {
		for (let i = 0; i < regularItems.length; i++) {
			if (regularItems[i][0] === item) {
				return i;
			}
		}

		return -1;
	}

	checkEntryExist = date => {
		dateEntry.child(date).once("value", snapshot => {
			if (snapshot.val() !== null) {

				this.clearRegular();
				for (let item in snapshot.val().Supply) {
					this.checkedItems.add(item);

					let index = this.itemRegularIndex(item);

					if (index === -1) { // doesn't exist in the list
						regularItems.push([item, true]);
					} else {
						regularItems[index][1] = true;
					}
				}

				alert("You have already entered supplies");

				this.chip = regularItems;
				this.forceUpdate();
			} else {
				this.chip = regularItems;

				for (let item of regularItems) {
					this.checkedItems.add(item[0]);
				}

				alert("New Supply");

				this.forceUpdate();

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

		today = yyyy + "-" + mm + "-" + dd;

		return today;
	};

	handleChipClick = (item) => {
		let index = regularItems.indexOf(item);
		regularItems[index][1] = !regularItems[index][1];

		if (this.checkedItems.has(item[0])) {
			this.checkedItems.delete(item[0]);
		} else {
			this.checkedItems.add(item[0]);
		}

		this.forceUpdate();
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	handleSubmit = () => {
		let tempObject = {};

		for (const checkbox of this.checkedItems) {
			tempObject[checkbox] = 0;
		}
		let date = this.generateDate();

		dateEntry.update({
			[date]: {
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
	}

	handleAddItem = () => {
		if (!this.state.itemName) {
			alert("Input field is empty");
			return;
		} else {
			if (this.itemRegularIndex(this.state.itemName) === -1) {
				regularItems.push([this.state.itemName, true]);
				this.checkedItems.add(this.state.itemName);
				this.forceUpdate();
			} else {
				alert('This item already exist');
			}
		}
	}

	render() {
		const { spacing } = this.state;
		var listChips = this.chip.map((item) => {
			return <span style={{ margin: "10px", display: "block" }}>
				<Chip
					avatar={<Avatar>ST</Avatar>}
					label={item[0] + (item[1] ? "     ✅" : "     ❌")}
					clickable
					onClick={() => this.handleChipClick(item)}
					color={item[1] ? "primary" : "default"}
					deleteIcon={<DoneIcon />}
				/>
			</span>
		})

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
								{listChips}
							</div>

							<div style={{marginLeft: "50px", marginBottom: "20px"}}>
								<TextField
									id="outlined-name"
									label="Add Item"
									value={this.state.itemName}
									onChange={this.handleChange('itemName')}
									margin="normal"
									variant="outlined"
								/>
							</div>
							<div>
								<span style={{margin: "40px"}}><Button
									variant="contained"
									color="primary"
									disableRipple
									onClick={() => this.handleAddItem()}
								>
									Add
     							</Button>
								 </span>
								 <span style={{margin: "40px"}}><Button
									variant="contained"
									color="primary"
									disableRipple
									onClick={() => this.handleSubmit()}
								>
									Submit
     							</Button></span>
							</div>
						</Grid>
					</Grid>
				</div>
			</div>
		);
	}
}


export default withRouter(SupplyPage);