class AddReasonToCompanies < ActiveRecord::Migration[5.0]
  def change
      add_column :companies, :reason, :text
  end
end
