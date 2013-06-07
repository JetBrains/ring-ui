require 'rubygems'
require 'compass'
require 'compass/exec'

return_value = Compass::Exec::SubCommandUI.new(ARGV).run!
exit if return_value != 0
