class ChangeDataTypeForTariffPosition < ActiveRecord::Migration[5.0]
  def change
    change_column :products, :tariff_position, :string
  end
end
