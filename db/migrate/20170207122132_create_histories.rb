class CreateHistories < ActiveRecord::Migration[5.0]
  def change
    create_table :histories do |t|
      t.text :link_type
      t.integer :link_id
      t.integer :user_id
      t.text :action
      t.boolean :notify

      t.timestamps
    end
  end
end
