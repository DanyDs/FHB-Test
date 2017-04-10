class ChangeDataTypeForTariffPositionForServices < ActiveRecord::Migration[5.0]
  def change
    change_column :services, :tariff_position, :string
  end
end
