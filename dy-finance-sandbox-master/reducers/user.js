const initialState = {};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
      //Authorize user
    case "AUTH":
      Object.assign(action.payload, {loggedIn: true});
      return {...state, ...action.payload};
    default:
      return state;
  }
}

export default userReducer;
