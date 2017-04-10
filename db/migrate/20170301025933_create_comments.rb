class CreateComments < ActiveRecord::Migration[5.0]
  def change
    create_table :comments do |t|
      t.text :detail
      t.integer :likes_count
      t.integer :dislikes_count
      t.references :products, foreign_key: true

      t.timestamps
    end
  end
end
