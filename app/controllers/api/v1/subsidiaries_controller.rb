class Api::V1::SubsidiariesController < ApplicationController
  before_action :set_subsidiary, only: [:show, :edit, :update, :destroy]


  def index
    @subsidiaries = Subsidiary.all
  end

  def show
    @subsidiaries = Subsidiary.where(company_id: params[:id])
    respond_to do |format|
      format.json { render :json => @subsidiaries }
      format.html
    end
  end


  def new
    @subsidiary = Subsidiary.new
  end


  def edit
  end


  def create
    @subsidiary = Subsidiary.new(subsidiary_params)

    respond_to do |format|
      if @subsidiary.save
        format.html { redirect_to @subsidiary, notice: 'Subsidiary was successfully created.' }
        format.json { render :show, status: :created, location: @subsidiary }
      else
        format.html { render :new }
        format.json { render json: @subsidiary.errors, status: :unprocessable_entity }
      end
    end
  end


  def update
    respond_to do |format|
      if @subsidiary.update(subsidiary_params)
        format.html { redirect_to @subsidiary, notice: 'Subsidiary was successfully updated.' }
        format.json { render :show, status: :ok, location: @subsidiary }
      else
        format.html { render :edit }
        format.json { render json: @subsidiary.errors, status: :unprocessable_entity }
      end
    end
  end


  def destroy
    @subsidiary.destroy
    respond_to do |format|
      format.html { redirect_to subsidiaries_url, notice: 'Subsidiary was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    def set_subsidiary
      @subsidiary = Subsidiary.find(params[:id])
    end

    def subsidiary_params
      params.require(:subsidiary).permit(:company_id, :address,:auxId)
    end
end
