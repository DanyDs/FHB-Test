class StatisticsCompaniesController < ApplicationController
  layout :resolve_layout
  def indexS

   @Fecha =params[:fecha]
   if @Fecha
     @mensaje = " a "
     @FechaF= params[:fechaF]
     @EstadisticasC = Company.joins(:statistics_companies).group("companies.id, statistics_companies.company_id").select("companies.*, count(statistics_companies.id) as contador").where("visit_date >= ? and visit_date <= ? ", params[:fecha], params[:fechaF]).order('contador DESC').take(20).collect{|x| [x.name, x.contador]}
   else
     @FechaF = Date.current.to_s
     @Fecha= ((Date.current)-30).to_s  # resta 1 semana
     @mensaje = " a "
     @EstadisticasC = Company.joins(:statistics_companies).group("companies.id, statistics_companies.company_id").select("companies.*, count(statistics_companies.id) as contador").where("visit_date >= ? and visit_date <= ? ", @Fecha, @FechaF).order('contador DESC').take(20).collect{|x| [x.name, x.contador]}
   end
  end

  def indexA

   @Fecha =params[:fecha]
   if @Fecha
     @mensaje = " a "
     @FechaF= params[:fechaF]
     @EstadisticasC = Company.joins(:statistics_companies).group("companies.id, statistics_companies.company_id").select("companies.*, count(statistics_companies.id) as contador").where("visit_date >= ? and visit_date <= ? ", params[:fecha], params[:fechaF]).order('contador DESC').take(20).collect{|x| [x.name, x.contador]}
   else
     @FechaF = Date.current.to_s
     @Fecha= ((Date.current)-30).to_s  # resta 1 semana
     @mensaje = " a "
     @EstadisticasC = Company.joins(:statistics_companies).group("companies.id, statistics_companies.company_id").select("companies.*, count(statistics_companies.id) as contador").where("visit_date >= ? and visit_date <= ? ", @Fecha, @FechaF).order('contador DESC').take(20).collect{|x| [x.name, x.contador]}
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
