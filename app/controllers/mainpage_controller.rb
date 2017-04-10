class MainpageController < ApplicationController
  layout :resolve_layout

  def index
  end

  def show
  end

  def QuienesSomos
  end

  def terminosYcondiciones
  end

  private
  def resolve_layout
    case action_name
      when "terminosYcondiciones"
        if request.fullpath.match(/^\/company/) != nil
          return "company"
        else
          return "visitor"
        end
      else
        return "visitor"
    end
  end
end
