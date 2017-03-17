class AddProjectIdToProinvite < ActiveRecord::Migration[5.0]
  def change
    add_column :proinvites, :project_id, :integer
  end
end
