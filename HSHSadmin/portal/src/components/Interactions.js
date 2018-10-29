import React, { Component } from "react";
import * as firebase from "firebase";
import { CheckListCard } from "./cards/CheckListCard";
import ListCard from "./cards/ListCard";
import { Nav } from "./navbar/Nav";
import Button from "@material-ui/core/Button";
import SimpleList from "./cards/SimpleList";

class InteractionsPage extends Component {
  constructor(props) {
    super(props);
    let self = this;
  }

  render() {
    /*return (
            <div >
              <ListCard
                  label = "Interactions"
                  dataRef = {firebase.database().ref("/interactions")}
                  hasTitle = {false}
                  style = {{flex: 1, margin: 10}}/>
            </div>
		);*/

    var user = firebase.auth().currentUser;
    if (user) {
      return (
        <div
          style={{
            backgroundColor: "#fff",
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
              <SimpleList
                dataRef={firebase.database().ref("/interactions")}
                hasTitle={false}
              />
            </main>
          </div>
        </div>
      );
    } else {
      alert(
        "Sorry, you don't have access to this site. \nPlease contact an admin if you have any questions"
      );
    }
  }

  componentWillUnmount() {
    if (this.statePromises) this.statePromises.forEach(p => p.cancel());
  }
}

export default InteractionsPage;
