import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import BigCalendar from "react-big-calendar";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

import "react-big-calendar/lib/css/react-big-calendar.css";
import LeaveRequest from "./LeaveRequest";
import { fetchHolidays, fetchLeaves } from "../../store/actions/calendarAction";

// Big Calendar Date Localizer setup
const localizer = BigCalendar.momentLocalizer(moment);

const styles = theme => ({
  root: {
    minHeight: "80vh",
    padding: theme.spacing.unit
  },
  calendar: {
    height: "80vh"
  }
});

class CalendarArea extends Component {
  state = {
    start: null,
    end: null,
    open: false
  };

  componentDidMount() {
    this.props.fetchHolidays();
    this.props.fetchLeaves();
  }

  handleSelectSlot = info => {
    this.setState({
      start: info.start.toLocaleDateString(),
      end: info.end.toLocaleDateString(),
      open: true
    });
    console.log(moment(this.state.start).format("YYYY-MM-DD"));
  };

  handleClose = () => {
    this.setState({
      start: null,
      end: null,
      open: false
    });
  };

  render() {
    const { classes, holidays, leaves } = this.props;
    const { open, start, end } = this.state;

    return (
      <Fragment>
        <Paper className={classes.root}>
          <BigCalendar
            className={classes.calendar}
            localizer={localizer}
            defaultDate={new Date()}
            views={["month"]}
            events={[...holidays.dates, ...leaves.dates]}
            selectable
            popup
            onSelectSlot={info => this.handleSelectSlot(info)}
          />
        </Paper>
        <LeaveRequest
          open={open}
          handleClose={this.handleClose}
          start={start}
          end={end}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  holidays: state.events.holidays,
  leaves: state.events.leaves
});

const mapDispatchToProps = dispatch => ({
  fetchHolidays: () => dispatch(fetchHolidays()),
  fetchLeaves: () => dispatch(fetchLeaves())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CalendarArea));
