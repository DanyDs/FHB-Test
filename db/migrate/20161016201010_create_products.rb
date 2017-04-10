class CreateProducts < ActiveRecord::Migration[5.0]
  def change
    create_table :products do |t|
      t.string :commercial_name
      t.string :feature
      t.text :description
      t.string :image_path
      t.string :product_type
      t.integer :tariff_position
      t.boolean :visibility_state
      t.references :company, foreign_key: true

      t.timestamps
    end
  end
end
