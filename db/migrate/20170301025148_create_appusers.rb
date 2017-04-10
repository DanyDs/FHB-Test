class CreateAppusers < ActiveRecord::Migration[5.0]
  def change
    create_table :appusers do |t|
      t.string :name
      t.string :lastname
      t.string :email
      t.string :password
      t.string :confirm_password
      t.string :reset_password

      t.timestamps
    end
  end
end
