class ChangeTelephoneType < ActiveRecord::Migration[5.0]
  def up
      change_column :companies, :telephone, :string
    end

    def down
      change_column :companies, :telephone, :int
    end
end
