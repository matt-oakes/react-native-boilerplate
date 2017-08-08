// @flow

// This is a list of changes to make to the state being rehydrated.
// The keys must be integers, and migrations will be performed in ascending key order.
// Note: Only whitelisted reducers will be present in this state.
export default {
  // The initial migrator which does nothing aside from set the version number
  [1]: state => state
};
