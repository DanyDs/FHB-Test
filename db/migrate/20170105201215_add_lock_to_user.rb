class AddLockToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :lock, :boolean, default: false
    add_column :users, :attempts, :integer, default: 0
  end
end
