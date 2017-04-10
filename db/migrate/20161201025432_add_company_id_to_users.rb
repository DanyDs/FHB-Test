class AddCompanyIdToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :companyId, :integer
  end
end
