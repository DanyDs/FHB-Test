class AddNitImageToCompanies < ActiveRecord::Migration[5.0]
  def change
    add_column :companies, :nitimage, :string
  end
end
