const initialState = {
  accountType: 'hybrid',
  userId: 'UserId#123123',
  session: 'dySessionId',
  region: 'us',
  apiKey: '',
  locale: 'en_US',
  selectors: [],
  apiHost: 'https://direct.dy-api.com',
  apiCollectHost: 'https://direct-collect.dy-api.com',
  cookies: [],
  themeSettings: {}
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE":
      const currentState = state;
      currentState[action.payload.key] = action.payload.value;
      state = currentState;
      return state;

    default:
      return state;
  }
}

export default settingsReducer;
