class AddStateToAdvertisements < ActiveRecord::Migration[5.0]
  def change
    add_column :advertisements, :state, :string
  end
end
