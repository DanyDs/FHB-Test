class AddDetailToCompany < ActiveRecord::Migration[5.0]
  def change
    add_column :companies, :detail, :string
  end
end
