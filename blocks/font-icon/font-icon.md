Icon set update
---------------

Prerequisites: 
Install fontforge as described at [https://github.com/sapegin/grunt-webfont#installation]

1. Add new icon to `blocks/font-icon/__icon` folder

1.5. (Optional) For round icons, that render bad on Windows. 
     Edit sprite config in `font-icon.phantomjs.coffee` and update sprite rules across scss-files manually
   
2. Generate fonts using `grunt font`