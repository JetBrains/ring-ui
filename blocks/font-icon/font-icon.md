Icon set update with Icomoon
----------------------------

In 8 simple steps:

1. Use font-icon.json to restore session at http://icomoon.io/app/

2. Edit icon set there

3. Save session to font-icon.json and download icons archive

4. Replace font files with files from `archive/fonts`

5. Update `:before` rules in `_font-icon.scss` with rules from `archive/styles.css`

6. Edit sprite config in `font-icon.phantomjs.coffee` and render sprite using `grunt sprite`

7. Update sprite rules across scss-files manually

8. (optional) Pray for automation