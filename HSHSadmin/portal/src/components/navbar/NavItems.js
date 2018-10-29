import React from "react";
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

	render() {
		const { icon, primary } = this.props;
		return (
			<li>
				<ListItem button component={this.renderLink}>
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
	to: PropTypes.string.isRequired
};

export const navActionItems = (
	<div>
		<ListItemLink1
			to="/dashboard"
			primary="Dashboard"
			icon={<DashboardIcon />}
		/>
		<ListItemLink1
			to="/volunteers"
			primary="Volunteers"
			icon={<RecentActorsIcon />}
		/>
		<ListItemLink1 to="/guests" primary="Guests" icon={<GroupIcon />} />
		<ListItemLink1
			to="interactions"
			primary="Interactions"
			icon={<DateIcon />}
		/>
		<ListItemLink1 to="/admin" primary="Admin" icon={<AdminIcon />} />
		<ListItemLink1 to="/reports" primary="Reports" icon={<ReportsIcon />} />
	</div>
);

export const navAccountItems = (
	<div>
		<ListItem button href="#">
			<ListItemIcon>
				<PhoneIcon />
			</ListItemIcon>
			<ListItemText primary="Contact" />
		</ListItem>
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
	</div>
);

// export default withRouter(navActionItems);
// export {navAccountItems};
