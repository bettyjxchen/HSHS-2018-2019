import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import * as firebase from "firebase";
import * as routes from "../constants/routes";
import { Nav } from "./navbar/Nav";
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
	state = {
		spacing: "40"
	};

	render() {
		const { classes } = this.props;
		const { spacing } = this.state;

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
											href="/volunteers"
											variant="fab"
											aria-label="Volunteers"
											className={styles.button}
											style={{
												height: "300px",
												width: "300px",
												backgroundColor: "#9e0806",
												marginTop: "100px"
											}}
											color="secondary"
										>
											<RecentActorsIcon
												style={{
													height: "200px",
													width: "200px"
												}}
											/>
										</Button>
										<h1>Volunteers</h1>
										<h3 style={{ color: "#474747" }}>
											Access volunteer portal
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
												height: "300px",
												width: "300px",
												backgroundColor: "#9e0806",
												marginTop: "100px"
											}}
											color="secondary"
										>
											<AdminIcon
												style={{
													height: "200px",
													width: "200px"
												}}
											/>
										</Button>
										<h1>Admin</h1>
										<h3 style={{ color: "#474747" }}>Access admin portal</h3>
									</div>
								</Grid>

								<Grid item style={{ padding: "40px" }}>
									<div style={{ textAlign: "center" }}>
										<Button
											href="/guests"
											variant="fab"
											aria-label="Add"
											className={styles.button}
											style={{
												height: "300px",
												width: "300px",
												backgroundColor: "#9e0806",
												marginTop: "100px"
											}}
											color="secondary"
										>
											<GroupIcon
												style={{
													height: "200px",
													width: "200px"
												}}
											/>
										</Button>
										<div>
											<h1>Guests</h1>
											<h3 style={{ color: "#474747" }}>Access guest portal</h3>
										</div>
									</div>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(DashboardPage);
