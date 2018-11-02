/* eslint-disable */
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import React, {Component} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import * as firebase from 'firebase';


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class CheckboxList extends React.Component {

    constructor(props) {
      super(props);
    }

  handleToggle = (key, value) => () => {
    if (value.isDone) {
        var newData = {
                color: value.color,
                creationTimestamp: value.creationTimestamp,
                description: value.description,
                guestIds: value.guestIds,
                isDone: false,
                locationCoord: value.locationCoord,
                locationStr: value.locationStr,
                shiftDate: value.shiftDate,
                title: value.title,
                volunteerId: value.volunteerId
        };
        var update = {};
        update['/actionItems/' + key] = newData;
        firebase.database().ref().update(update);
    } else {
        var newData = {
                color: value.color,
                creationTimestamp: value.creationTimestamp,
                description: value.description,
                guestIds: value.guestIds,
                isDone: true,
                locationCoord: value.locationCoord,
                locationStr: value.locationStr,
                shiftDate: value.shiftDate,
                title: value.title,
                volunteerId: value.volunteerId
        };
        var update = {};
        update['/actionItems/' + key] = newData;
        firebase.database().ref().update(update);
    }
  };

  render() {
    const listContent = this.props.listContent;
    var key_array = [];
    var value_array = [];
    for (var key in listContent) {
        key_array.push(key);
        value_array.push(listContent[key]);
    }

    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List>
          {value_array.map(value => (
            <ListItem
              key={key_array[value_array.indexOf(value)]}
              role={undefined}
              dense
              button
              onClick={this.handleToggle(key_array[value_array.indexOf(value)], value)}
              className={classes.listItem}
            >
              <Checkbox
                checked={value.isDone}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={`${value.title}`} secondary={`${value.description}`} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

CheckboxList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckboxList);
