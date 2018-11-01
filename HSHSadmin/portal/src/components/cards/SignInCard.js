import React, { Component } from "react";
import * as firebase from "firebase";
import { auth } from "../../firebase";
import * as routes from "../../constants/routes";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignInCard extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  submit = event => {
    const { email, password } = this.state;

    const { history } = this.props;

    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
      })

      .then(() => {
        firebase
          .auth()
          .currentUser.getIdTokenResult()
          .then(idTokenResult => {
            // Confirm the user is an Admin.
            if (!!idTokenResult.claims.admin) {
              // Show admin UI.
              console.log("isadmin");
              this.setState(() => ({ ...INITIAL_STATE }));
              history.push(routes.DASHBOARD);
              //showAdminUI();
            } else {
              alert(
                "Sorry, you don't have access to this site. \nPlease contact an admin if you have any questions"
              );
              // Show regular user UI.
              console.log("isuser");
              //showRegularUI();
            }
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        alert('Invalid Credentials')
      });

    event.preventDefault();
  };

  render() {
    const { email, password } = this.state;

    return (
      //<Card style={this.props.style}>
      <Card
        style={{
          backgroundColor: "transparent",
          shadowColor: "transparent",
          width: "25%",
          height: "48",
          //used to be 30%
          outline: "none",
          border: "none",
          borderRadius: 0,
          boxShadow: "none",
          position: "relative"
        }}
      >
        <CardContent>
          <form onSubmit={this.submit}>
            <TextField
              style={{
                width: "100%",
                backgroundColor: "white",
                marginBottom: "0.5%"
              }}
              autoFocus
              label="Email"
              type="email"
              value={email}
              onChange={event =>
                this.setState(byPropKey("email", event.target.value))
              }
            />
            <br />
            <TextField
              style={{
                width: "100%",
                backgroundColor: "white",
                marginBottom: "8%"
              }}
              label="Password"
              type="password"
              value={password}
              onChange={event =>
                this.setState(byPropKey("password", event.target.value))
              }
            />
            <br />
            <br />
            <Button
              style={{
                alignItems: "center",
                width: "100%",
                backgroundColor: "red",
                height: "4%"
              }}
              label="SignIn"
              type="submit"
              variant="contained"
              color="secondary"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  componentWillUnmount() {
    if (this.statePromises) this.statePromises.forEach(p => p.cancel());
  }
}

export default SignInCard;
export { SignInCard };
