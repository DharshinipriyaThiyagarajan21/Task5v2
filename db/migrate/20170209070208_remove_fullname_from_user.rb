class RemoveFullnameFromUser < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :fullname, :string
  end
end
