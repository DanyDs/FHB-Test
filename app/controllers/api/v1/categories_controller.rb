class Api::V1::CategoriesController < ApplicationController
 
  # GET /categories
  # GET /categories.json
  def index
    @categories = Category.where(category_id: nil).order(:name)
    respond_to do |format|
      format.json { render :json => @categories }
    end
  end

  # GET /categories/1
  # GET /categories/1.json
  def show
    @categories = Category.where(category_id: params[:id])
    respond_to do |format|
      format.json { render :json => @categories }
    end
    #@category = Category.find(params[:id])

    #respond_to do |format|
    #  format.json { render :json => @category }
    #  format.html # index.html.erb
    #end
  end

  # GET /categories/new
  def new
    if not(isUserAuthenticated and isUserRole('general'))
      throwUnauthorized
      return
    end

    @category = Category.new
  end

  # PUT /categories/1
  def update
    if not(isUserAuthenticated and isUserRole('general'))
      throwUnauthorized
      return
    end

    @category = Category.find_by(id: params[:id])
    @category.update(name: params[:name])
  end

  # POST /categories.json
  def create
    if not(isUserAuthenticated and isUserRole('general'))
      throwUnauthorized
      return
    end

    @category = Category.new(category_params)

    respond_to do |format|
      if @category.save
        format.json { render status: :ok, json: @category } #{ render action: 'show', status: :created, location: @category }
      else
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /categories/1
  def destroy
    if not(isUserAuthenticated and isUserRole('general'))
      throwUnauthorized
      return
    end

    @category = Category.find(params[:id])
    @category.destroy

    respond_to do |format|
      format.json { render status: :ok, json: {} }
    end
  end

  def tree
    @categories = select_categories_as_tree(Category.where(category_id: nil).order(:name), 0)
    respond_to do |format|
      format.json { render status: :ok, json: @categories.to_json( :only => [:id, :name] )}
    end
  end

private
  def category_params
    params.permit(:name, :id, :category_id)
  end

  def select_categories_as_tree(items, depth = 0)
    result = []

    items.each do |item|
      item.name = "#{'  ' * depth}#{item.name}"

      result.append item

      sub_items = Category.where(category_id: item.id)
      result += select_categories_as_tree(sub_items, depth + 1)
    end

    result
  end

end
