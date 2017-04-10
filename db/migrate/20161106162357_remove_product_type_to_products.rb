class RemoveProductTypeToProducts < ActiveRecord::Migration[5.0]
  def change
    remove_column :products, :product_type
  end
end
