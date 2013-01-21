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
 * Logic composer
 *   compose functions.
 */

function MBox(a) {
  this.value = a;
  this.do = function(f) { return f(this.value); };
}

function box(a) { return new MBox(a); }

/*
 * Logics
 *   are the place for business/domain logics.
 */

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

test("ifRunning should call given function when running", function() {
  withWork(function(d) {
    var counterRunning = new Counter();
    var counterNotRunning = new Counter();
    box(document)
      .do(addStartButton)
      .do(setButtonNotRunning)
      .do(ifRunning(counterNotRunning.countUp))
      .do(setButtonRunning)
      .do(ifRunning(counterRunning.countUp));
    equal(counterNotRunning.count, 0, "not called when not running");
    notEqual(counterRunning.count, 0, "called when running");
  });
});

function ifRunning(f) {
  return function(d) {
     if (isButtonRunning(d).value) f(d);
     return box(d);
  }
}

function ifNotRunning(f) {
  return function(d) {
     if (!isButtonRunning(d).value) return f(d);
  }
}

function isButtonRunning(d) {
  return getStartButton(d).do(getValue).do(equal(BUTTON_IS_RUNNING));
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
  var d = box(document).do(setupWork);
  f(d.value);
  d.do(clearWork);
}

function Counter() {
  this.count = 0;
  this.countUp = function() { count++; }
}
