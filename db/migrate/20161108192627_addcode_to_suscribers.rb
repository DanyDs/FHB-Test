class AddcodeToSuscribers < ActiveRecord::Migration[5.0]
  def change
      add_column :suscribers, :code, :integer
  end
end
