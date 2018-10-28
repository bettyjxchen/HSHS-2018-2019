import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import AdminIcon from "@material-ui/icons/PermIdentity";
import GroupIcon from "@material-ui/icons/Group";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

function FloatingActionButtons(props) {
  // const { classes } = props;
  return (
    <div>
      {/* action buttons */}
      <div
        style={{
          display: "inline",
          alignItems: "center",
          justifyContent: "space-evenly"
        }}
      >
        <Button
          href="/volunteers"
          variant="fab"
          aria-label="Volunteers"
          className={styles.button}
          style={{
            height: "0%",
            width: "0%",
            padding: "20%",
            left: "25%",
            backgroundColor: "#9e0806",
            marginRight: "70px",
            marginLeft: "140px",
            marginTop: "50px"
          }}
          color="secondary"
        >
          <RecentActorsIcon
            style={{
              height: "12%",
              width: "12%"
            }}
          />
        </Button>
      </div>
      <div style={{ display: "inline-block" }}>
        <Button
          href="/admin"
          variant="fab"
          aria-label="Admin"
          className={styles.button}
          style={{
            height: "300px",
            width: "300px",
            backgroundColor: "#9e0806",
            marginRight: "70px",
            marginLeft: "80px",
            marginTop: "50px"
          }}
          color="secondary"
        >
          <AdminIcon
            style={{
              height: "200px",
              width: "200px"
            }}
          />
        </Button>
      </div>
      <div style={{ display: "inline" }}>
        <Button
          href="/guests"
          variant="fab"
          aria-label="Add"
          className={styles.button}
          style={{
            height: "300px",
            width: "300px",
            backgroundColor: "#9e0806",
            marginRight: "70px",
            marginLeft: "80px",
            marginTop: "50px"
          }}
          color="secondary"
        >
          <GroupIcon
            style={{
              height: "200px",
              width: "200px"
            }}
          />
        </Button>
      </div>
      {/* headers */}
      <div style={{ marginBottom: "0" }}>
        <h1
          style={{
            display: "inline-block",
            marginRight: "330px",
            marginLeft: "210px",
            marginTop: "50px",

            color: "#2d2d2d"
          }}
        >
          Volunteers
        </h1>
        <h1
          style={{
            display: "inline-block",
            marginRight: "340px",
            marginTop: "50px",
            color: "#2d2d2d"
          }}
        >
          Admin
        </h1>
        <h1 style={{ display: "inline-block", color: "#2d2d2d" }}>Guests</h1>
      </div>
      {/* subheaders */}
      <div style={{ textAlign: "center" }}>
        <h3
          style={{
            display: "inline-block",
            marginLeft: "120px",
            marginTop: "0px",
            marginBottom: "0px",
            color: "#2d2d2d"
          }}
        >
          Add, delete, edit and search <br /> volunteer data base
        </h3>
        <h3
          style={{
            display: "inline-block",
            marginLeft: "180px",
            marginTop: "0px",
            marginBottom: "0px",
            color: "#2d2d2d"
          }}
        >
          Add, delete, edit and search <br /> admin data base
        </h3>
        <h3
          style={{
            display: "inline-block",
            color: "#2d2d2d",
            marginLeft: "160px",
            marginTop: "0px",
            marginBottom: "0px"
          }}
        >
          Add, delete, edit and search <br /> guest data base. Access
          interactions page.
        </h3>
      </div>
    </div>
  );
}

FloatingActionButtons.propTypes = {
  // classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FloatingActionButtons);
export { FloatingActionButtons };
