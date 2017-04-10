class AddContactnameToCompanies < ActiveRecord::Migration[5.0]
  def change
        add_column :companies, :contactName, :string
  end
end
