class RemoveAvatarupdatedFromUser < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :avatar_updated_at, :string
  end
end
