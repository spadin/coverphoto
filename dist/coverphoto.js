/*! Cover Photo - v0.1.0 - 2012-10-05
* https://github.com/sandropadin/coverphoto
* Copyright (c) 2012 Sandro Padin; Licensed MIT */


(function($) {
  var CoverPhoto;
  CoverPhoto = (function() {

    CoverPhoto.cache = [];

    CoverPhoto.cacheCount = 0;

    CoverPhoto.defaults = {
      postUrl: '/update_cover_photo',
      editable: true
    };

    function CoverPhoto(_arg) {
      this.el = _arg.el, this.options = _arg.options;
      this.setup();
      this.cache();
      this.render();
      this.bindEvents();
    }

    CoverPhoto.prototype.render = function() {
      if (this.options.editable) {
        return this.addEditButton();
      }
    };

    CoverPhoto.prototype.bindEvents = function() {};

    CoverPhoto.prototype.setup = function() {
      this.options = $.extend(CoverPhoto.defaults, this.options);
      return this.$el = $(this.el);
    };

    CoverPhoto.prototype.cache = function() {
      this.$el.attr('data-coverphoto-id', CoverPhoto.cacheCount);
      CoverPhoto.cache[CoverPhoto.cacheCount] = this;
      return CoverPhoto.cacheCount++;
    };

    CoverPhoto.prototype.addEditButton = function() {
      return this.$el.append("<a href=\"#\" class=\"edit\">Change cover photo</a>");
    };

    return CoverPhoto;

  })();
  return $.fn.CoverPhoto = function(data) {
    if (data === 'get' && this.length === 1) {
      return CoverPhoto.cache[$(this).data('coverphoto-id')];
    } else {
      return this.each(function() {
        return new CoverPhoto({
          el: this,
          options: data
        });
      });
    }
  };
})($);
