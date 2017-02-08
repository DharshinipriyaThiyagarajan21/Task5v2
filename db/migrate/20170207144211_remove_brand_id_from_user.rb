class RemoveBrandIdFromUser < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :brand_id, :integer
  end
end
