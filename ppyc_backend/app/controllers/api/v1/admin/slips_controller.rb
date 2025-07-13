module Api
  module V1
    module Admin
      class SlipsController < BaseController
        def index
          # Mock data for now - replace with actual database queries later
          docks = [
            {
              id: 'A',
              name: 'Dock A',
              slips: 20.times.map { |i| generate_slip("A#{i + 1}", '30ft') }
            },
            {
              id: 'B',
              name: 'Dock B',
              slips: 25.times.map { |i| generate_slip("B#{i + 1}", '40ft') }
            },
            {
              id: 'C',
              name: 'Dock C',
              slips: 15.times.map { |i| generate_slip("C#{i + 1}", '50ft') }
            }
          ]

          render json: { docks: docks }
        end

        private

        def generate_slip(id, size)
          {
            id: id,
            number: id[1..].to_i,
            size: size,
            status: rand > 0.7 ? 'available' : 'occupied'
          }
        end
      end
    end
  end
end
