class AddDateToNews < ActiveRecord::Migration[5.0]
  def change
    add_column :news, :date, :date
  end
end
