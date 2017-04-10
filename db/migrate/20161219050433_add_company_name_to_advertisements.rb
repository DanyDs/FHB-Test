class AddCompanyNameToAdvertisements < ActiveRecord::Migration[5.0]
  def change
    add_column :advertisements, :companyName, :string
  end
end
