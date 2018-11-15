/* eslint-disable */
import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import * as firebase from "firebase";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Nav from "./navbar/Nav";
import { CreateUserAccountCard } from "./cards/CreateUserAccountCard";
import { Link } from "react-router-dom";

class VolunteersPage extends Component {
	constructor(props) {
		super(props);
		let self = this;
		this.state = {
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

	render(history) {
		var user = this.state.user;
		if (user) {
			return (
				<div
					style={{
						backgroundColor: "#dce0e2",
						height: "100%",
						width: "100%",
						flexDirection: "row",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-evenly",
						margin: "auto",
						flexWrap: "wrap"
					}}
				>
					<div
						style={{
							height: "100%",
							width: "100%",
							flexDirection: "column",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							margin: "auto",
							//backgroundImage: `url(${Background})`,
							backgroundSize: "cover"
							//"url(" + { Background } + ")"
							//margin: '10% auto',
						}}
					>
						<CreateUserAccountCard history={history} />
						<div>
							<Nav />
							<main>
								<p>Email must be valid </p>
								Password must be at least 6 characters long
								<p />
								<Button
									color={"secondary"}
									size={"large"}
									full-width={"true"}
									href={"/dashboard"}
									variant={"outlined"}
								>
									Back to Dashboard
								</Button>
							</main>
						</div>
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

export default withRouter(VolunteersPage);
