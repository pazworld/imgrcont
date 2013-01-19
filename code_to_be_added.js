function startButtonClicked2() {
  lift(document)
    .do(ifRunning(toStop))
    .do(ifNotRunning(toStart));
}

/*
 * Monadic Functions
 *   return value with M().
 */

function M(a) {
  this.value = a;
  this.do = function(f) { return f(this.value); };
}

function lift(a) { return new M(a); }

// for start, stop

function toStart(d) {
  d.do(setButtonNotRunning);
  cmdShowNewImage();
  return lift(d);
}

function toStop(d) {
  return d.do(setButtonRunning);
}

// for startButton

function setButtonRunning(d) {
  d.do(getStartButton).do(setValue(BUTTON_IS_RUNNING));
  return lift(d);
}

function setButtonNotRunning(d) {
  d.do(getStartButton).do(setValue(BUTTON_NOT_RUNNING));
  return lift(d);
}

function ifRunning(f) {
  return function(d) {
     if (isButtonRunning(d).value) return f(d);
  }
}

function ifNotRunning(f) {
  return function(d) {
     if (!isButtonRunning(d).value) return f(d);
  }
}

function isButtonRunning(d) {
  return d.do(getStartButton).do(getValue).do(equal(BUTTON_IS_RUNNING));
}

function getStartButton(d) {
  return d.do(getElementById(START_BUTTON_ID));
}

// general functions

function getElementById(id) {
  return function(d) { return lift(d.getElementById(id)); };
}

function getValue() {
  return function(e) { return lift(e.value); };
}

function setValue(value) {
  return function(e) { e.value = value; };
}

function equal(value) {
  return function(m) { return lift(m.value == value); };
}
