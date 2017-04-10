class Api::V1::SuscribersController < ApplicationController
  before_action :set_suscriber, only: [:show, :edit, :update, :destroy]

@@number=1000000
  def index
    @suscribers = Suscriber.all
    respond_to do |format|
      format.json { render :json => @suscribers }
      format.html # index.html.erb
    end
  end


  def show
    @suscribers = Suscriber.where(id: params[:id])
    respond_to do |format|
      format.json { render :json => @suscribers }
      format.html # index.html.erb
    end
  end


  def new
    @suscriber = Suscriber.new
  end

  def edit
  end


  def create

    @suscriber = Suscriber.new(suscriber_params)

    @suscriber.code=@@number
    @@number=@@number+1
    respond_to do |format|
      if @suscriber.save
         UserMailer.welcome_email_suscribers(@suscriber).deliver_now

        format.html { redirect_to @suscriber, notice: 'Suscriber was successfully created.' }
        format.json { render :show, status: :created, location: @suscriber }
      else
        format.html { render :new }
        format.json { render json: @suscriber.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @suscriber.update(suscriber_params)
        format.html { redirect_to @suscriber, notice: 'Suscriber was successfully updated.' }
        format.json { render :show, status: :ok, location: @suscriber }
      else
        format.html { render :edit }
        format.json { render json: @suscriber.errors, status: :unprocessable_entity }
      end
    end
  end


  def destroy
    @suscriber.destroy
    respond_to do |format|
      format.html { redirect_to suscribers_url, notice: 'Suscriber was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

    def set_suscriber
      @suscriber = Suscriber.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def suscriber_params
      params.require(:suscriber).permit(:email, :code)
    end
end
