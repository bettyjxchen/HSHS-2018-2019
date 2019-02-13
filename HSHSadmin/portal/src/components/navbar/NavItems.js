/* eslint-disable */
import React from "react";
import * as firebase from "firebase";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsIcon from "@material-ui/icons/Settings";
import GroupIcon from "@material-ui/icons/Group";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import DateIcon from "@material-ui/icons/DateRange";
import HomeIcon from "@material-ui/icons/Home";
import ReportsIcon from "@material-ui/icons/Description";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import AdminIcon from "@material-ui/icons/PermIdentity";
import PhoneIcon from "@material-ui/icons/Phone";
import * as routes from "../../constants/routes";
import { withRouter } from "react-router-dom";
import MemoryRouter from "react-router/MemoryRouter";
import Route from "react-router/Route";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import NoSsr from "@material-ui/core/NoSsr";
import DashboardIcon from "@material-ui/icons/Dashboard";

class ListItemLink1 extends React.Component {
	renderLink = itemProps => <Link to={this.props.to} {...itemProps} />;

	onClickFunc = itemProps => {this.props.func}

	render() {
		const { icon, primary } = this.props;
		return (
			<li>
				<ListItem button component={this.renderLink} onClick= {() => {		if (this.props.func) {
			this.props.func();
		}}}>
					<ListItemIcon>{icon}</ListItemIcon>
					<ListItemText primary={primary} />
				</ListItem>
			</li>
		);
	}
}

ListItemLink1.propTypes = {
	icon: PropTypes.node.isRequired,
	primary: PropTypes.node.isRequired,
	to: PropTypes.string.isRequired,
	func: PropTypes.func
};

export const navActionItems = (
	<div>
		<ListItemLink1 to="/reports" primary="Reports" icon={<ReportsIcon />} />
		<ListItemLink1
			to="/volunteers"
			primary="Volunteers"
			icon={<RecentActorsIcon />}
		/>
		{/*<ListItemLink1 to="/guests" primary="Guests" icon={<GroupIcon />} />*/}
		<ListItemLink1
			to="/supply"
			primary="Supplies"
			icon={<DateIcon />}
		/>
		<ListItemLink1 to="/admin" primary="Admin" icon={<AdminIcon />} />
	</div>
);

export const navAccountItems = (
	<div>
		<ListItemLink1
			to="/logout"
			primary="Logout"
			icon={<LogoutIcon />}
			func = {() => firebase.auth().signOut()}
		/>
	</div>
);

// export default withRouter(navActionItems);
// export {navAccountItems};
