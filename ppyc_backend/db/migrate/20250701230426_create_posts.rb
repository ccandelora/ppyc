class CreatePosts < ActiveRecord::Migration[8.0]
  def change
    create_table :posts do |t|
      t.string :title
      t.text :content
      t.references :author, null: false, foreign_key: { to_table: :users }
      t.datetime :published_at
      t.string :slug
      t.string :featured_image_url

      t.timestamps
    end
  end
end
