class ServicesController < ApplicationController
  layout :resolve_layout

  def index
    idCom = getUserCompany
    # @company = Company.find(idCom)
    @services = Service.where(["company_id = ?", idCom])
  end

  def show
    @service = Service.find(params[:id])
    @statistics_service = StatisticsService.new
    @statistics_service.visit_count=1
    @statistics_service.service_id=@service.id
    @statistics_service.visit_date=Date.current.to_s
    @statistics_service.save
  end

  private
    def services_params
      params.require(:service).permit(:id, :commercial_name, :feature, :description,
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
