class AddFullToNews < ActiveRecord::Migration[5.0]
  def change
    add_column :news, :full, :text
  end
end
