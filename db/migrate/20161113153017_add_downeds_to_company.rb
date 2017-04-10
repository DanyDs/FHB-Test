class AddDownedsToCompany < ActiveRecord::Migration[5.0]
  def change
    add_column :companies, :downed, :boolean
  end
end
