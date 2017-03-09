class RemoveFirstnameFromUser < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :firstname, :string
  end
end
