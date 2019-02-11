import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import * as firebase from "firebase";

//create data
let counter = 0;
function createData(date, headcount, supplies) {
	counter += 1;
	return {
		id: counter,
		date,
		headcount,
		supplies: {
			items: supplies,
			id: supplies.id
		}
	};
}

//table rows
const rows = [
	{
		id: "date",
		numeric: false,
		disablePadding: true,
		label: "Date (MM-DD-YYYY)"
	},
	{ id: "supplies", numeric: false, disablePadding: false, label: "Supplies" },
	{
		id: "headcount",
		numeric: false,
		disablePadding: false,
		label: "Headcount"
	},
	{ id: "summary", numeric: false, disablePadding: false, label: "Summary"}
];

//sorting
function desc(a, b, orderBy) {
	//TODO @Phil this is the function I changed but I don't see it getting called anywhere
	let date1 = a.id.split("-");
	let date2 = b.id.split("-");

    if (date1[0] < date2[0]) {
        return -1;
    } else if (date1[0] > date2[0]) {
        return 1;
    } else {
        if (date1[1] < date2[1]) {
            return -1;
        } else if (date1[1] > date2[1]) {
            return 1;
        } else {
            return date1[2] > date2[2] ? 1 : -1;
        }
    }

	console.error("Date sorting funciton error");
}

function stableSort(array, cmp) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
	return order === "desc"
		? (a, b) => desc(a, b, orderBy)
		: (a, b) => -desc(a, b, orderBy);
}

class EnhancedTableHead extends React.Component {
	createSortHandler = property => event => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const { order, orderBy, rowCount } = this.props;

		return (
			<TableHead>
				<TableRow>
					<TableCell padding="checkbox" />
					{rows.map(row => {
						return (
							<TableCell
								key={row.id}
								numeric={row.numeric}
								padding={row.disablePadding ? "none" : "default"}
								sortDirection={orderBy === row.id ? order : false}
							>
								<Tooltip
									title="Sort"
									placement={row.numeric ? "bottom-end" : "bottom-start"}
									enterDelay={300}
								>
									<TableSortLabel
										active={orderBy === row.id}
										direction={order}
										onClick={this.createSortHandler(row.id)}
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							</TableCell>
						);
					}, this)}
				</TableRow>
			</TableHead>
		);
	}
}

EnhancedTableHead.propTypes = {
	onRequestSort: PropTypes.func.isRequired,
	order: PropTypes.string.isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired
};

const toolbarStyles = theme => ({
	root: {
		paddingRight: theme.spacing.unit
	},
	highlight:
		theme.palette.type === "light"
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(theme.palette.secondary.light, 0.85)
			  }
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark
			  },
	spacer: {
		flex: "1 1 100%"
	},
	actions: {
		color: theme.palette.text.secondary
	},
	title: {
		flex: "0 0 auto"
	}
});

let EnhancedTableToolbar = props => {
	const { classes } = props;

	return (
		<Toolbar className={classNames(classes.root)}>
			<div className={classes.title}>
				{
					<Typography variant="h6" id="tableTitle">
						Daily Street Team Reports
					</Typography>
				}
			</div>
			<div className={classes.spacer} />
			<div className={classes.actions}>
				{
					<Tooltip title="Filter list">
						<IconButton aria-label="Filter list" />
					</Tooltip>
				}
			</div>
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	classes: PropTypes.object.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
	root: {
		width: "100%",
		marginTop: theme.spacing.unit * 3
	},
	table: {
		minWidth: 1020
	},
	tableWrapper: {
		overflowX: "auto"
	}
});

class ReportsTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			order: "asc",
			orderBy: "date",
			page: 0,
			rowsPerPage: 5
		};
	}

	componentDidMount() {
		let self = this;
		firebase
			.database()
			.ref("/dateEntry/")
			.once("value")
			.then(function(snapshot) {
				var val = snapshot.val();
				var reports_list = [];
				Object.keys(val).forEach(key => {
					var value = val[key];
					if (!value.Supply) value.Supply = {};
					var value = { id: key, value: val[key] };
					reports_list.push(value);
				});
				self.setState({
					data: reports_list
				});
			});
	}

	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = "desc";

		if (this.state.orderBy === property && this.state.order === "desc") {
			order = "asc";
		}

		this.setState({ order, orderBy });
	};

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value });
	};

	render() {
		const { classes } = this.props;
		const { data, order, orderBy, rowsPerPage, page } = this.state;
		const emptyRows =
			rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

		return (
			<Paper className={classes.root}>
				<EnhancedTableToolbar />
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-labelledby="tableTitle">
						<EnhancedTableHead
							order={order}
							orderBy={orderBy}
							onRequestSort={this.handleRequestSort}
							rowCount={data.length}
						/>
						<TableBody>
							{stableSort(data, getSorting(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map(n => {
									//map data to form fields
									if (n.value.Headcount) {
										n.value.Headcount = {
											"E-beds called in": n.value.Headcount["bedsCalled"],
											"People spoken to about resources":
												n.value.Headcount["peopleAboutResource"],
											"Total people spoken to": n.value.Headcount["totalPeople"],
											"Youth spoken to": n.value.Headcount["youth"]
										};
									} else {
										n.value.Headcount = {
											"E-beds called in": 0,
											"People spoken to about resources":
												0,
											"Total people spoken to": 0,
											"Youth spoken to": 0
										};
									}
									

									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={n.id}>
											<TableCell style={{ paddingLeft: "15px" }} />
											<TableCell component="th" scope="row" padding="default">
												{n.id}
											</TableCell>
											<TableCell padding="default">
												<ul style={{ paddingLeft: "15px" }}>
													{Object.keys(n.value.Supply).map(item => {
														return (
															<li
																style={{ paddingTop: "6px" }}
																key={n.id + item}
															>
																{item}: {n.value.Supply[item]}
															</li>
														);
													})}
												</ul>
											</TableCell>
											<TableCell style={{ paddingLeft: "45px" }}>
												<ul style={{ paddingLeft: "15px" }}>
													{Object.keys(n.value.Headcount).map(item => {
														return (
															<li
																style={{ paddingTop: "6px" }}
																key={n.id + item}
															>
																{item}: {n.value.Headcount[item]}
															</li>
														);
													})}
												</ul>
											</TableCell>
											<TableCell padding="default">
												{n.value.Summary}
											</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						"aria-label": "Previous Page"
					}}
					nextIconButtonProps={{
						"aria-label": "Next Page"
					}}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
			</Paper>
		);
	}
}

ReportsTable.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ReportsTable);
