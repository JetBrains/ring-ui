# Config
blockPath = 'blocks/font-icon/'
outFile   = blockPath + 'font-icon.png'
tmpFile   = blockPath + 'tmp.html'
styleFile = blockPath + '_font-icon.scss'

icons = [
    name: 'cog'
    color: '3c74c2'
    size: 18
  ,
    name: 'help'
    color: '3c74c2'
    size: 14
  ,
    name: 'search'
    color: 'd1d1d1'
    size: 14
  ,
    name: 'caret-down'
    color: 'b4b4b4'
    size: 14
  ,
    name: 'caret-down'
    color: '000000'
    size: 14
  ,
    name: 'caret-up'
    color: '000000'
    size: 14
  ,
    name: 'chevron-right'
    color: '000000'
    size: 14
  ,
    name: 'ban-circle'
    color: '000000'
    size: 14
  ,
    name: 'pencil'
    color: '000000'
    size: 14
  ,
    name: 'remove'
    color: '000000'
    size: 14
  ,
    name: 'plus'
    color: '000000'
    size: 14
  ,
    name: 'added'
    color: '7ad97d'
    size: 14
  ,
    name: 'modified'
    color: '6d99ee'
    size: 14
  ,
    name: 'removed'
    color: 'fb6a6a'
    size: 14
  ,
    name: 'renamed'
    color: '6d99ee'
    size: 14
  ,
    name: 'check'
    color: '000000'
    size: 14
]



iconSize = 20
activeColor = 'ff5900'

# Prepare html and css
fs = require 'fs'

fontStyles = fs.read(styleFile).replace(/#\{\$fonts\-dir}/g, '')

htmlIcons       = ''
htmlActiveIcons = ''
length          = 0

for icon in icons
  length++ # Count icons
  htmlActiveIcons += "<span class='ring-font-icon ring-font-icon_#{icon.name}' style='color: \##{activeColor}; font-size: #{icon.size}px;'></span>"
  htmlIcons       += "<span class='ring-font-icon ring-font-icon_#{icon.name}' style='color: \##{icon.color}; font-size: #{icon.size}px;'></span>"

html = """
 <html class='font-antialiasing'>
   <style>
    html, body {
      padding: 0;
      margin: 0;
    }
    .ring-font-icon {
      text-align: center;
      display: inline-block;
      width: #{iconSize}px;
      vertical-align: middle;
    }
    #{fontStyles}
   </style>
   <div>#{htmlIcons}</div>
   <div>#{htmlActiveIcons}</div>
 </html>
"""

# Render page
page = require('webpage').create()

page.clipRect =
  left: 0
  top: 0
  width: iconSize * length
  height: iconSize * 2

fs.write tmpFile, html

if fs.exists outFile
  fs.remove outFile

page.open tmpFile, () ->
  page.render outFile
  fs.remove tmpFile
  phantom.exit()
