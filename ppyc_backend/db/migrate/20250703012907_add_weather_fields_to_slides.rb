class AddWeatherFieldsToSlides < ActiveRecord::Migration[8.0]
  def change
    add_column :slides, :location, :string
    add_column :slides, :weather_type, :string
  end
end
