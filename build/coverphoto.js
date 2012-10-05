this["coverphotoTemplates"] = this["coverphotoTemplates"] || {};

this["coverphotoTemplates"]["src/templates/form.jst"] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<form action="'+
( postUrl )+
'">\n  <input type="file" name="coverphoto[image]" accepts="image/*">\n</form>';
}
return __p;
};
(function() {

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

}).call(this);
