# Cover Photo

Create Facebook-like cover photos.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/spadin/coverphoto/master/dist/coverphoto.min.js
[max]: https://raw.github.com/spadin/coverphoto/master/dist/coverphoto.js

In your web page:

```html

<script src="../libs/jquery/jquery.js"></script>
<script src="../libs/jquery/jquery-ui.js"></script>

<link rel="stylesheet" href="coverphoto.css">
<script src="coverphoto.min.js"></script>

<style type="text/css">
  .coverphoto {
    width: 1024px;
    height: 200px;
    border: 1px solid black;
    margin: 0 auto;
  }
</style>

<script type="text/javascript">
  $(function() {
    $(".coverphoto").CoverPhoto({
      postUrl: '/process_cover_photo.php',
      currentImage: 'images/funny.jpg',
      editable: true
    });
  });
</script>
<div class="coverphoto"></div>

```

## Documentation

In the example above the `process_cover_photo.php` script would receive 
the following `POST` data from a `multipart/form-data` form.

coverphoto[original] - File input field.
coverphoto[cropped]  - Base64 encoded image dataUrl

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
