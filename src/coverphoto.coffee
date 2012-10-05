do ($) ->
  class CoverPhoto
    @cache: []
    @cacheCount: 0
    @defaults:
      postUrl:  '/update_cover_photo'
      editable: true

    constructor: ({@el, @options}) ->
      @setup()
      @cache()
      @render()
      @bindEvents()

    render: ->
      @addEditButton() if @options.editable

    bindEvents: ->
      

    setup: ->
      @options = $.extend(CoverPhoto.defaults, @options)
      @$el = $(@el)

    cache: ->
      @$el.attr 'data-coverphoto-id', CoverPhoto.cacheCount
      CoverPhoto.cache[CoverPhoto.cacheCount] = @
      CoverPhoto.cacheCount++

    addEditButton: ->
      @$el.append """<a href="#" class="edit">Change cover photo</a>"""

  $.fn.CoverPhoto = (data) ->
    if data is 'get' and @.length is 1
      CoverPhoto.cache[$(@).data('coverphoto-id')]

    else
      @each ->
        new CoverPhoto
          el: @
          options: data