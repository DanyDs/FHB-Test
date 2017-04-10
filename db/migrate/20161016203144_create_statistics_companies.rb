class CreateStatisticsCompanies < ActiveRecord::Migration[5.0]
  def change
    create_table :statistics_companies do |t|
      t.date :visit_date
      t.integer :visit_count
      t.references :company, foreign_key: true

      t.timestamps
    end
  end
end
