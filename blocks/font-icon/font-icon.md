Icon set update with Icomoon
----------------------------

In 8 simple steps:

1. Use font-icon.json to restore projects at http://icomoon.io/app/#/projects

2. Edit icon set there

3. Save projects to `font-icon.json` and download `font-icon.zip` archive

4. Replace font files with files from `font-icon.zip/fonts`

5. Update `:before` rules in `_font-icon.scss` with rules from `font-icon.zip/styles.css`

6. Edit sprite config in `font-icon.phantomjs.coffee` and render sprite using `grunt sprite`

7. Update sprite rules across scss-files manually

8. (optional) Pray for automation