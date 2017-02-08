class CreateInvitations < ActiveRecord::Migration[5.0]
  def change
    create_table :invitations do |t|
      t.integer :brand_id
      t.integer :user_id
      t.integer :invite_id
      t.text :status

      t.timestamps
    end
  end
end
