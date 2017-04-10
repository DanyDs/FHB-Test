class CreateCompanies < ActiveRecord::Migration[5.0]
  def change
    create_table :companies do |t|
      t.string :name
      t.string :email
      t.integer :nit
      t.string :address
      t.integer :telephone
      t.boolean :status
      t.string :department

      t.timestamps
    end
  end
end
