class AddCompanyToSubsidiaries < ActiveRecord::Migration[5.0]
  def change
    add_reference :subsidiaries, :company, foreign_key: true
  end
end
