class AddInviteeIdToInvitation < ActiveRecord::Migration[5.0]
  def change
    add_column :invitations, :invitee_id, :integer
  end
end
