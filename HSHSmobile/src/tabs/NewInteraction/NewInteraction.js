/*
 *
 *
 *
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    Alert,
    Picker,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import {connect} from 'react-redux';
import {addNewGuest} from '../../redux/actions.js';
import FAB from 'react-native-fab'

import Icon from 'react-native-vector-icons/Ionicons';

import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import ModalDropdown from 'react-native-modal-dropdown';
// Redux functions
function mapStateToProps(state, ownProps) {
    return {
        //data: state.guest_info,
        //loading: state.loading
    };
}

function mapDispatchToProps(dispath, ownProps) {
    return {
        //addNewGuest: addNewGuest
    };
}

/*
 * NewGuest: props- none i think
 * Represents the complete view containing a form to input new guests
 * formInput is a dictionary containing information about the guest
 * For new form validation, add a [field]Error entry to the state and update
 * it in register() if the current formInput entry is not up to par.
 * TODO make it a scrollview
 */
class NewInteraction extends Component<{}> {
    constructor(props) {
        super(props);
        //this.formInput = {name: '', description: '', gender: '', hairColor: '',
                        //isTattooed: '', age: '', actionItems: [], interactions: []}
        //this.state = { nameError: '', genderError: '', tattooError: '',
                       //ageError: '',  hairColorError: ''}
    }

    render () {
        return (
          <View>
          <Text> new interaction </Text>
          </View>
        );
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewInteraction)
