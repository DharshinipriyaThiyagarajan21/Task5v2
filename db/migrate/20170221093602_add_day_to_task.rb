class AddDayToTask < ActiveRecord::Migration[5.0]
  def change
    add_column :tasks, :day, :integer
  end
end
