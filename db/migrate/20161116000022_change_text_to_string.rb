class ChangeTextToString < ActiveRecord::Migration[5.0]
  def up
    change_column :companies, :subsidiaries, :string
  end

  def down
    change_column :companies, :subsidiaries, :text
  end
end
