class AddAuxIdToSubsidiaries < ActiveRecord::Migration[5.0]
  def change
    add_column :subsidiaries, :auxId, :integer
    
  end
end
