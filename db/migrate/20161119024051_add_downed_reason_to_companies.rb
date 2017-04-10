class AddDownedReasonToCompanies < ActiveRecord::Migration[5.0]
  def change
    add_column :companies, :downed_reason, :string
  end
end
