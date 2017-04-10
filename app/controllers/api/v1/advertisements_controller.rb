class Api::V1::AdvertisementsController < ApplicationController
  def index
    @advertisements = Advertisement.where( :isPublicized => true )

    render json: @advertisements
  end

  def acceptDecline
    @advertisementIds = Advertisement.where(:state => 'Pendiente').where( :isPublicized => true )
    render json: @advertisementIds
  end

  def decline
     @advertisement = Advertisement.find(params[:id])
     @advertisement.update(reason: params[:reason])
     @advertisement.state = "Rechazada"
     @advertisement.save
     if @advertisement.save
      redirect_back fallback_location: "/supervisor/acceptDecline"
     else
      render json: @advertisement.errors, status: :unprocessable_entity
     end
  end
  def accept
     @advertisement = Advertisement.find(params[:id])
     @advertisement.state = "Aceptada"
     if @advertisement.save
      redirect_back fallback_location: "/supervisor/acceptDecline"
     else
      render json: @advertisement.errors, status: :unprocessable_entity
     end
  end
  def new
    @advertisement = Advertisement.new
  end

  def create
    if not (isUserAuthenticated and isUserRole('empresa'))
      throwUnauthorized
      return
    end

    Advertisement.transaction do
      @advertisement = Advertisement.new(advertisements_params)
      @advertisement.id_Company = getUserCompany
      compName = Company.find(getUserCompany)

      @advertisement.companyName= compName.name

      @advertisement.isPublicized = true
      @advertisement.state = "Pendiente"

      respond_to do |format|
        if @advertisement.save
          save_image params[:announcementData], "public/image_store/announcement_#{ @advertisement.id }.gif"

          format.json { render status: :ok, json: @advertisement }
        else
          format.json { render json: @advertisement.errors, status: :unprocessable_entity }
        end
      end

    end
  end

  def destroy
    @advertisement = Advertisement.find(params[:id])
    @advertisement.isPublicized = false
    @advertisement.save

    render json: {}, status: :ok
  end

  def update
    @advertisement = Advertisement.find_by(id: params[:id])
    save_image params[:announcementData], "public/image_store/announcement_#{ @advertisement.id }.gif"

    @advertisement.update(advertisements_params)
    @advertisement.state = "Pendiente"
    @advertisement.save
  end

  def visualize_ads
    @advertisementIds = Advertisement.where(:state => 'Aceptada').where( :isPublicized => true )
    render json: @advertisementIds
  end

  def listByCompany
    advertisements = Advertisement.where(id_Company: params[:companyId]).where( :isPublicized => true )

    render json: advertisements
  end

  private
  def advertisements_params
    params.require(:advertisement).permit(:description, :id_Company,
                                          :isPublicized, :publicationDate, :expirationDate, :image, :state, :reason,
                                          :companyName)
  end
end
