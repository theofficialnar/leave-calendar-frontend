import React, { Component } from 'react';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import _ from 'lodash';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import HeaderWrapper from '../../components/Header';
import CalendarAdd from '../../containers/Calendar/CalendarAdd';
import CalendarEvent from '../../containers/Calendar/CalendarEvent';
import Alert from '../../components/Alert';
import Loader from '../../components/Loader';
import { getLeaves, getHolidays } from '../../api';
import { isAfterToday } from '../../utils/checkDays';

moment().utcOffset(12);
BigCalendar.momentLocalizer(moment);

let styles = {}

styles.calendarWrapper = {
  minHeight: '100vh'
}

class Calendar extends Component {
  state = {
    events: [],
    holidays: [],
    isLoading: true,
    triggerAlertSuccess: false,
    triggerAlertError: false,
    triggerAddModal: false,
    triggerEventModal: false,
    selectedDateFrom: '',
    selectedDateTo: '',
    messageError: '',
    messageSuccess: '',
    toDisplayEvent: {},
  }

  EventCalendar = ({ event }) => {
    if (event.status === 'Holiday') {
      return (
        <span className="text-center">
          <strong>{event.name} </strong>
        </span>
      );
    }
    return (
      <span className="text-center">
        <strong>{event.name} </strong>
        <em style={{fontSize: '.8em'}}> {`${moment(event.start).format('h:mm A')} - ${moment(event.end).format('h:mm A')}`}</em>
      </span>
    );
  }

  CustomEventPropGetter = (event) => {
    if (event.status === 'Approved') {
      return {
        style: {
          backgroundColor: '#015249'
        }
      }
    } else if (event.status === 'Pending') {
      return {
        style: {
          backgroundColor: '#984B43'
        }
      }
    } else return {}
  }

  CustomDayPropGetter = (date) => {
    if (date.getDay() === 0 || date.getDay() === 6) {
      return {
        style: {
          backgroundColor: '#f7edef'
        }
      }
    }
  }

  fetchEvents = async () => {
    let leaves = await getLeaves();
    let holidays = await getHolidays();

    if (leaves.error) {
      console.error(leaves.error.data.message);
    } else if (holidays.error) {
      console.error(holidays.error.data.error);
    } else {
      let tempArray = [];
      leaves.data.data.map((leave) => {
        let arr = {
          id: leave._id,
          name: leave.userId.fullName,
          start: new Date(leave.start),
          end: new Date(leave.end),
          status: leave.status
        }
        return tempArray.push(arr);
      });

      holidays.data.items.map((holiday) => {
        let arr = {
          id: holiday.id,
          name: holiday.summary,
          start: new Date(`${holiday.start.date} 12:00 AM`),
          end: new Date(`${holiday.end.date} 12:00 AM`),
          status: 'Holiday'
        }
        return tempArray.push(arr);
      });

      this.setState({
        events: tempArray,
        isLoading: false
      });
    }
  }

  handleModalClose = () => {
    this.setState({
      triggerAddModal: false,
      triggerEventModal: false
    });
  }

  handleAlertClose = () => {
    this.setState({
      triggerAlertError: false,
      triggerAlertSuccess: false
    });
  }

  setSuccess = (message, newLeaveArray, type) => {
    let newArray = [];
    if (type === 'add') {
      newArray = [...this.state.events, newLeaveArray]
    } else {
      newArray = _.pull(this.state.events, newLeaveArray)
    }
    this.setState({
      triggerAlertSuccess: true,
      events: newArray,
      messageSuccess: message
    });
  }

  setError = (message) => {
    this.setState({
      triggerAlertError: true,
      messageError: message
    });
  }

  displayLeaveInfo = (eventId) => {
    // eslint-disable-next-line
    this.state.events.map((event) => {
      if (eventId === event.id) {
        this.setState({
          toDisplayEvent: event
        })
      }
    });
  }

  render() {
    return (
      <HeaderWrapper>
        {!this.state.isLoading &&
          <BigCalendar
            defaultDate={new Date()}
            style={styles.calendarWrapper}
            events={this.state.events}
            selectable={true}
            popup={true}
            onSelectSlot={slotInfo => {
              if (isAfterToday(slotInfo.start)) {
                this.setState({
                  selectedDateFrom: slotInfo.start.toLocaleDateString(),
                  selectedDateTo: slotInfo.end.toLocaleDateString(),
                  triggerAddModal: true
                });
              } else {
                this.setError('You can\'t file a leave on past dates');
              }
            }}
            onSelectEvent={event => {
              if (event.status !== 'Holiday') {
                this.displayLeaveInfo(event.id);
                this.setState({ triggerEventModal: true })
              }
            }}
            views={['month']}
            components={{
              event: this.EventCalendar
            }}
            eventPropGetter={this.CustomEventPropGetter}
            dayPropGetter={this.CustomDayPropGetter}
          />
        }
        {this.state.isLoading && <Loader />}
        {this.state.triggerEventModal && <CalendarEvent event={this.state.toDisplayEvent} closeModal={this.handleModalClose} onSuccess={this.setSuccess} onError={this.setError} />}
        {this.state.triggerAddModal && <CalendarAdd closeModal={this.handleModalClose} from={this.state.selectedDateFrom} to={this.state.selectedDateTo} onSuccess={this.setSuccess} onError={this.setError} />}
        {this.state.triggerAlertSuccess && <Alert floating={true} kind="success" message={this.state.messageSuccess} clickAction={this.handleAlertClose} />}
        {this.state.triggerAlertError && <Alert floating={true} kind="danger" message={this.state.messageError} clickAction={this.handleAlertClose} />}
      </HeaderWrapper>
    );
  }

  componentDidMount() {
    this.fetchEvents();
  }

  shouldComponentUpdate(nextState) {
    const diffState = this.state.events !== nextState.events;
    return diffState;
  }
}

export default Calendar;