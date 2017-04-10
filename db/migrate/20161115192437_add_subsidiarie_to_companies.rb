class AddSubsidiarieToCompanies < ActiveRecord::Migration[5.0]

  def change
    add_column :companies, :subsidiaries, :text
  end
end
