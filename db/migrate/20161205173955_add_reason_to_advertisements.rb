class AddReasonToAdvertisements < ActiveRecord::Migration[5.0]
  def change
    add_column :advertisements, :reason, :text
  end
end
