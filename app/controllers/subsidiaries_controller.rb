class SubsidiariesController < ApplicationController


  def index
    @subsidiaries = Subsidiary.all
    respond_to do |format|
      format.json { render :json => @subsidiaries }
      format.html
    end
  end
end
