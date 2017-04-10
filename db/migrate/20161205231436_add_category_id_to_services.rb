class AddCategoryIdToServices < ActiveRecord::Migration[5.0]
  def change
    add_column :services, :category_id, :integer
  end
end
