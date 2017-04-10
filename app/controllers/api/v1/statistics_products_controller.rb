class Api::V1::StatisticsProductsController < ApplicationController
  #respond_to :html, :xml, :json
  #respond_to :json

  def index
    @statistics_products = StatisticsProduct.all
    #render json: @statistics_products
    respond_to do |format|
        format.json { render :json => @statistics_products }
        format.html
    end
  end

  # GET /statistics_products/1.json
  def show
    @statistics_product = StatisticsProduct.find(params[:id])
    respond_to do |format|
        format.json { render :json => @statistics_product }
        format.html
    end

  end

  def new
    @statistics_product = StatisticsProduct.new
  end

  def edit
  end

  # POST /statistics_products.json
  def create
    @statistics_product = StatisticsProduct.new(statistics_products_params)

    respond_to do |format|
      if @statistics_product.save
        format.html { render :show, notice: ''}
        format.json { render json: @statistics_product }

      else
        format.html { render :show}
        format.json { render json: @statistics_product.errors, status: :unprocessable_entity }

      end
    end
  end

  # PATCH/PUT /statistics_products/1.json
  def update
    respond_to do |format|
      if @statistics_product.update(statistics_products_params)
        format.html { render :show, notice: '' }
        format.json { render json: @statistics_product }
        #render json: @statistics_product, status: :ok
      else
        format.html { render :new }
        format.json { render json: @statistics_product }
        #render json: @statistics_product.errors, status: :unprocessable_entity
    end
  end

  # DELETE /statistics_products/1.json
  def destroy
    @statistics_product.destroy
    respond_to do |format|
      #format.html { redirect_to bands_url, notice: 'Band was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    def statistics_products_params
      params.require(:statistics_product).permit(:visit_date, :visit_count, :product_id)
    end

  end

end
