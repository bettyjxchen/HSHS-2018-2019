/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = {
	card: {
		maxWidth: 345
	},
	media: {
		height: 140
	}
};

function DashboardReport(props) {
	// const { classes } = props;
	return (
		<div style={{ display: "inline" }}>
			<Card className={styles.card}>
				<CardActionArea>
					<CardMedia
						className={styles.media}
						image="../../css/images/dashboard.jpg"
					/>
					<CardContent>
						<Typography
							gutterBottom
							variant="h5"
							component="h1"
							style={{ fontSize: "50px", color: "#7e7676" }}
						>
							255 VOLUNTEERS
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		</div>
	);
}

DashboardReport.propTypes = {
	// classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DashboardReport);
export { DashboardReport };
