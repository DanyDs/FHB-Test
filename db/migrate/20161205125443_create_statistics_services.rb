class CreateStatisticsServices < ActiveRecord::Migration[5.0]
  def change
    create_table :statistics_services do |t|
      t.date :visit_date
      t.integer :visit_count
      t.references :service, foreign_key: true

      t.timestamps
    end
  end
end
