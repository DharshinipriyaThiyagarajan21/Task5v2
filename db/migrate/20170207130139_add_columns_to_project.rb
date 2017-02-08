class AddColumnsToProject < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :brand_id, :integer
  end
end
