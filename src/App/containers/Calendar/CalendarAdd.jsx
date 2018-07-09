import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/Modal';
import Button from 'components/Button';
import RadioButton from 'components/RadioButton';
import { addLeave } from 'api';
import TimePicker from 'components/TimePicker';
import { computeCredit } from 'utils/computeCredits';

class CalendarAdd extends Component {
  state = {
    status: 'Pending',
    type: 'Vacation Leave',
    username: '',
    timeFrom: '09:00 AM',
    timeTo: '06:00 PM'
  }
  
  /************* ACTIONS START **************/
  handleStatusChange = (e) => {
    this.setState({ status: e.target.value })
  }

  handleTypeChange = (e) => {
    this.setState({ type: e.target.value })
  }

  handleTimeFrom = (e) => {
    this.setState({ timeFrom: e.target.value })
  }

  handleTimeTo = (e) => {
    this.setState({ timeTo: e.target.value })
  }

  handleSubmit = async () => {
    let from = `${this.props.from} ${this.state.timeFrom}`;
    let to = `${this.props.to} ${this.state.timeTo}`;

    // If type is VL then deduct appropriate credits, if LWOP deduct 0
    let toDeduct = 0;
    if (this.state.type === 'Vacation Leave') toDeduct = computeCredit(from, to);

    let leave = await addLeave(localStorage.getItem('userId'), this.state.status, this.state.type, from, to, toDeduct);
    if (leave.error) {
      this.props.onError('Failed to add the leave');
      this.props.closeModal();
    } else {
      this.props.onSuccess('Leave successfully added');
      this.props.closeModal();
    }
  }
  /************* ACTIONS END **************/

  render() {
    return (
      <Modal header="Request A Leave">
        <div className="mb-4 text-center" >
          <h2 className="card-title">{this.state.username}</h2>
          <h6 className="card-subtitle text-muted">NAME</h6>
        </div>
        <div className="mb-4 text-center">
          <div className="d-flex justify-content-center mb-2">
            <form className="form-inline">
              <label className="mx-2">From</label>
              <TimePicker
                changeAction={this.handleTimeFrom}
                value={this.state.timeFrom}
              />
              <label className="mx-2">To</label>
              <TimePicker
                changeAction={this.handleTimeTo}
                value={this.state.timeTo}
              />
            </form>
          </div>
          <h6 className="card-subtitle text-muted">TIME</h6>
        </div>
        <div className="mb-4 text-center">
          <div className="mb-2">
            <RadioButton
              id="type-vl"
              name="type"
              text="Vacation Leave"
              checked={this.state.type === 'Vacation Leave' ? true : false}
              value="Vacation Leave"
              changeAction={this.handleTypeChange}
            />
            <RadioButton
              id="type-lwop"
              name="type"
              text="Leave Without Pay"
              checked={this.state.type === 'Leave Without Pay' ? true : false}
              value="Leave Without Pay"
              changeAction={this.handleTypeChange}
            />
          </div>
          <h6 className="card-subtitle text-muted">TYPE</h6>
        </div>
        <div className="mb-4 text-center">
          <div className="mb-2">
            <RadioButton
              id="status-pending"
              name="status"
              text="Pending"
              checked={this.state.status === 'Pending' ? true : false}
              value="Pending"
              changeAction={this.handleStatusChange}
            />
            <RadioButton
              id="status-approved"
              name="status"
              text="Approved"
              checked={this.state.status === 'Approved' ? true : false}
              value="Approved"
              changeAction={this.handleStatusChange}
            />
          </div>
          <h6 className="card-subtitle text-muted">STATUS</h6>
        </div>
        <div className="text-center">
          <Button
            text="Cancel"
            kind="secondary"
            otherClasses="mx-1"
            clickAction={this.props.closeModal}
          />
          <Button
            text="Submit"
            kind="primary"
            otherClasses="mx-1"
            clickAction={this.handleSubmit}
          />
        </div>
      </Modal>
    );
  }

  componentDidMount() {
    this.setState({
      username: localStorage.getItem('name')
    });
  }
}

CalendarAdd.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
  closeModal: PropTypes.func,
  onError: PropTypes.func,
  onSuccess: PropTypes.func
}

export default CalendarAdd;