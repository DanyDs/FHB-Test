class StatisticsProductsController < ApplicationController
    #respond_to :html, :xml, :json
    #respond_to :json
      layout :resolve_layout
    def indexA
      @FechaP =params[:fechaP]
      if @FechaP
          @mensaje = " a "
          @FechaPF= params[:fechaPF]
          @EstadisticasProduct = Product.joins(:statistics_products).group("products.id, statistics_products.product_id").select("products.*, count(statistics_products.id) as contador").where("visit_date >= ? and visit_date <= ?", params[:fechaP],params[:fechaPF] ).order('count(statistics_products.id) DESC').take(20).collect{|x| [x.commercial_name, x.contador]}
      else
         @FechaPF = Date.current.to_s
         @FechaP= ((Date.current)-30).to_s  # resta 1 semana
         @mensaje = " a "
         @EstadisticasProduct = Product.joins(:statistics_products).group("products.id, statistics_products.product_id").select("products.*, count(statistics_products.id) as contador").where("visit_date >= ? and visit_date <= ?", @FechaP,@FechaPF).order('count(statistics_products.id) DESC').take(20).collect{|x| [x.commercial_name, x.contador]}
      end
    end

    def indexS
      @FechaP =params[:fechaP]
      if @FechaP
          @mensaje = " a "
          @FechaPF= params[:fechaPF]
          @EstadisticasProduct = Product.joins(:statistics_products).group("products.id, statistics_products.product_id").select("products.*, count(statistics_products.id) as contador").where("visit_date >= ? and visit_date <= ?", params[:fechaP],params[:fechaPF] ).order('count(statistics_products.id) DESC').take(20).collect{|x| [x.commercial_name, x.contador]}
      else
         @FechaPF = Date.current.to_s
         @FechaP= ((Date.current)-30).to_s  # resta 1 semana
         @mensaje = " a "
         @EstadisticasProduct = Product.joins(:statistics_products).group("products.id, statistics_products.product_id").select("products.*, count(statistics_products.id) as contador").where("visit_date >= ? and visit_date <= ?", @FechaP,@FechaPF).order('count(statistics_products.id) DESC').take(20).collect{|x| [x.commercial_name, x.contador]}
      end
    end
    private

      def statistics_products_params
        params.require(:statistics_product).permit(:visit_date, :visit_count, :product_id)
      end

      def resolve_layout
        case action_name
        when "indexA"
            "administrator"
        when "indexS"
            "supervisor"
        end
      end

end
