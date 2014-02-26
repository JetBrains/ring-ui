Icon set update with Icomoon
----------------------------

In 9 simple steps:

1. Use font-icon.json to restore projects at http://icomoon.io/app/#/projects

2. Edit icon set there (upload svgs or choose icons from Font Awesome or other sets)

3. Save projects to `font-icon.json` and download `font-icon.zip` archive

4. Replace font files with files from `font-icon.zip/fonts`

5. Update `:before` rules in `_font-icon.scss` with rules from `font-icon.zip/styles.css`

6. Update styleguide modifiers with new icons in `_font-icon.scss`

7. Add icons to fallback list in `font-icon.js`

  AND / OR

8. (For round icons, which render bad on Windows)

   Edit sprite config in `font-icon.phantomjs.coffee`,
   render sprite using `grunt sprite` and update sprite rules across scss-files manually

9. (optional) Pray for automation