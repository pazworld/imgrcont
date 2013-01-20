function startButtonClicked2() {
  box(document)
    .do(ifRunning(toStop))
    .do(ifNotRunning(toStart));
}

function cmdShowNewImage2 {
  var img = box(createImage()).do(setImageCallback).value;
  box(document).do(getImageArea).do(insertFirst(img));
  cmdSetImageRandomUrl(img);
}

/*
 * Monadic Functions
 *   return value with MBox().
 */

function MBox(a) {
  this.value = a;
  this.do = function(f) { return f(this.value); };
}

function box(a) { return new MBox(a); }

// to start and stop

function toStart(d) {
  setButtonNotRunning(d);
  cmdShowNewImage();
  return box(d);
}

function toStop(d) {
  return setButtonRunning(d);
}

// for startButton

function setButtonRunning(d) {
  return box(d).do(setButtonValue(BUTTON_IS_RUNNING));
}

function setButtonNotRunning(d) {
  return box(d).do(setButtonValue(BUTTON_NOT_RUNNING);
}

function setButtonValue(value) {
  return function(d) {
    box(d).do(getStartButton).do(setValue(value));
    return box(d);
  };
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
  return box(d.getElementById(START_BUTTON_ID));
}

// for image

function setImageCallback(img) {
  img.onerror = imageOnError;
  img.onload = imageOnLoad;
  return box(img);
}

// general functions

function getValue() {
  return function(e) { return box(e.value); };
}

function setValue(value) {
  return function(e) { e.value = value; return box(e); };
}

function equal(value) {
  return function(m) { return box(m.value == value); };
}

// for test

function withWork(f) {
  var d = box(document).do(setUpWork);
  f(d.value);
  d.do(clearWork);
}
