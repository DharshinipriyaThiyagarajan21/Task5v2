class RemoveStatusFromTask < ActiveRecord::Migration[5.0]
  def change
    remove_column :tasks, :status, :text
  end
end
