/* eslint-disable */
import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import * as firebase from "firebase";
import { Nav } from "./navbar/Nav";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import { Link } from "react-router-dom";

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

class GuestsPage extends Component {
  constructor(props) {
    super(props);
    let self = this;
    this.state = {
      user: false
    };
  }

  componentWillMount() {
      let self = this;
      firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            self.setState({user: true});
          } else {
              self.setState({user: false});
          }
      });
  }

  render() {
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
          <div>
            <Nav />
            <main>
              <h1>THIS IS GUEST PAGE</h1>
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
      );
    } else {
        return (
            <div>
                <p>Sorry, you don't have access to this site. Please contact an admin if you have any questions.</p>
                <Link to="/">Return to homepage</Link>
            </div>
        );

    }
  }

  componentWillUnmount() {
       if (this.statePromises)
           this.statePromises.forEach(p => p.cancel());
   }
}

export default withRouter(GuestsPage);
