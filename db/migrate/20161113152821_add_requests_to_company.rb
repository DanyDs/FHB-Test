class AddRequestsToCompany < ActiveRecord::Migration[5.0]
  def change
    add_column :companies, :requested, :boolean
  end
end
