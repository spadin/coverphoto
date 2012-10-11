/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global $:true, console:true*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  module('jQuery#CoverPhoto', {
    setup: function() {
      this.div = $('#qunit-fixture .coverphoto');
    }
  });

  test('is chainable', 1, function() {
    // Not a bad test to run on collection methods.
    strictEqual(this.div.CoverPhoto(), this.div, 'should be chaninable');
  });

  test('will post photo to default url', 1, function() {
    this.div.CoverPhoto({
      post: {
        url: '/update_cover_photo'
      }
    });
    var action = $("form", this.div).attr("action");
    strictEqual(action, '/update_cover_photo', 'postUrl is properly set');
  });

  test('should add edit button', 1, function() {
    this.div.CoverPhoto({
      editable: true
    });
    strictEqual($('.edit', this.div).length, 1, 'edit link is added');
  });


}(jQuery));
