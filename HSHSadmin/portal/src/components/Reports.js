/* eslint-disable */
import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import * as firebase from "firebase";
import * as routes from "../constants/routes";
import Nav from "./navbar/Nav";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import ReportsTable from "./reports/ReportsTable";

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

class ReportsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			spacing: "40",
			user: false
		};
	}

	componentWillMount() {
		let self = this;
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				self.setState({ user: true });
			} else {
				self.setState({ user: false });
			}
		});
	}

	render() {
		const { classes } = this.props;
		const { spacing } = this.state;
		var user = this.state.user;
		if (user) {
			return (
				<div
					style={{
						height: "100%",
						width: "100%",
						backgroundColor: "#dce0e2"
					}}
				>
					<Nav />
					<div
						style={{
							marginLeft: "218px",
							marginTop: "54px"
						}}
					>
						<Grid
							container
							className={classes.root}
							spacing={16}
							style={{
								width: "100%"
							}}
						>
							<Grid item xs={12}>
								<ReportsTable />
							</Grid>
						</Grid>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<p>
						Sorry, you don't have access to this site. Please contact an admin
						if you have any questions.
					</p>
					<Link to="/">Return to homepage</Link>
				</div>
			);
		}
	}
	componentWillUnmount() {
		if (this.statePromises) this.statePromises.forEach(p => p.cancel());
	}
}

export default withStyles(styles)(ReportsPage);
