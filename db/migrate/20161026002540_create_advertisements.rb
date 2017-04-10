class CreateAdvertisements < ActiveRecord::Migration[5.0]
  def change
    create_table :advertisements do |t|
      t.text :description
      t.integer :id_Company
      t.boolean :isAccepted
      t.boolean :isPublicized
      t.date :publicationDate
      t.date :expirationDate

      t.timestamps
    end
  end
end
