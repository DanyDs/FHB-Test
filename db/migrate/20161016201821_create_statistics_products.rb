class CreateStatisticsProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :statistics_products do |t|
      t.date :visit_date
      t.integer :visit_count
      t.references :product, foreign_key: true

      t.timestamps
    end
  end
end
