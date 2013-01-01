var WORK_AREA_ID = "workarea";

test("Image should have image element wrapped by anchor", function() {
  var img = new Image();
  equal(img.innerImg.tagName, "IMG", "have image element");
  equal(img.innerWrapper.tagName, "A", "wrapped by anchor element");
});

test("Image.setUrl should return that Image object itself.", function() {
  var img = new Image();
  deepEqual(img.setUrl("ok.png"), img, "same Image object");
});

test("Image.getUrl should return same url which is set by setUrl",
    function() {
  var url = randPictureUrl();
  var img = (new Image()).setUrl(url);
  equal(img.getUrl(), url, "get same url that set");
});

test("Image should show as a child of specified element", function() {
  withWorkArea(function(wrkArea) {
    var img = (new Image()).setUrl("ok.png").show(wrkArea.id);
    insertedImg = wrkArea.firstChild.firstChild;
    equal(insertedImg.tagName, "IMG", "show as a child");
  });
});

test("Image.show should return that Image object itself.", function() {
  withWorkArea(function(wrkArea) {
    var img = (new Image()).setUrl("ok.png");
    deepEqual(img.show(wrkArea.id), img, "same Image object");
  });
});

test("Image should be reloaded on error", function() {
  reloadTest("reloaded", "error.png", "ok.png");
});

test("Image should be reloaded when not exist", function() {
  reloadTest("reloaded", "not_exist.png", "ok.png");
});

test("makeKey should return random string which length is 5", function() {
  notEqual(makeKey(), makeKey(), "string is random");
  equal(makeKey().length, 5, "string length is 5");
});

test("randChar should return random string which length is 1", function() {
  notEqual(randChar(), randChar(), "string is random");
  equal(randChar().length, 1, "string length is 1");
});

test("showRandPicture should show random picture of imgur", function() {
  withWorkArea(function(wrkArea) {
    showRandPicture(wrkArea.id);
    var img = wrkArea.firstChild.firstChild;
    ok(img.nodeName.match(/img/i), "image element is inserted");
    ok(img.src.match(/imgur/i), "image source is imgur");
  });
});

test("insertFirst should append element when no child node", function() {
  withWorkArea(function(wrkArea) {
    equal(wrkArea.childNodes.length, 0, "when no child node");
    var e = document.createElement("div");
    insertFirst(wrkArea, e);
    equal(wrkArea.childNodes.length, 1, "appended");
  });
});

test("insertFirst should insert element first when child node exists",
    function() {
  withWorkArea(function(wrkArea) {
    var e1 = document.createElement("div");
    e1.setAttribute("class", "to be second");
    insertFirst(wrkArea, e1);
    equal(wrkArea.childNodes.length, 1, "when child node exists");

    var e2 = document.createElement("div");
    e2.setAttribute("class", "to be first");
    insertFirst(wrkArea, e2);
    equal(wrkArea.childNodes[0].getAttribute("class"),
      "to be first", "inserted first");
  });
});

test("isImageExist should return true if image isn't not_exist.png",
    function() {
  isImageExistTest("check image exist", "ok.png", true);
  isImageExistTest("check image not exist", "not_exist.png", false);
});

test("call nextImage() when load complete", function() {
  withWorkArea(function(wrkArea) {
    Mock.make("nextImage", function(img) { img.loaded = true; });
    var img = (new Image()).setUrl("ok.png").show(wrkArea.id);
    img.innerImg.loaded = false;
    doLater(function() {
      ok(img.innerImg.loaded, "nextImage() is called");
      Mock.revert_all();
      start();
    });
  });
});

function reloadTest(msg, filename, expected) {
  withWorkArea(function(wrkArea) {
    Mock.make("randPictureUrl", function() { return "ok.png"; });
    var img = (new Image()).setUrl(filename).show(wrkArea.id);
    doLater(function() {
      equal(img.getUrl(), expected, msg);
      Mock.revert_all();
    });
  });
}

function isImageExistTest(msg, filename, expected) {
  withWorkArea(function(wrkArea) {
    Mock.make("reloadImage", function() {});
    var img = (new Image()).setUrl(filename).show(wrkArea.id);
    doLater(function() {
      equal(isImageExist(img.innerImg), expected, msg);
      Mock.revert_all();
    });
  });
}

function doLater(func) {
  stop();
  setTimeout(function() {
    func();
    start();
  }, 300);
}

function withWorkArea(func) {
  makeWorkArea();
  func(workArea());
  removeWorkArea();
}

function makeWorkArea() {
  var w = document.createElement("div");
  w.id = WORK_AREA_ID;
  baseDiv().appendChild(w);
}

function removeWorkArea() {
  baseDiv().removeChild(workArea());
}

function workArea() {
  return document.getElementById(WORK_AREA_ID);
}

function baseDiv() {
  return document.getElementById("qunit");
}
