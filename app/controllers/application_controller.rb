class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
 # allow_browser versions: :modern
 protect_from_forgery with: :exception
 skip_before_action :verify_authenticity_token, if: -> { request.format.json? }

end
