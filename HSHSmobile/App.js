import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {store} from './src/redux/store.js';
import Login from './src/Login';
import Signup from './src/Signup';

export default () => {
    return new App()
};

class App {
    constructor() {
        this.startApp();
    }

    startApp() {
        // this will start our app
        console.log(Navigation);
        Navigation.registerComponent('Login', () => Login, store, Provider);
        Navigation.registerComponent('Signup', () => Signup);

        Navigation.startSingleScreenApp({
            screen: {
                screen: 'Login',
                navigatorStyle: {navBarHidden: true},
            },
        });
    }
}
