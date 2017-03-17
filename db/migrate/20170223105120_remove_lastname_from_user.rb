class RemoveLastnameFromUser < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :lastname, :string
  end
end
