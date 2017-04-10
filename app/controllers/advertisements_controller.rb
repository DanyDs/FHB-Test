class AdvertisementsController < ApplicationController
  layout :resolve_layout

  def index
    @advertisements = Advertisement.all
    @UserCompany= getUserCompany
    respond_to do |format|
      # format.json { render :json => @advertisements }
      format.html # index.html.erb
    end
  end

  def show
    @advertisement = Advertisement.find(params[:id])
     #render json: @advertisement
  end

  def update
    respond_to do |format|
        if @advertisement.update(params[:reason])
          @advertisement.state = "Rechazada"
          @advertisement.save
          redirect_back fallback_location: "/supervisor/acceptDecline"
        else
          # render json: @advertisement.errors, status: :unprocessable_entity
        end
      end
  end
# Vista de visitantes
  def visualize_ads
    @advertisementIds = Advertisement.where(["state = ?", "Aceptada"])

    respond_to do |format|
      #  format.json { render :json => @advertisementIds }
      format.html # index.html.erb
    end
  end
# Vistas de empresa
  def requestedAdsAsCompany
    @advertisements = Advertisement.all
    @UserCompany= getUserCompany
    respond_to do |format|
      # format.json { render :json => @advertisements }
      format.html # index.html.erb
    end
  end
  def asCompanyAcceptedAds
    @advertisements = Advertisement.all
    @UserCompany= getUserCompany
    respond_to do |format|
      # format.json { render :json => @advertisements }
      format.html # index.html.erb
    end
  end
  def asCompanyRejectedAds
    @advertisements = Advertisement.all
    @UserCompany= getUserCompany
    respond_to do |format|
      # format.json { render :json => @advertisements }
      format.html # index.html.erb
    end
  end

# Vistas supervisor
def asRegionalAcceptedAds
  @advertisementIds = Advertisement.all
   respond_to do |format|
    # format.json { render :json => @advertisementIds }
    format.html # index.html.erb
  end
end
def asRegionalAvailableAds
  @advertisementIds = Advertisement.all
   respond_to do |format|
    format.json { render :json => @advertisementIds }
    format.html # index.html.erb
  end
end
private
    def resolve_layout
      case action_name
      when "acceptDecline"
          "supervisor"
      when "asRegionalAcceptedAds"
          "supervisor"
      when "asRegionalAvailableAds"
          "supervisor"
      when "index"
         "company"
      when "requestedAdsAsCompany"
         "company"
      when "asCompanyAcceptedAds"
         "company"
      when "asCompanyRejectedAds"
        "company"
      when "visualize_ads"
        "visitor"
      end
    end

    def advertisements_params
      params.require(:advertisement).permit(:description, :id_Company,
                                            :isPublicized, :publicationDate, :expirationDate, :image, :state, :reason)
    end


end
