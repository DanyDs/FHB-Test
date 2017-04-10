class AddCertificationToProducts < ActiveRecord::Migration[5.0]
  def change
    add_column :products, :certification, :string
  end
end
