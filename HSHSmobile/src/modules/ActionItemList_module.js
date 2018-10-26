import React, {Component} from 'react';
import {
    FlatList,
    View,
    Text
} from 'react-native';
import {List, ListItem, SearchBar} from "react-native-elements";
import {Icon} from 'react-native-elements'
import renderSeperator from "./UI/renderSeperator";
import renderLoader from "./UI/renderLoader";
import dupNavFix from "../dupNavFix";
import Swipeout from 'react-native-swipeout';

const oneDayInSeconds = 86400000;


// YOU GOTTA PASS THE NAVIGATOR AS A PROP FOR THIS TO WORK
// 'completed' prop passed to this module is used if the actionItems we're dealing with are completed
class ActionItemList_module extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: ''
        };

        this.Screen_ActionItem_view = this.Screen_ActionItem_view.bind(this);
    }

    Screen_ActionItem_view = (item) => {
        this.props.navigateTo({
            screen: 'ActionItem_view', // unique ID registered with Navigation.registerScreen
            passProps: {
                actionItemId: item.actionItemId,
                completed: this.props.completed // are the actionItems completed?
            }, // Object that will be passed as props to the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // ‘fade’ (for both) / ‘slide-horizontal’ (for android) does the push have different transition animation (optional)
            backButtonHidden: false, // hide the back button altogether (optional)
            navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
            navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
        });
    };

    formatGuestNames = (guestIds) => {
        if (!guestIds || guestIds.length == 0) {
            console.log("ERROR: formatGuestNames called despite no guestIds-- this should not happen");
            return ("No Tagged Guests");
        }
        var formatedString = "";
        for (let id of guestIds) {
            // Prevent app from crashing when an inavlid guest is included
            if (this.props.guests && this.props.guests[id])
                formatedString = formatedString + this.props.guests[id].name + ", ";
        }

        // get rid of that dumb last comma and space
        formatedString = formatedString.slice(0, -2);
        return formatedString
    };

    render() {
        var actionItems = getActionItems(this.props.actionItems, this.props.guestActionItemIds);

        if (this.props.selectedActionItem) {
            return (
                <View>
                    <FlatList
                        data={[this.props.actionItems[this.props.selectedActionItem]]}
                        renderItem={({item}) => this.renderListItem(item)}
                        keyExtractor={item => item.actionItemId}
                        ItemSeparatorComponent={() => {
                            return (renderSeperator())
                        }}
                        scrollEnabled={false}
                    />
                    {renderSeperator()}
                </View>
            );
        }

        return (
            <View style={{flex: 1}}>
                {!this.props.hideSearch && <SearchBar
                    containerStyle={{backgroundColor: 'transparent'}}
                    lightTheme
                    clearIcon={this.state.searchInput !== ''}
                    onChangeText={(str) => {
                        this.setState({searchInput: str.toLowerCase()})
                    }}
                    value={this.state.searchInput}
                    onClearText={() => this.setState({searchInput: ''})}
                    placeholder='Search (Ex. Restock closet)'
                />}

                {(!this.props.actionItems || this.props.actionItems.length <= 1) ?
                    (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: '#808080'}}>There are no action items</Text>
                    </View>) :
                    (<View style={{flex: 1}}>
                        <FlatList
                            data={getActionItems(actionItems).filter(item => item.title.toLowerCase().includes(this.state.searchInput))}
                            renderItem={({item}) => this.renderListItem(item)}
                            keyExtractor={item => item.actionItemId}
                            ItemSeparatorComponent={() => {
                                return (renderSeperator())
                            }}
                            ListHeaderComponent={this.renderHeader}
                            refreshing={this.props.refreshing}
                            onEndReached={this.handleLoadMore}
                            onEndReachedThreshold={50}
                        />
                    </View>)}
            </View>
        )
    }

    renderListItem(item) {
        let swipeoutBtns = this.props.completed ?
        [{
            text: 'To-Do!',
            backgroundColor: 'green',
            onPress: () => this.props.doneFunction(item.actionItemId)
        }] :
        [{
            text: 'Done!',
            backgroundColor: 'red',
            onPress: () => this.props.doneFunction(item.actionItemId)
        }];

        return (
            <Swipeout left={swipeoutBtns}>
                <View style={{backgroundColor: item.color}}>
                    <ListItem
                        title={item.title}
                        titleStyle={{marginLeft: 0}}
                        subtitle={
                            <View style={{flex: 1, flexDirection: 'row',}}>
                                <View style={{flex: 2, flexDirection: 'row'}}>
                                    <View style={{flex: 1}}>
                                        <Icon
                                            color='#3a4548'
                                            name='people-outline'/>
                                    </View>
                                    <View style={{flex: 3, justifyContent: 'center'}}>
                                        <Text
                                            style={item.guestIds ? {} : {fontStyle: 'italic'}}
                                            numberOfLines={1}>
                                            {item.guestIds ? this.formatGuestNames(item.guestIds) : "None"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{flex: 2, flexDirection: 'row'}}>
                                    <View style={{flex: 1}}>
                                        <Icon
                                            color={item.locationStr === "Shelter" ? "#770B16" : '#3a4548'}
                                            name={'location-on'}/>
                                    </View>
                                    <View style={{flex: 3, justifyContent: 'center'}}>
                                        <Text
                                            style={item.locationStr === "Shelter" ? {color: "#770B16"} : {}}
                                            numberOfLines={1}>
                                            {item.locationStr ? item.locationStr : "None"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        } // TODO: fix that without an extra space, the last character is cut off
                        subtitleStyle={{textAlign: 'right'}}
                        containerStyle={{borderBottomWidth: 0, marginLeft: 10, backgroundColor: "white"}}
                        onPress={() => this.Screen_ActionItem_view(item)}
                    />
                </View>
            </Swipeout>
        )
    }

    renderHeader = () => {
        return null;
    };

}

// TODO: populate guests, color and ensure that deleting guests removes from these action items.
function getActionItems(IdsToActionItems, guestActionItemIds) {
    var actionItems = [];
    if (guestActionItemIds) {
        for (let Id in guestActionItemIds) {

            var item = IdsToActionItems[(guestActionItemIds[Id])];
            actionItems.push({
                title: item.title,
                guestIds: item.guestIds,
                color: item.color ? item.color : "transparent",
                locationStr: item.locationStr,
                id: Id,
                actionItemId: item.actionItemId,
                shiftDate: item.shiftDate
            });
        }
    } else {
        for (var Id in IdsToActionItems) {
            var item = IdsToActionItems[Id];
            actionItems.push(parseActionItem(item, Id));
        }
    }
    return actionItems;
}

parseActionItem = (item, Id) => {
    return ({
        title: item.title,
        guestIds: item.guestIds,
        color: item.color ? item.color : "transparent",
        locationStr: item.locationStr,
        id: Id,
        actionItemId: item.actionItemId,
        shiftDate: item.shiftDate
    });
}


export default dupNavFix(ActionItemList_module);
