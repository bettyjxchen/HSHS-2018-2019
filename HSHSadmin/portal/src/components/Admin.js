import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import * as firebase from "firebase";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Nav } from "./navbar/Nav";

import { CreateAdminAccountCard } from "./cards/CreateAdminAccountCard";

class AdminPage extends Component {
  constructor(props) {
    super(props);
    let self = this;
  }

  render(history) {
    var user = firebase.auth().currentUser;
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
            <CreateAdminAccountCard history={history} />
            <div>
              <Nav />
              <main>
                <p>Email must be valid </p>
                Password must be at least 6 characters long
                <h1>THIS IS ADMIN PAGE</h1>
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
      alert(
        "Sorry, you don't have access to this site. \nPlease contact an admin if you have any questions"
      );
    }
  }
}

export default withRouter(AdminPage);
