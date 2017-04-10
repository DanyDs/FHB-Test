class StatisticsServicesController < ApplicationController
    layout :resolve_layout
  def indexA
    #render json: @statistics_services
    #@EstadisticasService= StatisticsService.group(:service_id).sum(:visit_count)
    #@EstadisticasS = Service.includes(:statistics_services).group("statistics_services.service_id").pluck("services.commercial_name, sum(statistics_services.visit_count)")
    @FechaS =params[:fechaS]
    if @FechaS
      @mensaje = " a "
      @FechaSF =params[:fechaSF]
      @EstadisticasS = Service.joins(:statistics_services).group("services.id, statistics_services.service_id").select("services.*, count(statistics_services.id) as contador").where("visit_date >= ? and visit_date <= ?", params[:fechaS] , params[:fechaSF]).order('count(statistics_services.id) DESC').take(20).collect{|x| [x.commercial_name, x.contador]}
    else
      @FechaSF = Date.current.to_s
      @FechaS= ((Date.current)-30).to_s  # resta 1 semana
      @mensaje = " a "
      @EstadisticasS = Service.joins(:statistics_services).group("services.id, statistics_services.service_id").select("services.*, count(statistics_services.id) as contador").where("visit_date >= ? and visit_date <= ?", @FechaS, @FechaSF).order('count(statistics_services.id) DESC').take(20).collect{|x| [x.commercial_name, x.contador]}

    end
  end

  def indexS
    #render json: @statistics_services
    #@EstadisticasService= StatisticsService.group(:service_id).sum(:visit_count)
    #@EstadisticasS = Service.includes(:statistics_services).group("statistics_services.service_id").pluck("services.commercial_name, sum(statistics_services.visit_count)")
    @FechaS =params[:fechaS]
    if @FechaS
      @mensaje = " a "
      @FechaSF =params[:fechaSF]
      @EstadisticasS = Service.joins(:statistics_services).group("services.id, statistics_services.service_id").select("services.*, count(statistics_services.id) as contador").where("visit_date >= ? and visit_date <= ?", params[:fechaS] , params[:fechaSF]).order('count(statistics_services.id) DESC').take(20).collect{|x| [x.commercial_name, x.contador]}
    else
      @FechaSF = Date.current.to_s
      @FechaS= ((Date.current)-30).to_s  # resta 1 semana
      @mensaje = " a "
      @EstadisticasS = Service.joins(:statistics_services).group("services.id, statistics_services.service_id").select("services.*, count(statistics_services.id) as contador").where("visit_date >= ? and visit_date <= ?", @FechaS, @FechaSF).order('count(statistics_services.id) DESC').take(20).collect{|x| [x.commercial_name, x.contador]}

    end
  end
  private

    def resolve_layout
      case action_name
      when "indexA"
          "administrator"
      when "indexS"
          "supervisor"
      end
    end

end
