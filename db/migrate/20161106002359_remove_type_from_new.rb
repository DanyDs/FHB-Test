class RemoveTypeFromNew < ActiveRecord::Migration[5.0]
  def change
    remove_column :news , :type 
  end
end
