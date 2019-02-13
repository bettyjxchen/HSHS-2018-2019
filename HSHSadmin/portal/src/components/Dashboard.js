/* eslint-disable */
import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import * as firebase from "firebase";
import * as routes from "../constants/routes";
import Nav from "./navbar/Nav";
import { FloatingActionButtons } from "./dashboard/FloatingActionButtons";
import { DashboardReport } from "./dashboard/DashboardReport";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import AdminIcon from "@material-ui/icons/PermIdentity";
import GroupIcon from "@material-ui/icons/Group";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";

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

class DashboardPage extends React.Component {
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
							marginLeft: "205px",
							marginTop: "65px",
							backgroundColor: "#dce0e2"
						}}
					>
						<Grid
							container
							className={classes.root}
							spacing={16}
							style={{
								backgroundColor: "#dce0e2"
							}}
						>
							<Grid
								item
								xs={12}
								style={{
									backgroundColor: "#dce0e2"
								}}
							>
								<Grid
									container
									className={classes.demo}
									justify="center"
									spacing={Number(spacing)}
									style={{
										backgroundColor: "#dce0e2"
									}}
								>
									<Grid item style={{ padding: "40px" }}>
										<div style={{ textAlign: "center" }}>
											<Button
												href="/reports"
												variant="fab"
												aria-label="Reports"
												className={styles.button}
												style={{
													height: "200px",
													width: "200px",
													backgroundColor: "#9e0806",
													marginTop: "100px"
												}}
												color="secondary"
											>
												<AdminIcon
													style={{
														height: "100px",
														width: "100px"
													}}
												/>
											</Button>
											<h1>Reports</h1>
											<h3 style={{ color: "#474747" }}>View daily street team reports</h3>
										</div>
									</Grid>

									<Grid item style={{ padding: "40px" }}>
										<div style={{ textAlign: "center" }}>
											<Button
												href="/volunteers"
												variant="fab"
												aria-label="Volunteers"
												className={styles.button}
												style={{
													height: "200px",
													width: "200px",
													backgroundColor: "#9e0806",
													marginTop: "100px"
												}}
												color="secondary"
											>
												<RecentActorsIcon
													style={{
														height: "100px",
														width: "100px"
													}}
												/>
											</Button>
											<h1>Volunteers</h1>
											<h3 style={{ color: "#474747" }}>
												Add new volunteer account
											</h3>
										</div>
									</Grid>

									<Grid item style={{ padding: "40px" }}>
										<div style={{ textAlign: "center" }}>
											<Button
												href="/admin"
												variant="fab"
												aria-label="Admin"
												className={styles.button}
												style={{
													height: "200px",
													width: "200px",
													backgroundColor: "#9e0806",
													marginTop: "100px"
												}}
												color="secondary"
											>
												<AdminIcon
													style={{
														height: "100px",
														width: "100px"
													}}
												/>
											</Button>
											<h1>Admins</h1>
											<h3 style={{ color: "#474747" }}>Add new admin account</h3>
										</div>
									</Grid>

									
								</Grid>
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

export default withStyles(styles)(DashboardPage);
