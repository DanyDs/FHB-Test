class CompaniesController < ApplicationController
   layout :resolve_layout
def inici
end

def index
  @companies = Company.all
  @companies.each do |company|
    company.created_at=company.created_at.to_date.strftime("%B %d, %Y")
  end
  respond_to do |format|
    format.json { render :json => @companies }
    format.html # index.html.erb
  end
end
def new
end
def show
  @company = Company.find(params[:id])
  respond_to do |format|
      format.json { render :json => @company }
      format.html # index.html.erb
    end
end
def showSupervisor
  @company = Company.find(params[:id])
end
def create
    @params= params
    if verify_recaptcha()
           ContactMailer.contact_send(params).deliver
           flash[:alert] = "El mensaje se envío correctamente!"
               redirect_to :back
    else
      flash[:alert] = "Debe verificar que no sea un robot antes de enviar el mensaje!"
          redirect_to :back

         end

end

def showVisitor
  @company = Company.find(params[:id])
  @statistics_company = StatisticsCompany.new
  @statistics_company.visit_count=1
  @statistics_company.company_id=@company.id
  @statistics_company.visit_date=Date.current.to_s
  @statistics_company.save
  @company = Company.find(params[:id])
  respond_to do |format|
      format.json { render :json => @company }
      format.html # index.html.erb
  end
end
def profile
  @company=Company.find(getUserCompany)
  respond_to do |format|
      format.json { render :json => @company }
    end
end
def departments
  @companies=Company.all
  @companies.each do |company|
    company.created_at=company.created_at.to_date.strftime("%B %d, %Y")
  end
  respond_to do |format|
    format.json { render :json => @companies }
    format.html # index.html.erb
  end
end

private
    # Never trust parameters from the scary internet, only allow the white list through.
    def company_params
      params.require(:company).permit(:name,:email,:nit, :nitimage, :logo,:address,:telephone,:status,:department,:detail,:rubro,:webpage,:contactName,:downed,:requested,:subsidiaries,:downed_reason,:downd_date, :image)
    end
    def company_params_for_edit
      params.require(:company).permit(:name,:email,:address,:logo,:telephone,:department,:status,:downed,:requested,:nitimage)
    end

   def resolve_layout
     case action_name
       when "showVisitor"
         "visitor"
       when "new"
         "visitor"
       when "index"
         "supervisor"
       when "getDowned"
         "supervisor"
       when "requests"
         "supervisor"
       when "show"
         "company"
       when "manage"
         "company"
       when "showSupervisor"
         "supervisor"
       when "departments"
         "supervisor"
       else
         "company"
     end
   end
end
