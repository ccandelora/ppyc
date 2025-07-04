class AddBackgroundFieldsToSlides < ActiveRecord::Migration[8.0]
  def change
    add_column :slides, :background_video_url, :string
    add_column :slides, :background_tint_color, :string
    add_column :slides, :background_tint_opacity, :decimal
  end
end
