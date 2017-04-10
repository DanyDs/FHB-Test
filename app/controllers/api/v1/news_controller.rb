class Api::V1::NewsController < ApplicationController
    def index
        @news = News.all
        @news=@news.order('date DESC')
        respond_to do |format|
          format.json { render :json => @news }
        end
    end
    def indexA
      @news = News.all
      @news.each do |notice|
        notice.created_at=notice.created_at.to_date.strftime("%B %d, %Y")
      end
      respond_to do |format|
        format.json { render :json => @news }
      end
    end

    def show
      @news = News.where(new_id: params[:id])
      respond_to do |format|
        format.json { render :json => @news }
      end
    end

    def newsGestion
    end
    def new
      @new = News.new
    end
      #
      def edit
        @new= News.all.map {|notice| [notice.title, notice.id,notice.description,notice.location,notice.full,notice.date]}
      end
      #
      # # POST /companies
      # # POST /companies.json
    def create
      if not(isUserAuthenticated and isUserRole('general'))
        throwUnauthorized
        return
      end

      @new = News.new(news_params)
      respond_to do |format|
        if @new.save
          save_image params[:imageData], "public/image_store/notice_#{ @new.id }.gif"
          format.json { render json: @new }
        else
          format.json { render json: @new.errors, status: :unprocessable_entity }
        end
      end
    end

    def update
      if not(isUserAuthenticated and isUserRole('general'))
        throwUnauthorized
        return
      end

      @news=News.find_by(id: params[:id])
      if(params[:imageData]!=nil)
        save_image params[:imageData], "public/image_store/notice_#{ @news.id }.gif"
      end
      @news.update(title: params[:title],description: params[:description], date: params[:date],link: params[:link],hasImage: params[:hasImage])
    end

    #
    # # DELETE /news/1
    # # DELETE /news/1.json
    def destroy
      if not(isUserAuthenticated and isUserRole('general'))
        throwUnauthorized
        return
      end

      @new=News.find(params[:id])
      @new.destroy
      respond_to do |format|
        format.html { redirect_to news_url }
        format.json { render status: :ok, json: {}}
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_new
        @new = News.find(params[:id])
      end
      def save_image(base64content, path)
        content = base64content
        content = content.partition(',').last
        decode_base64_content = Base64.decode64(content)
        File.open(path, "wb") do |f|
          f.write(decode_base64_content)
        end
      end
      # Never trust parameters from the scary internet, only allow the white list through.
      def news_params
        params.require(:new).permit(:title,:description,:location,:full,:date,:created_at,:link,:imageData,:hasImage)
      end
      def new_params_for_edit
        params.require(:new).permit(:title,:description,:date,:location,:link,:imageData,:hasImage)
      end
end
