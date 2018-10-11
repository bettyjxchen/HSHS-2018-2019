import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import SettingsIcon from "@material-ui/icons/Settings";
import GroupIcon from "@material-ui/icons/Group";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import DateIcon from "@material-ui/icons/DateRange";

const styles = theme => ({
	root: {
		width: "100%",
		maxWidth: 360
		// backgroundColor: theme.palette.background.paper
	}
});

const classes = theme => ({
	root: {
		width: "100%",
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper
	}
});

function NavList(props) {
	// const { classes } = props;
	var classes = styles();

	return (
		<div className={classes.root}>
			<List component="nav">
				<ListItem button href="#">
					<ListItemIcon>
						<GroupIcon />
					</ListItemIcon>
					<ListItemText primary="Volunteers" />
				</ListItem>
				<ListItem button href="#">
					<ListItemIcon>
						<DateIcon />
					</ListItemIcon>
					<ListItemText primary="Interactions" />
				</ListItem>
			</List>
			<Divider />
			<List component="nav">
				<ListItem button href="#">
					<ListItemIcon>
						<SettingsIcon />
					</ListItemIcon>
					<ListItemText primary="Settings" />
				</ListItem>
				<ListItem button href="#">
					<ListItemIcon>
						<LogoutIcon />
					</ListItemIcon>
					<ListItemText primary="Logout" />
				</ListItem>
			</List>
		</div>
	);
}

NavList.propTypes = {
	// classes: PropTypes.object.isRequired
	classes: PropTypes.object
};

// export default withStyles(styles)(NavList);
export { NavList };
