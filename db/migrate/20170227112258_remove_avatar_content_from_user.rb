class RemoveAvatarContentFromUser < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :avatar_content_type, :string
  end
end
