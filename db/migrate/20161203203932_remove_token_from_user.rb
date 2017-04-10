class RemoveTokenFromUser < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :token, :string
    remove_column :users, :companyId, :integer
  end
end
