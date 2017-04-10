class AddTitleToGuide < ActiveRecord::Migration[5.0]
  def change
    add_column :guides, :title, :string
  end
end
