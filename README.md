---
description: >-
  Parses HTML files to find <img> tags and replaces them with
  <picture><source><img> </picture> tags
---

# gulp-source-in-html

### Usage

```javascript
const { task, src, dest } = require('gulp')
source = require("./index"),

task('default', () => {
  return src('**/*.html', { base: '.' })
    .pipe(source({ attribute: 'srcset' }))
    .pipe(lqipBase64({ srcAttr: "data-src", attribute: "src" })) // if you need lqip
    .pipe(dest('.'))
})
```

### Example

Without LQIP

```javascript
// Input
<img class="test" src="/img/user.jpeg" alt="User" />

//Output
<picture>
    <source srcset="/img/user.webp" type="image/webp">
    <img class="test" src="/img/user.jpeg" alt="User">
</picture>
```

With LQIP

```javascript
// Input
<img class="lazyload" data-src="/img/user.jpeg" alt="User" />

//Output
<picture>
    <source data-srcset="/img/user.webp" type="image/webp">
    <img class="lazyload" data-src="/img/user.jpeg" alt="User" src="data:image/jpeg;base64,...">
</picture>
```

### Options

#### extensions

* Type: `String`
* Default: `[".jpg", ".png", ".jpeg", ".JPG", ".PNG", ".JPEG"]`

Extensions of processed files.

#### newExtensions

* Type: `String`
* Default: `[".webp"]`

Output file extensions.

### Acknowledgement

 Thanks [gulp-webp-in-html](https://github.com/ixamp/gulp-webp-in-html) for the inspiration.

[LQIP](https://github.com/exuanbo/gulp-lqip-base64)
