class AddHasImageToNews < ActiveRecord::Migration[5.0]
  def change
    add_column :news, :hasImage, :boolean

  end
end
