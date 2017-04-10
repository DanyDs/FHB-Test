class Api::V1::StatisticsCompaniesController < ApplicationController


  def index

     @Fecha =params[:fecha]
     if @Fecha
       @EstadisticasC = Company.joins(:statistics_companies).group("companies.id, statistics_companies.company_id").select("companies.*, count(statistics_companies.id) as contador").where("visit_date >= ?", params[:fecha]).order('contador DESC').take(20).collect{|x| [x.name, x.contador]}
     else
       @Fecha = " el Inicio del Sistema"
       @EstadisticasC = Company.joins(:statistics_companies).group("companies.id, statistics_companies.company_id").select("companies.*, count(statistics_companies.id) as contador").order('contador DESC').take(20).collect{|x| [x.name, x.contador]}
     end
      respond_to do |format|
          format.json { render :json => @EstadisticasC }
          format.html
      end

  end

  # GET /statistics_companies/1.json
  def show
    @statistics_company = StatisticsCompany.find(params[:id])
    respond_to do |format|
        format.json { render :json => @statistics_company }
        format.html
    end

  end

  def new
    @statistics_company = StatisticsCompany.new
  end

  def edit
  end

  # POST /statistics_companies.json
  def create
    @statistics_company = StatisticsCompany.new(statistics_companies_params)

    respond_to do |format|
      if @statistics_company.save
        format.html { render :show, notice: ''}
        format.json { render json: @statistics_company }

      else
        format.html { render :show}
        format.json { render json: @statistics_company.errors, status: :unprocessable_entity }

      end

    end
  end

  # PATCH/PUT /statistics_companies/1.json
  def update
    respond_to do |format|
      if @statistics_company.update(statistics_companies_params)
        format.html { render :show, notice: '' }
        format.json { render json: @statistics_company }
        #render json: @statistics_company, status: :ok
      else
        format.html { render :new }
        format.json { render json: @statistics_company }
        #render json: @statistics_company.errors, status: :unprocessable_entity
      end
    end
  end

  # DELETE /statistics_companies/1.json
  def destroy
    @statistics_company.destroy
    respond_to do |format|
      #format.html { render :index, notice: '' }
      format.json { head :no_content }
    end
  end

  private

    def statistics_companies_params
      params.require(:statistics_company).permit(:visit_date, :visit_count, :company_id)
    end
end
