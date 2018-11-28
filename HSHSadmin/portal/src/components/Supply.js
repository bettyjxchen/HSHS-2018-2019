// Author: Phil Wang
// TODO: Style sheet
// TODO: Clear input box once the user clicks add supply
// TODO: Add code to support modify

import React from "react";
import { withRouter } from "react-router-dom";
import * as firebase from "firebase";
import Checkbox from "./CheckboxComponent";

const rootRef = firebase.database().ref();
const dateEntry = rootRef.child("dateEntry");
var regularItems = ["PB&J", "Tuna Sandwich", "Bottled Waters"];

class SupplyPage extends React.Component {
  constructor(props) {
    super(props);
    this.addedItems = [];
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      value: ""
    });

    this.today = this.generateDate();
    this.checkedItems = new Set();
    this.checkEntryExist(this.today);

    console.log(this.generateDate());
    console.log(firebase.database().ref("/interactions"));
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  toggleCheckbox = label => {
    if (this.checkedItems.has(label)) {
      this.checkedItems.delete(label);
    } else {
      this.checkedItems.add(label);
    }
  };

  checkAllBoxes = label => {
    if (this.checkedItems.has(label)) {
    } else {
      this.checkedItems.add(label);
    }
  };

  createCheckbox = label => (
    // <Checkbox
    //   label={label}
    //   checked
    //   handleCheckboxChange={this.toggleCheckbox}
    //   key={label}
    // />
    <input
      type="checkbox"
      name={label}
      key={label}
      handleCheckboxChange={this.toggleCheckbox}
      checked
    />
  );

  createCheckboxes = () => regularItems.map(this.createCheckbox);

  createAddedBoxes = () => this.addedItems.map(this.createCheckbox);

  checkEntryExist = date => {
    dateEntry.child(date).once("value", snapshot => {
      if (snapshot.val() !== null) {
        for (var item in snapshot.val().Supply) {
          if (regularItems.includes(item)) {
            this.checkedItems.add(item);
          } else {
            console.log("item is" + item);
            this.checkedItems.add(item);
            this.addedItems.push(item);
          }
        }
        console.log(this.checkedItems);
        this.checkedItems.forEach(this.checkAllBoxes);

        this.forceUpdate();
      } else {
        console.log("New Supply");
      }
    });
  };

  // Generate date of the day
  // Will be used as keys
  generateDate = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    today = mm + "-" + dd + "-" + yyyy;

    return today;
  };

  handleAddItem = () => {
    this.addedItems.push(this.state.value);
    this.checkedItems.add(this.state.value);
    this.forceUpdate();
  };

  handleSubmit = () => {
    let tempObject = {};

    for (const checkbox of this.checkedItems) {
      tempObject[checkbox] = 0;
    }

    dateEntry.update({
      [this.today]: {
        Supply: tempObject,
        Headcount: {
          totalPeople: 0,
          peopleAboutResource: 0,
          bedsCalled: 0,
          youth: 0
        }
      }
    });

    alert("Data entry saved successfully! Have a great shift");
  };

  handleFormSubmit = formSubmitEvent => {
    formSubmitEvent.preventDefault();
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <form onSubmit={this.handleFormSubmit}>
              {this.createCheckboxes()}
              {this.createAddedBoxes()}
              <label>
                New Item:
                <input
                  type="text"
                  name="newItem"
                  id="inputField"
                  onChange={this.handleChange}
                />
              </label>
              <button
                className="btn btn-default"
                type="add"
                onClick={() => {
                  this.handleAddItem();
                  document.getElementById("inputField").value = "";
                }}
              >
                Add Supply
              </button>

              <div>
                <button
                  className="btn btn-default"
                  type="submit"
                  onClick={() => this.handleSubmit()}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SupplyPage);
