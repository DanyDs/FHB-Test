class Api::V1::ProductsController < ApplicationController
  #respond_to :json

def index

  idCom = getUserCompany
  # @company = Company.find(idCom)
  @products = Product.where(["company_id = ?", idCom])
  respond_to do |format|
      format.json { render :json => @products }
      format.html
  end
  #render json: @products
end

def search
  #  index
  #  render :search
end

def show
  @product = Product.find(params[:id])
  respond_to do |format|
      format.json { render :json => @product }
      format.html
  end

end

def lastfifty
  @product = Product.join_with_company.where(companies: {status: true}).last(50)
  respond_to do |format|
      format.json { render :json => @product }
      format.html
  end
end

def new
  @product = Product.new
end

def update
  @product = Product.find_by(id: params[:id])
  save_image params[:productData], "public/image_store/product#{ @product.id }.gif"
  @product.update(commercial_name: params[:commercial_name], certification: params[:certification],
                  tariff_position: params[:tariff_position], description: params[:description], category_id: params[:category_id])

end

def create
  if not(isUserAuthenticated and isUserRole('empresa'))
    throwUnauthorized
    return
  end

  @product = Product.new(products_params)
  @product.company_id = getUserCompany
  respond_to do |format|
    if @product.save
      save_image params[:productData], "public/image_store/product#{ @product.id }.gif"
      @product.update(image_path: '/image_store/product' + @product.id.to_s + '.gif')
      format.html { redirect_to @product, notice: 'Product was successfully created.' }
      format.json { render status: :ok, json: @product }

    else
      format.html { render action: 'new' }
      format.json { render json: @product.errors, status: :unprocessable_entity }

    end

  end
end

def destroy
    @product = Product.find(params[:id])
    @product.destroy

    respond_to do |format|
      format.html { redirect_to products_url }
      format.json { render status: :ok, json: {} }
    end

end


  def listByCategory

    @products = Product.joins(:company).select('products.*, companies.name as company_name').where(category_id: params[:categoryId])
    respond_to do |format|
      format.json { render :json => @products }
    end
  end

#private
  def products_params
    params.permit(:feature, :commercial_name, :description, :category_id,
                  :image_path, :tariff_position, :certification,
                  :visibility_state, :company_id)
  end

end
