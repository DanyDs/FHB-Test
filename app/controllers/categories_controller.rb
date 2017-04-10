class CategoriesController < ApplicationController
  layout :resolve_layout

  def admin
    @categories = Category.where(category_id: nil)

    respond_to do |format|
      format.html
    end
  end



private

  def resolve_layout
    case action_name
      when "admin"
        "administrator"
      else
        "visitor"
    end
  end
end
