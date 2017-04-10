class GuidesController <ApplicationController
  layout :resolve_layout

  def index
      @guides = Guide.all
      respond_to do |format|
        format.json {render :json => @guides}
        format.html # index.html.erb
      end
  end

  def resolve_layout
    case action_name
      when "index"
        if request.fullpath.match(/^\/company/) != nil
          return "company"
        else
          return "visitor"
        end
      when "guidesGestion"
        "administrator"
    end
  end
end
