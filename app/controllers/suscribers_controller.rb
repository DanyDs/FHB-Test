class SuscribersController < ApplicationController
  before_action :set_suscriber, only: [:show, :edit, :update, :destroy]


  def index
    @suscribers = Suscriber.all
    respond_to do |format|
      format.json { render :json => @suscribers }
      format.html
    end
  end
end
