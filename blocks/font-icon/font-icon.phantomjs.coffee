# Config
outFile   = 'blocks/font-icon/font-icon.png'
tmpFile   = 'tmp/sprite.html'
styleFile = '../dist/ring.css'

icons = [
    name: 'help'
    color: '000000'
    active: 'ff5900'
    size: 16
  ,
    name: 'search'
    color: 'cccccc'
    active: 'cccccc'
    size: 16
  ,
    name: 'ban-circle'
    color: '000000'
    active: 'ff5900'
    size: 14
  ,
    name: 'help'
    color: '3c74c2'
    active: 'ff5900'
    size: 16
]

iconSize = 20

# Prepare html and css
fs = require 'fs'

htmlIcons       = ''
htmlActiveIcons = ''
length          = 0

for icon in icons
  length++ # Count icons
  htmlActiveIcons += "<span class='ring-font-icon ring-font-icon_#{icon.name}' style='color: \##{icon.active}; font-size: #{icon.size}px;'></span>"
  htmlIcons       += "<span class='ring-font-icon ring-font-icon_#{icon.name}' style='color: \##{icon.color}; font-size: #{icon.size}px;'></span>"

html = """
 <html>
   <link rel='stylesheet' type='text/css' href='#{styleFile}' />

   <style>
    body {
      margin: 0;
    }
    .ring-font-icon {
      text-align: center;
      display: inline-block;
      width: #{iconSize}px;
      height: #{iconSize}px;
      vertical-align: middle;
    }
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
