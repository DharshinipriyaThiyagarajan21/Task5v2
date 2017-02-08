class RemoveInviteIdFromInvitation < ActiveRecord::Migration[5.0]
  def change
    remove_column :invitations, :invite_id, :integer
  end
end
