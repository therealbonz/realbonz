class HomeController < ApplicationController
    def index
      @props = { media: Medium.all.as_json }
    end
  end
  