/* eslint-disable */
import React, {Component} from 'react';
import Card, {CardContent, CardActions} from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import SimpleList from './SimpleList';
import Typography from '@material-ui/core/Typography';

class ListCard extends Component {
  constructor(props) {
    super(props);
    this.state = { listContent: {} };
  }

  componentDidMount() {
    let self = this;
    let dataRef = this.props.dataRef;
    dataRef.on('value', (snapshot) => {
        var newContent = {};
        snapshot.forEach((childSnapshot) => {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          newContent[childKey] = childData;
        });
        console.log(newContent);
      self.setState({
        listContent: newContent
      });
    });
  }

  render() {

    const { classes } = this.props;

    return(
      <Card style = {this.props.style}>
        <CardContent>
            <Typography variant="title" gutterBottom>
              {this.props.label}
            </Typography>
            <SimpleList listContent = {this.state.listContent} hasTitle = {this.props.hasTitle}/>
        </CardContent>
      </Card>
    );
  }

  componentWillUnmount() {
      if (this.statePromises)
          this.statePromises.forEach(p => p.cancel());
  }

}

export default ListCard;
