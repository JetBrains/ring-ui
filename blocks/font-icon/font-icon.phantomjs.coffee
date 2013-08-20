# Config
blockPath = 'blocks/font-icon/'
outFile   = blockPath + 'font-icon.png'
tmpFile   = blockPath + 'tmp.html'
styleFile = blockPath + '_font-icon.scss'

icons =
  'cog'          : ['3c74c2', 18]
  'help'         : ['3c74c2', 14]
  'search'       : ['d1d1d1', 14]
  'caret-down'   : ['b4b4b4', 14]
  'caret-up'     : ['000000', 14]
  'chevron-right': ['000000', 14]
  'ban-circle'   : ['000000', 14]
  'pencil'       : ['000000', 14]
  'remove'       : ['000000', 14]
  'plus'         : ['000000', 14]
  'modified'     : ['000000', 14]
  'removed'      : ['000000', 14]
  'renamed'      : ['000000', 14]
  'check'        : ['000000', 32]

iconSize = 20
activeColor = 'ff5900'

# Prepare html and css
fs = require 'fs'

fontStyles = fs.read(styleFile).replace(/#\{\$fonts\-dir}/g, '')

htmlIcons       = ''
htmlActiveIcons = ''
iconsSizes      = []
length          = 0

for icon, props of icons
  length++ # Count icons
  htmlIcons       += "<span class='ring-font-icon ring-font-icon_#{icon}' style='color: \##{props[0]}; font-size: #{props[1]}px; line-height: 18px !important;'></span>"
  htmlActiveIcons += "<span class='ring-font-icon ring-font-icon_#{icon}' style='color: \##{activeColor}; font-size: #{props[1]}px; line-height: 18px !important;'></span>"

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
