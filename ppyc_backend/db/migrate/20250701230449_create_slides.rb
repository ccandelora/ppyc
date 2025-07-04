class CreateSlides < ActiveRecord::Migration[8.0]
  def change
    create_table :slides do |t|
      t.string :title
      t.string :slide_type
      t.text :content
      t.string :image_url
      t.boolean :active_status
      t.integer :display_order
      t.integer :duration_seconds

      t.timestamps
    end
  end
end
