/* eslint-disable */
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import React, {Component} from 'react';
import Card, {CardContent, CardActions} from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import * as firebase from 'firebase';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    maxWidth: 360,
    backgroundColor: 'white',
  },
});

class SimpleList extends React.Component {

    constructor(props) {
      super(props);
      this.state = { listContent: {}, open: false };
    }

    componentDidMount() {
      let self = this;
      let dataRef = this.props.dataRef;
      dataRef.on('value', (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            var newContent = this.state.listContent;
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            var resources = Array.from(childData.resources);
            var new_resources = [];
            var resource_text = '';
            resources.forEach(element => {
                if (element.count !== 0) {
                    new_resources.push(element);
                }
            });
            new_resources.forEach(element => {
                if (new_resources.indexOf(element) != (new_resources.length - 1))
                    resource_text += element.count.toString() + ' ' + element.name + ', ';
                else
                    resource_text += element.count.toString() + ' ' + element.name + '.';
            });
            if (childData.guestIds != null) {
                firebase.database().ref("/guests/" + childData.guestIds[0]).once('value').then(function(guest_snapshot) {
                    var guest = guest_snapshot.val();
                    newContent[childKey] = {interaction: childData, guest: guest, resources: resource_text};
                    self.setState({
                      listContent: newContent
                    });
                });
            } else {
                var guest = {name: "No guest tagged"};
                newContent[childKey] = {interaction: childData, guest: guest, resources: resource_text};
            }
          });
      });
    }

  handleToggle = (key, value) => () => {
      const message = "Description: " + value.interaction.description
                    + "\nCreated on: " + value.interaction.creationTimestamp
                    + "\nLocation: " + value.interaction.locationStr
                    + "\nGuest: " + value.guest.name
                    + "\nResources given out: " + value.resources;
      alert(message);
  };

  render() {
    const hasTitle = this.props.hasTitle;
    const listContent = this.state.listContent;
    var key_array = [];
    var value_array = [];
    for (var key in listContent) {
        key_array.push(key);
        value_array.push(listContent[key]);
    }

    if (hasTitle) {
        return (
          <div>
            <List>
              {value_array.map(value => (
                <ListItem
                  key={key_array[value_array.indexOf(value)]}
                  role={undefined}
                  dense
                  button
                  onClick={this.handleToggle}
                >
                  <ListItemText primary={`${value.interaction.title}`}
                                secondary={`${value.interaction.description} | ${value.interaction.creationTimestamp} | ${value.interaction.locationStr} | ${value.guest.name} | ${value.resources}`} />
                </ListItem>
              ))}
            </List>
          </div>
        );
    } else {
        return (
          <div style={{
            marginLeft: "20%"
          }}>
            <List>
              {value_array.map(value => (
                <ListItem
                  key={key_array[value_array.indexOf(value)]}
                  role={undefined}
                  dense
                  button
                  onClick={this.handleToggle(key_array[value_array.indexOf(value)], value)}
                >
                <ListItemText primary={`${value.interaction.description}`}
                              secondary = {`${value.interaction.creationTimestamp} | ${value.interaction.locationStr} | ${value.guest.name} | ${value.resources}`} />

                </ListItem>
              ))}
            </List>
          </div>
        );
    }

  }

  componentWillUnmount() {
      if (this.statePromises)
          this.statePromises.forEach(p => p.cancel());
  }
}

export default withStyles(styles)(SimpleList);
