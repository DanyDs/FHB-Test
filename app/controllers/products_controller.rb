class ProductsController < ApplicationController
  layout :resolve_layout

  def index

    idCom = getUserCompany
    # @company = Company.find(idCom)
    @products = Product.where(["company_id = ?", idCom])
  end

  def show
      @product = Product.find(params[:id])
      @statistics_product = StatisticsProduct.new
      @statistics_product.visit_count=1
      @statistics_product.product_id=@product.id
      @statistics_product.visit_date=Date.current.to_s
      @statistics_product.save
  end


  private
    def products_params
      params.require(:product).permit(:id, :commercial_name, :feature, :description, :category_id,
                                       :tariff_position, :certification, :visibility_state, :image)
    end

    def resolve_layout
      case action_name
        when "show"
          "visitor"
        when "index"
          "company"
        else
          "company"
      end
    end
end
