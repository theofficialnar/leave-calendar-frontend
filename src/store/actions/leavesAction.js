import { getLeaves, addLeave, deleteLeave } from "../../api";
import {
  FETCH_LEAVES,
  ADD_LEAVE,
  FETCH_LEAVE_INFO,
  DELETE_LEAVE
} from "./actionTypes";

export const fetchLeaves = () => {
  return async dispatch => {
    const leaves = await getLeaves();
    let action = {
      type: FETCH_LEAVES,
      error: false,
      leaves: []
    };
    if (leaves.error) {
      action.error = true;
    } else {
      action.leaves = leaves.data.data;
    }
    dispatch(action);
  };
};

export const fileLeave = (name, type, start, end, creditsToDeduct) => {
  return async dispatch => {
    const leave = await addLeave(
      localStorage.getItem("userId"),
      "Pending",
      type,
      start,
      end,
      creditsToDeduct
    );
    let action = {
      type: ADD_LEAVE,
      error: false,
      credits: 0,
      data: {}
    };
    if (leave.error) {
      action.error = true;
    } else {
      action.credits = leave.data.leaveCredits;
      action.data = {
        ...leave.data.data,
        name
      };
    }
    dispatch(action);
  };
};

export const fetchLeaveInfo = id => {
  return {
    type: FETCH_LEAVE_INFO,
    id
  };
};

export const removeLeave = (id, creditsToAdd) => {
  return async dispatch => {
    const leave = await deleteLeave(
      id,
      creditsToAdd,
      localStorage.getItem("userId")
    );
    let action = {
      type: DELETE_LEAVE,
      error: false,
      credits: 0,
      id: null
    };
    if (leave.error) {
      action.error = true;
    } else {
      action.credits = leave.data.leaveCredits;
      action.id = id;
    }
    dispatch(action);
  };
};
