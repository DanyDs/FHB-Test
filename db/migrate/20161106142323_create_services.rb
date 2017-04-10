class CreateServices < ActiveRecord::Migration[5.0]
  def change
    create_table :services do |t|
      t.string :commercial_name
      t.string :feature
      t.text :description
      t.string :image_path
      t.integer :tariff_position
      t.string :certification
      t.boolean :visibility_state
      t.references :company, foreign_key: true

      t.timestamps
    end
  end
end
