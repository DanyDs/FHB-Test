class SearchController < ApplicationController
  layout "visitor"

  def index
    if params[:letter].size !=0
        @products = Product.search_by_letter(params[:letter])
        @services = Service.search_by_letter(params[:letter])
        @companies = Company.search_by_letter(params[:letter])
        if params[:departments].size !=0 && params[:letter].size !=0
          @products = Product.search_with_letter_and_departament(params[:letter],params[:departments])
          @services = Service.search_with_letter_and_departament(params[:letter],params[:departments])
          @companies = Company.search_with_letter_and_departament(params[:letter],params[:departments])
        end
    elsif params[:departments].size !=0
          @products = Product.search_by_department(params[:departments])
          @services = Service.search_by_department(params[:departments])
          @companies = Company.search_by_department(params[:departments])
          if params[:search].size !=0 && params[:departments].size !=0
            @products = Product.search_with_word_and_departament(params[:search],params[:departments])
            @services = Service.search_with_word_and_departament(params[:search],params[:departments])
            @companies = Company.search_with_word_and_departament(params[:search],params[:departments])
          end
    else
          if params[:search] == ""
              @products = []
              @services = []
              @companies = []
          else
              @products = Product.search_by_word(params[:search]).order("created_at DESC")
              @services = Service.search_by_word(params[:search]).order("created_at DESC")
              @companies = Company.search_by_word(params[:search]).order("created_at DESC")
          end
    end


      @products_count = @products.size
      @services_count = @services.size
      @companies_count = @companies.size
  end

end
