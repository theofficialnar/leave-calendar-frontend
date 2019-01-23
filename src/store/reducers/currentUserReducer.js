const initState = {
  user: {
    firstName: "John",
    lastName: "Wick",
    credits: 100
  },
  error: false
};

const currentUserReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_USER":
      return Object.assign({}, state, {
        user: action.user,
        error: action.error
      });

    case "UNSET_USER":
      return Object.assign({}, state, {
        user: action.user,
        error: action.error
      });

    default:
      return state;
  }
};

export default currentUserReducer;