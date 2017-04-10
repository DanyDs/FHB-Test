class NewsController < ApplicationController
  layout :resolve_layout

  def index
    @news = News.all
    respond_to do |format|
      format.html
    end
  end

  def show
    @news = News.find(params[:id])
    respond_to do |format|
      format.html
    end
  end

  def new
    @news = News.new
  end

  #
  def edit
    @new= News.all.map { |notice| [notice.title, notice.id, notice.description, notice.location, notice.full, notice.date] }
  end

  #
  # # POST /companies
  # # POST /companies.json
  def create
    @news = News.new(news_params)

    if @news.save
      # format.html { redirect_to @new, notice: 'New was successfully created.' }
      # format.json { render :show, status: :created, location: @new }
    else
      # format.html { render :new }
      format.json { render json: @news.errors, status: :unprocessable_entity }
    end
    @delete = News.find_by id: @news.id
    @delete.destroy()
  end

  def update
    @news=News.find_by(id: params[:id])
    @news.update(title: params[:title], description: params[:description], date: params[:date])
  end

  #
  # # DELETE /news/1
  # # DELETE /news/1.json
  def destroy
    @news=News.find(params[:id])
    @news.destroy
    respond_to do |format|
      format.html { redirect_to news_url }
      format.json { render status: :ok, json: {} }
    end
  end

  def indexA
    @news = News.all
    @news.each do |notice|
      notice.created_at=notice.created_at.to_date.strftime("%B %d, %Y")
    end
    respond_to do |format|
      format.json { render :json => @news }
      format.html # index.html.erb
    end
  end

  def newsGestion
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_new
    @news = News.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def news_params
    params.require(:news).permit(:title, :description, :location, :full, :date, :created_at, :image)
  end

  def new_params_for_edit
    params.require(:news).permit(:title, :description, :date, :location)
  end

  def resolve_layout
    case action_name
      when "index"
        if request.fullpath.match(/^\/company/) != nil
          return "company"
        else
          return "visitor"
        end
      when "newsGestion"
        "administrator"
      when "new"
        "administrator"
    end
  end
end
