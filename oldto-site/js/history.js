// History management service.
// Consider using this instead: https://github.com/browserstate/history.js
// TODO(danvk): use arrow functions and ES6 classes here.
const History = function(hashToStateAdapter) {
  this.states = [];
  this.hashToStateAdapter = hashToStateAdapter;
};

History.prototype.initialize = function() {
  const that = this;
  $(window).on('popstate', function(e) {
    that.handlePopState(e.originalEvent.state);
  });

  // Create an artificial initial state
  let state = {initial: true};
  let didSetState = false;

  const rest = function() {
    // Blow away the current state -- it's only going to cause trouble.
    history.replaceState({}, '', document.location.href);
    this.replaceState(state, document.title, document.location.href);

    if (didSetState) {
      $(this).trigger('setStateInResponseToPageLoad', state);
    }
  }.bind(this);

  if (this.hashToStateAdapter && document.location.hash) {
    didSetState = true;
    // Need to honor any hash fragments that the user navigated to.
    this.hashToStateAdapter(document.location.hash, function(newState) {
      state = newState;
      rest();
    });
  } else {
    rest();
  }
};

History.prototype.makeState = function(obj) {
  let currentStateId = null;
  if (history.state && 'id' in history.state) {
    currentStateId = history.state.id;
  }
  return $.extend({
    length: history.length,
    previousStateId: currentStateId,
    id: Date.now() + '' + Math.floor(Math.random() * 100000000)
  }, obj);
};

History.prototype.simplifyState = function(obj) {
  const state = $.extend({}, obj);
  delete state['id'];
  // delete state['length'];
  delete state['previousStateId'];
  return state;
};

History.prototype.handlePopState = function(state) {
  // note: we don't remove entries from this.state here, since the user could
  // still go forward to them.
  if (state && 'id' in state) {
    const stateObj = this.states[this.getStateIndexById(state.id)];
    if (stateObj && stateObj.expectingBack) {
      // This is happening as a result of a call on the History object.
      delete stateObj.expectingBack;
      return;
    }
  }

  const trigger = function() {
    $(this).trigger('setStateInResponseToUser', state);
  }.bind(this);
  if (!state && this.hashToStateAdapter) {
    this.hashToStateAdapter(document.location.hash, function(newState) {
      state = newState;
      trigger();
    });
  } else {
    trigger();
  }
};

// Just like history.pushState.
History.prototype.pushState = function(stateObj, title, url) {
  const state = this.makeState(stateObj);
  this.states.push(state);
  history.pushState(state, title, url);
  document.title = title;
};

// Just like history.replaceState.
History.prototype.replaceState = function(stateObj, title, url) {
  const curState = this.getCurrentState();
  let replaceIdx = null;
  let previousId = null;
  if (curState) {
    if ('id' in curState) {
      replaceIdx = this.getStateIndexById(curState.id);
    }
    if ('previousStateId' in curState) {
      // in replacing the current state, we inherit its parent state.
      previousId = curState.previousStateId;
    }
  }

  const state = this.makeState(stateObj);
  if (previousId !== null) {
    state.previousStateId = previousId;
  }
  if (replaceIdx !== null) {
    this.states[replaceIdx] = state;
  } else {
    this.states.push(state);
  }
  history.replaceState(state, title, url);
  document.title = title;
}

History.prototype.getCurrentState = function() {
  return history.state;
};

History.prototype.getStateIndexById = function(stateId) {
  for (var i = 0; i < this.states.length; i++) {
    if (this.states[i].id === stateId) return i;
  }
  return null;
};

// Get the state object one prior to the given one.
History.prototype.getPreviousState = function(state) {
  if (!('previousStateId' in state)) return null;
  const id = state['previousStateId'];
  if (id === null || id === undefined) return id;

  const idx = this.getStateIndexById(id);
  if (idx !== null) {
    return this.states[idx];
  }
  throw "State out of whack!";
};

/**
 * Go back in history until the predicate is true.
 * If predicate is a string, go back until it's a key in the state object.
 * This will not result in a setStateInResponseToUser event firing.
 * Returns the number of steps back in the history that it went (possibly 0 if
 * the current state matches the predicate).
 * If no matching history state is found, the history stack will be cleared and
 * alternativeState will be pushed on.
 */
History.prototype.goBackUntil = function(predicate, alternativeState) {
  // Convenience for common case of checking if history state has a key.
  if (typeof(predicate) === "string") {
    return this.goBackUntil(
        function(state) { return predicate in state },
        alternativeState);
  }

  let state = this.getCurrentState();
  let numBack = 0;

  let lastState = null;
  while (state && !predicate(state)) {
    lastState = state;
    state = this.getPreviousState(state);
    numBack += 1;
  }
  if (state && numBack) {
    state.expectingBack = true;
    history.go(-numBack);
    return numBack;
  }
  if (numBack === 0) {
    return 0;  // current state fulfilled predicate
  } else {
    // no state fulfilled predicate. Clear the stack to just one state and
    // replace it with alternativeState.
    const stackLen = numBack;
    if (stackLen !== 1) {
      lastState.expectingBack = true;
      history.go(-(stackLen - 1));
    }
    this.replaceState(alternativeState[0], alternativeState[1], alternativeState[2]);
  }
};

// Debugging method -- prints the history stack.
History.prototype.logStack = function() {
  let state = this.getCurrentState();
  let i = 0;
  while (state) {
    console.log((i > 0 ? '-' : ' ') + i, this.simplifyState(state));
    state = this.getPreviousState(state);
    i++;
  }
};

export default History;
