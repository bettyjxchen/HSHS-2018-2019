import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
    FlatList,
    ActivityIndicator,
    Dimensions,
    Alert,
    NativeModules,
    LayoutAnimation,
} from 'react-native';
import { List, ListItem, SearchBar, Button, Icon } from "react-native-elements";
import firebase from "firebase";
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import { getGuests, getInteractions, getActionItems, getCompletedActionItems, getSupply, addSummary, getSummary } from '../../redux/actions.js';
import ActionItemList_module from '../../modules/ActionItemList_module';
import Lottery_module from '../../modules/Lottery_module';
import renderSeperator from "../../modules/UI/renderSeperator";
import Prompt from 'rn-prompt';
import dupNavFix from "../../dupNavFix";
import { getLotteryWinners, enterWinners } from '../../redux/actions.js';
import Popup from "../../modules/popups/popup";

const IonIcon = require('react-native-vector-icons/Ionicons');
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

function mapStateToProps(state, ownProps) {
    return {
        actionItems: state.actionItems,
        guests: state.guests,
        loading: state.loading,
        interactions: state.interactions,
        lotteryWinner: state.lotteryWinner,
        supplies: state.supplies,
        summaries: state.summaries,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        getGuests: getGuests,
        getInteractions: getInteractions,
        getActionItems: getActionItems,
        getCompletedActionItems: getCompletedActionItems,
        getSupply: getSupply,
        getSummary: getSummary,
    };
}

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.addOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.props.loading = true;
        this.state = {
            text: ""
        }
    };

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'logout') { // this is the same id field from the static navigatorButtons definition
                this.props.navigator.resetTo({
                    title: 'Login',
                    screen: 'Login', // unique ID registered with Navigation.registerScreen
                    // No pass props because new default
                    passProps: {
                    }, // Object that will be passed as props to the pushed screen (optional)

                    animated: true, // does the push have transition animation or does it happen immediately (optional)
                    animationType: 'fade', // ‘fade’ (for both) / ‘slide-horizontal’ (for android) does the push have different transition animation (optional)
                    backButtonHidden: true, // hide the back button altogether (optional)
                    navigatorStyle: {
                        navBarHidden: true,
                        tabBarHidden: true,
                        statusBarHidden: true
                    }, // override the navigator style for the pushed screen (optional)
                    navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
                });
                firebase.auth().signOut()
                    .then(() => {
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    };

    componentDidMount() {

    };

    //TODO: lotteryWinner isn't properly mapped to props fix please
    componentDidMount() {
        IonIcon.getImageSource('ios-log-out', 36).then((icon) => {
            this.props.navigator.setButtons({
                rightButtons: [
                    { id: 'logout', icon: icon },
                ]
            });
        });
        this.makeRemoteRequest();
        navigator.geolocation.watchPosition((pos) => {
            this.setState({
                curLat: pos.coords.latitude,
                curLong: pos.coords.longitude
            });
        }, (error) => {
            Alert.alert(error.message);
        }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 50 });

    };

    makeRemoteRequest = () => {
        this.props.getInteractions();
        this.props.getGuests();
        this.props.getActionItems();
        this.props.getCompletedActionItems();
        this.props.getSupply();
        this.props.getSummary();
    };

    componentWillUpdate(nextProps, nextState) {
    };

    handleLoadMore = () => {
        this.setState(
            {
                page: this.state.page + 1
            },
            () => {
                this.makeRemoteRequest();
            }
        );
    };

    renderMarkers = () => {
        var markers = [];
        if (this.props.actionItems) {
            for (var actionItemId in this.props.actionItems) {
                (function (id, self) {
                    let actionItem = self.props.actionItems[id];
                    let coordinate = { latitude: actionItem.locationCoord.lat, longitude: actionItem.locationCoord.lng };
                    markers.push(
                        <MapView.Marker
                            coordinate={coordinate}
                            title={actionItem.title}
                            description={actionItem.description}
                            key={id}
                            pinColor={actionItem.color}
                            onPress={() => { self.setSelectActionItem(id) }}
                            onDeselect={() => { self.setSelectActionItem(null) }}
                        />
                    )
                })(actionItemId, this)
            }
        }
        return markers;
    };

    setSelectActionItem = (id) => {
        this.setState({ selectedActionItem: id });
    }

    updateLotteryState = () => {
        return;
    }

    _showLotteryInputDialog() {
        this.setState({ promptVisible: true });
    }

    _renderSelectedActionItem() {
        if (this.state.selectedActionItem) {
            return (
                <ActionItemList_module
                    style={{ flex: 1 }}
                    actionItems={this.props.actionItems}
                    guests={this.props.guests}
                    navigator={this.props.navigator}
                    selectedActionItem={this.state.selectedActionItem}
                />
            );
        }

        return null;
    }

    // Submit the summary info
    _submitSummary = () => {
        if (this.state.text && this.state.text != "") {
            addSummary(this.state.text);
            this.setState({
                text: ""
            })
            this.props.getSummary();
        }
        else {
            setTimeout(function(){ Alert.alert('The summary cannot be empty');; }, 1000);

        
        }
    }

    _getSummary = () => {
        this.props.getSummary();
        this.summaryText = "";

        for (let entry of this.props.summaries) {
            this.summaryText += entry[0] + "\n" + entry[1] + "\n\n"
        }
    }

    // I'm not sure if this is the best way to have logical statements within renders, but it's not the worst way!
    render() {
        return (
            <View style={styles.buttonGroup}>
                <Button
                    buttonStyle = {styles.buttons}
                    title='Submit Summary'
                    onPress={() => {addSummary(this.state.text); this.Popup.show();}}
                />
                <Text>&nbsp;</Text> 
                <Button
                    buttonStyle = {styles.buttons}
                    title='View Summary'
                    onPress={() => {this._getSummary(); this.summaryPopup.show()}}
                />
                <Popup
                    title={"Submit Summary"}
                    onConfirm={() => {
                        this._submitSummary();
                    }}
                    onCancel={() => { }}
                    ref={(popup) => {
                        this.Popup = popup;
                    }}
                >
                    <TextInput
                        style={{ height: 50, fontSize: 15 }}
                        placeholder="Enter summary here!"
                        onChangeText={(text) => this.setState({ text })}
                        multiline={true}
                    />
                </Popup>
                <Popup
                    title={"Previous Summary"}
                    onConfirm={() => {}}
                    onCancel={() => {}}
                    ref={(popup) => {
                        this.summaryPopup = popup;
                    }}
                >
                    <Text>{this.summaryText}</Text>
                </Popup>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonGroup : {
        flex: 1, 
        alignContent: 'center', 
        alignItems: 'center', 
        justifyContent: "center", 
        paddingTop: 50, 
    },
    buttons : {
        borderRadius: 15,  
        backgroundColor: "#E74C3C",
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(dupNavFix(Dashboard));
