class UsersController < ApplicationController
  layout :resolve_layout
  def editUser
  end
  def editPassword
  end

  def resolve_layout
    case action_name
      when "editUser"
        if request.fullpath.match(/^\/company/) != nil
          return "company"
        end
        if request.fullpath.match(/^\/supervisor/) != nil
          return "supervisor"
        end
        if request.fullpath.match(/^\/administrator/) != nil
          return "administrator"
        end
     when "editPassword"
      if request.fullpath.match(/^\/company/) != nil
       return "company"
      end
      if request.fullpath.match(/^\/supervisor/) != nil
        return "supervisor"
      end
      if request.fullpath.match(/^\/administrator/) != nil
        return "administrator"
      end
      else
        "administrator"
    end
  end
end
