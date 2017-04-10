class AddLocationToNews < ActiveRecord::Migration[5.0]
  def change
    add_column :news, :location, :string
  end
end
