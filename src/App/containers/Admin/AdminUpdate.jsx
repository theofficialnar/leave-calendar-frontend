import React, { Component } from 'react';
import propTypes from 'prop-types';

import { updateUser } from '../../api';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

class AdminUpdate extends Component {
  state = {
    fullName: this.props.userInfo.fullName,
    leaveCredits: Math.ceil(this.props.userInfo.leaveCredits*100)/100
  }

  handleNameChange = (e) => {
    this.setState({ fullName: e.target.value })
  }

  handleCreditsChange = (e) => {
    this.setState({ leaveCredits: e.target.value })
  }

  handleSubmit = async () => {
    let user = await updateUser(this.props.userInfo._id, this.state.fullName, this.state.leaveCredits);
    if (user.error) {
      this.props.onError(user.error.data.message);
      this.props.handleClose();
    } else {
      this.props.onSuccess(user.data.message);
      this.props.handleClose();
    }
  }
  
  render() {
    return (
      <Modal header="Update User">
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Full Name</span>
          </div>
          <input
            className="form-control"
            type="text"
            aria-describedby="username"
            value={this.state.fullName}
            onChange={this.handleNameChange}
          />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Leave Credits</span>
          </div>
          <input
            className="form-control"
            type="number"
            aria-describedby="leaveCredits"
            value={this.state.leaveCredits}
            onChange={this.handleCreditsChange}
          />
        </div>
        <div className="text-center">
          <Button
            text="Close"
            otherClasses="mx-1"
            kind="secondary"
            clickAction={this.props.handleClose}
          />
          <Button
            text="Submit"
            otherClasses="mx-1"
            clickAction={this.handleSubmit}
          />
        </div>
      </Modal> 
    );
  }
}

AdminUpdate.propTypes = {
  handleClose: propTypes.func,
  userInfo: propTypes.object,
  onSuccess: propTypes.func,
  onError: propTypes.func
}
export default AdminUpdate;