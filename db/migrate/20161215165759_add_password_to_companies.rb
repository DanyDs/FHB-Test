class AddPasswordToCompanies < ActiveRecord::Migration[5.0]
  def change
    add_column :companies, :password, :string
  end
end
