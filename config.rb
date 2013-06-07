sass_dir = '.'
css_dir = '.'
images_dir = '.'
output_style = (environment == :production) ? :compressed : :expanded
sass_options = {:cache => false} if environment == :production