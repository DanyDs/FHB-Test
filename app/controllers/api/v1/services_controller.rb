class Api::V1::ServicesController < ApplicationController

def index
  idCom = getUserCompany
  # @company = Company.find(idCom)
  @services = Service.where(["company_id = ?", idCom])

  respond_to do |format|
      format.json { render :json => @services }
      format.html
  end
end

def show
  @service = Service.find(params[:id])
  respond_to do |format|
      format.json { render :json => @service }
      format.html
  end
end

def new
  @service = Service.new
end

def update
  @service = Service.find_by(id: params[:id])
  save_image params[:serviceData], "public/image_store/service#{ @service.id }.gif"
  @service.update(commercial_name: params[:commercial_name], certification: params[:certification],
                  tariff_position: params[:tariff_position], description: params[:description], category_id: params[:category_id])
end

def create
  if not(isUserAuthenticated and isUserRole('empresa'))
    throwUnauthorized
    return
  end

  @service = Service.new(services_params)
  @service.company_id = getUserCompany
  respond_to do |format|
    if @service.save
      save_image params[:serviceData], "public/image_store/service#{ @service.id }.gif"
      @service.update(image_path: '/image_store/service' + @service.id.to_s + '.gif')
      format.html { render :show, notice: ''}
      format.json { render json: @service }

    else
      format.html { render :show}
      format.json { render json: @service.errors, status: :unprocessable_entity }

    end
  end
end

def destroy
  if not(isUserAuthenticated and isUserRole('empresa'))
    throwUnauthorized
    return
  end
    @service = Service.find(params[:id])
    @service.destroy

    respond_to do |format|
      format.html { redirect_to services_url }
      format.json { render status: :ok, json: {} }
    end
end

def lastfifty
  @services = Service.join_with_company.where(companies: {status: true}).last(50)
  respond_to do |format|
      format.json { render :json => @services }
      format.html
  end
end

  def listByCategory

    @services = Service.joins(:company).select('services.*, companies.name as company_name').where(category_id: params[:categoryId])

    respond_to do |format|
      format.json { render :json => @services }
    end
  end

  def services_params
    params.permit(:feature, :commercial_name, :description, :category_id,
                                     :image_path, :tariff_position, :certification,
                                     :visibility_state, :company_id)
  end
end
