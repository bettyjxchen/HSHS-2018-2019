import React, {Component} from 'react';
import * as firebase from 'firebase';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    email: '',
    password: '',
    key: 'testuser123',
    error: null
}

class CreateUserAccountCard extends Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
    }

    submit = (event) => {
        const {
            email,
            password,
            key,
        } = this.state;

        let signUp = firebase.functions().httpsCallable("signUp");
        let authKey = firebase.functions().httpsCallable("authAccountKey");

        signUp({email: email, password: password})
            .then((res) => {return authKey({signupKey : key, uid : res.data})})
            .catch(err => {console.error(err);})
            .then((res) => console.log(res))
        event.preventDefault();
        this.setState(() => ({...INITIAL_STATE}));
        const message = "User " + email + " has been registered";
        alert(message);
    }

    render() {
        const {
            email,
            password,
        } = this.state;

        return (
            <Card style = {this.props.style}>
                <CardContent>
                    <TextField
                        style = {{
                            width: "100%"
                        }}
                        autoFocus
                        label="Email"
                        type="email"
                        value={email}
                        onChange={event => this.setState(byPropKey('email', event.target.value))}
                        placeholder="user@mail.com"/>
                    <br/>
                    <TextField
                        style = {{
                            width: "100%"
                        }}
                        label="Password"
                        type="password"
                        value={password}
                        onChange={event => this.setState(byPropKey('password', event.target.value))}
                        placeholder="password"/>
                    <br/>
                </CardContent>
                <CardActions>
                    <Button
                        label="SignIn"
                        variant="contained"
                        color="secondary"
                        onClick={this.submit}>
                        Create New User
                    </Button>
                </CardActions>
            </Card>
        );
    }

    componentWillUnmount() {
        if (this.statePromises)
            this.statePromises.forEach(p => p.cancel());
    }
}

export default CreateUserAccountCard;
export {CreateUserAccountCard};
