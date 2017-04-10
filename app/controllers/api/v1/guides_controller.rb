class Api::V1::GuidesController <ApplicationController
  def index
      @guides = Guide.all
      respond_to do |format|
        format.json {render :json => @guides}
        format.html # index.html.erb
      end
  end

  def new
    @guide = Guide.new
  end

  def create
    if not(isUserAuthenticated and isUserRole('general'))
      throwUnauthorized
      return
    end

    @guide = Guide.new(guide_params)

    respond_to do |format|
      if @guide.save

        format.html { redirect_to @guide, notice: 'Guide was successfully created.' }
        format.json { render status: :ok, json: @guide } #{ render action: 'show', status: :created, location: @category }
      else
        format.html { render action: 'new' }
        format.json { render json: @guide.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    if not(isUserAuthenticated and isUserRole('general'))
      throwUnauthorized
      return
    end

    @guide = Guide.find_by(id: params[:id])
    @guide.update(name: params[:name], content: params[:content], title: params[:title])
  end

  def destroy
    if not(isUserAuthenticated and isUserRole('general'))
      throwUnauthorized
      return
    end

    @guide = Guide.find_by(id: params[:id])
    @guide.destroy
  end

  def guide_params
    params.permit(:name,:content,:id,:title)
  end
end
