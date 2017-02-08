class CreateTasks < ActiveRecord::Migration[5.0]
  def change
    create_table :tasks do |t|
      t.string :name
      t.integer :created_by
      t.integer :assigned_to
      t.text :status
      t.boolean :git_status
      t.integer :backlog_count

      t.timestamps
    end
  end
end
