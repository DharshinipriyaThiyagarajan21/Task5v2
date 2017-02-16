class AddTakenToTask < ActiveRecord::Migration[5.0]
  def change
    add_column :tasks, :taken, :boolean
    add_column :tasks, :completed, :boolean
  end
end
