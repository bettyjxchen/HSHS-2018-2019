/* eslint-disable */
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import * as firebase from "firebase";
import { CheckListCard } from "./cards/CheckListCard";
import ListCard from "./cards/ListCard";
import { Nav } from "./navbar/Nav";
import Button from "@material-ui/core/Button";
import SimpleList from "./cards/SimpleList";
import { Link } from "react-router-dom";

class InteractionsPage extends Component {
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
            marginTop: "5%",
          }}
        >
          <div>
            <Nav />
            <main>
              <SimpleList
                dataRef={firebase.database().ref("/interactions")}
                hasTitle={false}
              />
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
    if (this.statePromises) this.statePromises.forEach(p => p.cancel());
  }
}

export default InteractionsPage;
