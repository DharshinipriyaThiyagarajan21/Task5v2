class AddHookToProject < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :hook, :string
  end
end
