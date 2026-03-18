class Rack::Attack
  # Throttle login attempts by IP: 5 attempts per 60 seconds
  throttle("logins/ip", limit: 5, period: 60.seconds) do |req|
    req.ip if req.path == "/api/v1/auth/login" && req.post?
  end

  # Throttle login attempts by email: 10 attempts per 10 minutes
  throttle("logins/email", limit: 10, period: 10.minutes) do |req|
    if req.path == "/api/v1/auth/login" && req.post?
      begin
        body = JSON.parse(req.body.read)
        req.body.rewind
        body.dig("user", "email")&.downcase&.strip
      rescue
        nil
      end
    end
  end

  # Throttle general API requests: 300 per minute per IP
  throttle("api/ip", limit: 300, period: 1.minute) do |req|
    req.ip if req.path.start_with?("/api/")
  end

  # Throttle admin API: 60 per minute per IP
  throttle("admin/ip", limit: 60, period: 1.minute) do |req|
    req.ip if req.path.start_with?("/api/v1/admin/")
  end

  # Return 429 with JSON body
  self.throttled_responder = lambda do |req|
    [
      429,
      { "Content-Type" => "application/json" },
      [{ error: "Rate limit exceeded. Try again later." }.to_json]
    ]
  end
end
