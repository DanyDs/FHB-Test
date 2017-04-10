class Api::V1::SearchController < ApplicationController

  def index


      if params[:letter].nil?!=true
          @products = Product.search_by_letter(params[:letter])
          @services = Service.search_by_letter(params[:letter])
          @companies = Company.search_by_letter(params[:letter])
          if params[:departments].nil?!=true && params[:letter].nil?!=true
            @products = Product.search_with_letter_and_departament(params[:letter],params[:departments])
            @services = Service.search_with_letter_and_departament(params[:letter],params[:departments])
            @companies = Company.search_with_letter_and_departament(params[:letter],params[:departments])
          end
      elsif params[:departments].nil?!=true
            @products = Product.search_by_department(params[:departments])
            @services = Service.search_by_department(params[:departments])
            @companies = Company.search_by_department(params[:departments])
            if params[:search].nil?!=true && params[:departments].nil?!=true
              @products = Product.search_with_word_and_departament(params[:search],params[:departments])
              @services = Service.search_with_word_and_departament(params[:search],params[:departments])
              @companies = Company.search_with_word_and_departament(params[:search],params[:departments])
            end
      else
          @products = Product.search_by_word(params[:search]).order("created_at DESC")
          @services = Service.search_by_word(params[:search]).order("created_at DESC")
          @companies = Company.search_by_word(params[:search]).order("created_at DESC")
      end
      respond_to do |format|
          format.json { render :json => {:products => @products,
                                         :services => @services,
                                         :companies => @companies}}
      end
  end

end
