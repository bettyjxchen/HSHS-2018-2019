import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    TextInput,
    ScrollView
} from 'react-native';
import { Button, Icon, List, ListItem, SearchBar, CheckBox } from "react-native-elements";
import { connect } from 'react-redux';
import ChooseLocation from '../../modules/popups/ChooseLocation';
import firebase from 'firebase';
import TagGuestPopup from "../../modules/popups/TagGuestPopup"
import renderLoader from "../../modules/UI/renderLoader";
import renderSeperator from '../../modules/UI/renderSeperator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { addInteractionItem, getActionItems, getSupply, addUsage } from "../../redux/actions";
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import Counter from '../../modules/Counter';

import Prompt from 'rn-prompt';

const HEADCOUNT_DIC = {
    "E-Beds Called": "bedsCalled",
    "Spoke Resources": "peopleAboutResource",
    "Total Guests": "totalPeople",
    "Youth": "youth"
}


function mapStateToProps(state, ownProps) {
    var guests = guestObjectToArray(state.guests, state.interactions);
    return {
        guests: guests,
        item: null, //state.actionItems[ownProps.id],
        loading: state.loading,
        supplies: state.supplies,
        addInteractionSuccess: state.addNewInteractionSuccess ? state.addNewInteractionSuccess : false,
    };
}

function mapDispatchToProps(dispath, ownProps) {
    return {
        addInteractionItem: addInteractionItem,
        getActionItems: getActionItems,
        getSupply: getSupply,
    };
}

function guestObjectToArray(IdsToGuests, IdsToInteractions) {
    var guestList = [];
    for (var Id in IdsToGuests) {
        guestList.push({
            "Id": Id,
            "name": IdsToGuests[Id].name,
            "age": IdsToGuests[Id].age,
            "gender": IdsToGuests[Id].gender
        });
    }
    return guestList;
}

function getInitialState(supplyList) {
    let tempArray = [];
    if (supplyList) {
        for (let i = 0; i < supplyList.length; i++) {
            tempArray.push({ name: supplyList[i], count: 0, id: i })
        }
    }
    return ({
        promptVisible: false,
        taggedGuests: [],
        locationCoord: {
            latitude: 42.3717,
            longitude: -71.1199,
        },
        locationStr: "Shelter",
        date: Moment().format('YYYY/MM/DD'),
        interactionTimeStamp: Moment().format('YYYY/MM/DD'),
        description: "",
        items: tempArray,
        addingInteraction: false,
        headcount: [
            {name: "Total Guests", count: 0, id: 0},
            {name: "Spoke Resources", count: 0, id: 1},
            {name: "E-Beds Called", count: 0, id: 2},
            {name: "Youth", count: 0, id: 3}
        ]
    })
}

class Interaction_new extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.addOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = getInitialState();
    };

    componentWillReceiveProps(props) {
        if (this.state.addingInteraction) {
            if (props.addInteractionSuccess) {
                this._reset();
            }
        }
        if (props.supplies && props.supplies !== 0) {
            this.setState(getInitialState(props.supplies));
        } else {
            Alert.alert("You have not yet added supplies");
        }
    }

    componentDidMount() {
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    title: 'Save', // for a textual button, provide the button title (label)
                    id: 'save_interaction', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
                    disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                    showAsAction: 'ifRoom', // optional, Android only. Control how the button is displayed in the Toolbar.
                    buttonFontSize: 18, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                }
            ]
        });
    };

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'save_interaction') { // this is the same id field from the static navigatorButtons definition
                // Don't allow empty fields

                // TODO: Not mendatory anymore 
                // if (this.state.taggedGuests.length === 0) {
                //     Alert.alert("Interaction must have a tagged guest.")
                //     return;
                // } else if (this.state.description == "") {
                //     Alert.alert("Description cannot be empty. Please detail your interaction.")
                //     return;
                // }

                this._save();;
            }
        }
    };

    _save = () => {
        this.setState({ addingInteraction: true });

        let saveObj = {Supply: {}, Headcount: {}};
        let tempSupply = {};
        let tempHeadcount = {};

        for (let supply of this.state.items) {
            tempSupply[supply.name] = supply.count
        }

        for (let headcount of this.state.headcount) {
            tempHeadcount[HEADCOUNT_DIC[headcount.name]] = headcount.count
        }

        saveObj.Supply = tempSupply;
        saveObj.Headcount = tempHeadcount;

        addUsage(saveObj);

        addInteractionItem(this.state.interactionTimeStamp,
            this.state.date, this.state.locationCoord,
            this.state.locationStr, this.state.description, this.state.taggedGuests,
            "[Volunteer ID: See Interaction_new.js]", this.state.items);
    }

    _setTaggedGuests = (guests) => {
        this.setState({
            taggedGuests: guests
        });
    }

    _renderCounter = (itemId, type) => {
        let renderItems = type === "headcount" ? this.state.headcount : this.state.items;

        if (!(itemId in renderItems)) {
            return (
                <View style={{ flex: 1 }}>
                    {}
                </View>
            );
        }
        var self = this;
        return (
            <View style={{ flex: 1 }}>
                <Counter
                    itemName={renderItems[itemId].name}
                    count={0}
                    onValueChange={(val) => { self._setItem(itemId, val, type) }}
                />
            </View>
        )
    };

    _setItem = (itemId, count, type) => {
        if (type !== "headcount") {
            let items = this.state.items;
            items[itemId].count = count;
            this.setState({ items: items });
        } else {
            let items = this.state.headcount;
            items[itemId].count = count;
            this.setState({ headcount: items });
        }
    }

    _renderItems = () => {
        var views = [];
        for (var i = 0; i < this.state.items.length; i += 3) {
            views[i] =
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', zIndex: 0 }}>
                    {this._renderCounter(i)}
                    {this._renderCounter(i + 1)}
                    {this._renderCounter(i + 2)}
                </View>
            views[i].key;
        }
        return (views);
    }

    _renderHeadcounts = () => {
        var views = [];
        for (var i = 0; i < this.state.headcount.length; i += 2) {
            views[i] =
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', zIndex: 0 }}>
                    {this._renderCounter(i, "headcount")}
                    {this._renderCounter(i + 1, "headcount")}
                </View>
            views[i].key;
        }
        return (views);
    }

    addItem = (value) => {
        var items = this.state.items;
        for (var i = 0; i < items.length; i++) {
            // item already in list
            if (items[i].name.toLowerCase() == value.toLowerCase()) {
                return false;
            }
        }

        var new_item = {
            name: value,
            id: items.length,
            count: 0,
        }

        items.push(new_item);
        return true;
    }

    _reset = () => {
        this.setState(getInitialState(this.props.supplies));
    }

    render() {
        if (this.state.addingInteraction) {
            return (
                <View style={styles.container}>
                    {renderLoader()}
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <ScrollView style={{ width: "100%" }}>

                    <View style={{ marginTop: '5%', backgroundColor: '#F7f7f7' }}>
                        <ChooseLocation
                            onChangeLocation={(locationStr, locationCoord) =>
                                this.setState({
                                    locationStr: locationStr,
                                    locationCoord: locationCoord,
                                })}
                            locationStr={this.props.locationStr}
                            locationCoord={this.props.locationCoord}
                        />
                    </View>

                    <View style={styles.back}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 0 }}>
                        </View>
                        {this._renderHeadcounts()}
                        {renderSeperator()}
                        <TextInput
                            editable={true}
                            placeholder="Description"
                            value={this.state.description}
                            style={styles.description}
                            multiline={true}
                            textAlignVertical='top'
                            onChangeText={(description) => { this.setState({ description: description }) }}
                        />
                        {renderSeperator()}
                        {this._renderItems()}
                        <Button
                            title="Add Another Item"
                            onPress={() => { this.setState({ promptVisible: true }) }}
                            backgroundColor='#3a4548'
                            style={{ marginTop: '3%', marginBottom: '3%' }}
                        >
                        </Button>
                    </View>
                </ScrollView>
                <TagGuestPopup
                    ref={(dialog) => {
                        this.tagGuestDialog = dialog;
                    }}
                    initialGuests={this.state.taggedGuests}
                    guests={this.props.guests}
                    loading={this.props.loading}
                    onConfirm={this._setTaggedGuests}
                />
                <Prompt
                    title="Name your item"
                    placeholder=""
                    visible={this.state.promptVisible}
                    onCancel={() => this.setState({ promptVisible: false })}
                    onSubmit={(value) => {
                        let success = this.addItem(value);
                        this.setState({ promptVisible: false });
                    }}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    back: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        alignSelf: "stretch"
    },
    icon: {
        //paddingRight: 10,
        paddingLeft: 10,
        flex: 0.25
    },
    row: {
        flexDirection: "row",
        paddingTop: 5,
        paddingLeft: 20
    },
    daterow: {
        flexDirection: "row",
        paddingTop: 5,
        paddingLeft: 18
    },
    add: {
        paddingLeft: 2,
        color: '#0645AD',
        textDecorationLine: 'underline'
    },
    dateadd: {
        color: '#0645AD',
        textDecorationLine: 'underline'
    },
    deleteButtonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 4,
        margin: 10,
        paddingHorizontal: 60,
        paddingVertical: 15,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    description: {
        borderWidth: 0.5,
        marginTop: 15,
        marginLeft: '5%',
        marginRight: '5%',
        borderRadius: 5,
        height: 100,
        padding: 5,
        fontSize: 15,
        marginBottom: 15,
        borderColor: "#3a4548",
        backgroundColor: "white"
    },
    button: {
        backgroundColor: "lightblue",
        height: 25,
        margin: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    disabled: {
        opacity: 0.3
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Interaction_new);



{/* <View style={{ flex: 0.5, flexDirection: 'row' }}>
                                <View style={styles.icon}>
                                    <Icon
                                        raised
                                        color='#770B16'
                                        name='person-outline'
                                        size={16}
                                        onPress={() => {
                                            this.tagGuestDialog.show();
                                        }}
                                    />
                                </View>
                                <View style={{ flex: 1, paddingLeft: 15, flexDirection: 'row' }}>
                                    <Text numberOfLines={1} style={{ textAlign: 'center', alignSelf: 'center', color: '#3a4548' }}>{this.state.taggedGuests.length + " Tagged Guests"}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 0.5, flexDirection: 'row' }}>
                                <View style={styles.icon}>
                                    <DatePicker
                                        date={this.state.date}
                                        mode="date"
                                        placeholder="select date"
                                        format="YYYY-MM-DD"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        hideText
                                        iconComponent={<Icon
                                            raised
                                            color='#770B16'
                                            name='timer'
                                            size={16}
                                        />}
                                        customStyles={{
                                            dateTouchBody: {
                                                width: 50
                                            }
                                        }}
                                        onDateChange={(date) => { this.setState({ date: date }) }}
                                    />
                                </View>
                                <View style={{ flex: 1, paddingLeft: 15, flexDirection: 'row' }}>
                                    <Text numberOfLines={1} style={{ textAlign: 'center', alignSelf: 'center', color: '#3a4548' }}>Date: {this.state.date}</Text>

                                </View>
                            </View> */}