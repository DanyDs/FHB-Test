class AddRubroToCompany < ActiveRecord::Migration[5.0]
  def change
    add_column :companies, :rubro, :string
  end
end
