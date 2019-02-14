import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    FlatList,
    TouchableHighlight,
    Linking,
    Image,
    ImageBackground,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import {connect} from 'react-redux';
import renderLoader from "../../modules/UI/renderLoader";
import dupNavFix from '../../dupNavFix';
import { CheckBox } from 'react-native-elements'

const Icon = require('react-native-vector-icons/Ionicons');

var regularItems = [
  ["PB&J", true],
  ["Tuna Sandwich", true],
  ["Bottled Waters", true],
  ["V8", true],
  ["Juice", true],
  ["Granola Bars", true],
  ["Fruit Cups", true],
  ["Fresh Fruit", true],
  ["Socks", true],
  ["Handwarmers", true],
  ["Gloves", true],
  ["Blankets", true],
  ["Warm Clothing", true],
  ["Toiletry Kits", true],
  ["Female Hygiene Kits", true]
];

class Supplies extends Component {
  constructor(props) {
    super(props);
    this.addedItems = [];
    this.handleChange = this.handleChange.bind(this);
    this.chip = regularItems;
    this.state = {
      spacing: "40"
    };


  }

  componentDidMount() {
    this.setState({
      value: ""
    });

    this.today = this.generateDate();
    this.checkedItems = new Set();
    
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  clearRegular = () => {
    for (let i = 0; i < regularItems.length; i++) {
      regularItems[i][1] = false;
    }
  }

  itemRegularIndex = (item) => {
    for (let i = 0; i < regularItems.length; i++) {
      if (regularItems[i][0] === item) {
        return i;
      }
    }

    return -1;
  }

  /*checkEntryExist = date => {
    dateEntry.child(date).once("value", snapshot => {
      if (snapshot.val() !== null) {

        this.clearRegular();
        for (let item in snapshot.val().Supply) {
          this.checkedItems.add(item);

          let index = this.itemRegularIndex(item);

          if (index === -1) { // doesn't exist in the list
            regularItems.push([item, true]);
          } else {
            regularItems[index][1] = true;
          }
        }

        alert("You have already entered supplies");

        this.chip = regularItems;
        this.forceUpdate();
      } else {
        this.chip = regularItems;

        for (let item of regularItems) {
          this.checkedItems.add(item[0]);
        }

        alert("New Supply");

        this.forceUpdate();

      }
    });
  };*/

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

    today = yyyy + "-" + mm + "-" + dd;

    return today;
  };

  handleChipClick = (item) => {
    let index = regularItems.indexOf(item);
    regularItems[index][1] = !regularItems[index][1];

    if (this.checkedItems.has(item[0])) {
      this.checkedItems.delete(item[0]);
    } else {
      this.checkedItems.add(item[0]);
    }

    this.forceUpdate();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit = () => {
    /*let tempObject = {};

    for (const checkbox of this.checkedItems) {
      tempObject[checkbox] = 0;
    }
    let date = this.generateDate();

    dateEntry.update({
      [date]: {
        Supply: tempObject,
        Headcount: {
          totalPeople: 0,
          peopleAboutResource: 0,
          bedsCalled: 0,
          youth: 0
        }
      }
    });*/

    alert("Data entry saved successfully! Have a great shift");
  }

  handleAddItem = () => {
    if (!this.state.itemName) {
      alert("Input field is empty");
      return;
    } else {
      if (this.itemRegularIndex(this.state.itemName) === -1) {
        regularItems.push([this.state.itemName, true]);
        this.checkedItems.add(this.state.itemName);
        this.forceUpdate();
      } else {
        alert('This item already exist');
      }
    }
  }

  render() {
    const { spacing } = this.state;
    var listChips = this.chip.map((item) => {
      return(<CheckBox title={item[0]} checked={this.state.checked}/>); 
    })

    return listChips;
  }
}

/*class Supplies extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.addOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.regularItems = [
            ["PB&J", true],
            ["Tuna Sandwich", true],
            ["Bottled Waters", true],
            ["V8", true],
            ["Juice", true],
            ["Granola Bars", true],
            ["Fruit Cups", true],
            ["Fresh Fruit", true],
            ["Socks", true],
            ["Handwarmers", true],
            ["Gloves", true],
            ["Blankets", true],
            ["Warm Clothing", true],
            ["Toiletry Kits", true],
            ["Female Hygiene Kits", true]
        ];
    }

    componentDidMount() {
        
    };

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
            if (event.id == 'searchResources') { // this is the same id field from the static navigatorButtons definition
                this.screenResourcesSearch("");
            }
        }
    };

    screenResourcesSearch = (catString) => {
        this.props.navigateTo({
            title : catString,
            screen : "Resources_search",
            passProps : {
                linkData : this.linkData,
                categories : this.categoriesMain,
                searchInit : catString,
                catIcons : this.catIcons
            },
            animated : true,
            animationType : 'slide-horizontal',
            backButtonHidden : false,
            navigatorStyle : {},
            navigatorButtons : {},
        });
    };

    goToURL(url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log('Don\'t know how to open URI: ' + url);
        }
      });
    }

    renderHeader = () => {
        return (
            <View style = {styles.headerContainer}>
                
            </View>
        );
    };

    renderButton = (category) => {
        return(
            <View style = {styles.buttonContainer}>
                <TouchableHighlight
                    style = {styles.button}
                    onPress = {() => (this.screenResourcesSearch(category))}
                    underlayColor = {"rgba(119, 11, 22, .75)"}
                >
                    <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style = {{textAlign: "center", fontSize: 10}}>
                            {category.split(" ").join("\n")}
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    };

    renderButtons = () => {
        return(
            <View style = {{flexDirection: "column", alignItems : "center", height: "65%", marginTop: "10%"}}>
                <View style = {styles.buttonsContainer}>
                    {this.renderButton(this.categoriesMain[0])}
                    {this.renderButton(this.categoriesMain[1])}
                    {this.renderButton(this.categoriesMain[2])}
                    {this.renderButton(this.categoriesMain[3])}
                    {this.renderButton(this.categoriesMain[4])}
                    {this.renderButton(this.categoriesMain[5])}
                    {this.renderButton(this.categoriesMain[6])}
                    {this.renderButton(this.categoriesMain[7])}
                    {this.renderButton(this.categoriesMain[8])}
                </View>
            </View>
        );
    }

    render(){
        return(
            <View style={{backgroundColor: '#F7F7F7'}}>
                {this.renderHeader()}
                {this.renderButtons()}
            </View>
        );
    }
}

//{this.categoriesMain.map((elem) => {this.renderButton(elem)})}

const styles = StyleSheet.create({
    headerContainer: {
        height: "35%",
        //height : 300,
    },

    headerImage: {
        flex : 7,
        width : "100%",
        height : "100%",
        justifyContent: "flex-end",
        alignItems: "center",
    },

    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        //color: '#000000',
        color: "#FFF",
        marginTop: 5,
        marginBottom: 5
    },

    address: {
        fontSize: 16,
        textAlign: 'left',
        //color: '#000000',
        color: "#FFF",
        margin: 3,
    },

    lastAddress: {
        fontSize: 16,
        textAlign: 'left',
        //color: '#000000',
        color: "#FFF",
        margin: 3,
        flex: 1,
    },

    phoneNum: {
      fontSize: 16,
      textAlign: 'right',
      color: '#0dd5fc',
      margin: 3,
      marginRight: "10%",
      flex: 1,
    },

    buttonsContainer: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap"
    },

    buttonContainer: {
        //flex: 1,
        width: "27%",
        height: "20%",
        marginTop: "2%",
        marginBottom: "2%",
        marginLeft: "2%",
        marginRight: "2%",
        borderStyle: "solid",
        backgroundColor: "white"
    },

    button: {
        flex: 1,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 10,
    }
});*/

export default dupNavFix(Supplies)
