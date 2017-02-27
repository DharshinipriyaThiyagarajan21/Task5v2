class RemoveAvatarFromUser < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :avatar_file_name, :string
  end
end
