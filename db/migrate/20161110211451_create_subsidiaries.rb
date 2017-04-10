class CreateSubsidiaries < ActiveRecord::Migration[5.0]
  def change
    create_table :subsidiaries do |t|
      t.string   "address"
      t.datetime "created_at"
      t.datetime "updated_at"

      t.timestamps
    end
  end
end
