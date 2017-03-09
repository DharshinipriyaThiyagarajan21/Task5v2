class RemoveAvatarfileFromUser < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :avatar_file_size, :string
  end
end
