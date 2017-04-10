class AddDownedDateToCompanies < ActiveRecord::Migration[5.0]
  def change
    add_column :companies, :downed_date, :date
  end
end
