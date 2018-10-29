import React, { Component } from "react";
import PropTypes from "prop-types";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsIcon from "@material-ui/icons/Settings";
import GroupIcon from "@material-ui/icons/Group";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import DateIcon from "@material-ui/icons/DateRange";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import { navActionItems, navAccountItems } from "./NavItems";
import logo from "./logo.png";

const drawerWidth = 240;
const styles = theme => ({
	root: {
		flexGrow: 1,
		height: 440,
		zIndex: 1,
		overflow: "hidden",
		position: "relative",
		display: "flex"
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	drawerPaper: {
		position: "relative",
		width: drawerWidth
	},
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing.unit * 3,
		minWidth: 0 // So the Typography noWrap works
	},
	toolbar: theme.mixins.toolbar
});

class Nav extends Component {
	render() {
		// const { classes } = this.props;

		return (
			<div className={styles.root}>
				<AppBar
					position="fixed"
					className={styles.appBar}
					style={{ backgroundColor: "#CE0909" }}
				>
					<Toolbar>
						<Typography variant="h6" color="inherit" noWrap>
							Clipped drawer
						</Typography>
					</Toolbar>
				</AppBar>

				<Drawer
					variant="permanent"
					classes={{
						paper: styles.drawerPaper
					}}
				>
					<div className={styles.toolbar} />
					<div style={{ textAlign: "center" }}>
						<h3 style={{ marginBottom: 10, color: "#2d2d2d" }}>
							Harvard Square
						</h3>
						<h4 style={{ marginTop: 0, color: "#2d2d2d" }}>Homeless Shelter</h4>
						<img height="160" width="160" src={logo} />
					</div>
					<Divider style={{ marginTop: 20 }} />
					<List>{navActionItems}</List>
					<Divider />
					<List>{navAccountItems}</List>
				</Drawer>
			</div>
		);
	}
}

Nav.propTypes = {
	classes: PropTypes.object
};

export default withStyles(styles)(Nav);
export { Nav };
