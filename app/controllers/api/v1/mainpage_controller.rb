class Api::V1::MainpageController < ApplicationController

  def index
    @advertisementIds = Advertisement.where( :isPublicized => true).where( :state => 'Aceptada')

    render json: @advertisementIds
  end
end
