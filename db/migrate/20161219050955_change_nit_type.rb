class ChangeNitType < ActiveRecord::Migration[5.0]
  def up
      change_column :companies, :nit, :string
    end

    def down
      change_column :companies, :nit, :int
    end
end
