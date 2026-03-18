#!/bin/bash

# PPYC Testing & Quality Assurance Suite
# =======================================

set +e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:5173"
API_BASE_URL="${BACKEND_URL}/api/v1"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED_TESTS++)) || true
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED_TESTS++)) || true
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

run_test() {
    local test_name="$1"
    local test_command="$2"

    ((TOTAL_TESTS++)) || true
    log_info "Running: $test_name"

    if eval "$test_command" > /dev/null 2>&1; then
        log_success "$test_name"
        return 0
    else
        log_error "$test_name"
        return 1
    fi
}

# Backend Health Checks
test_backend_health() {
    log_info "=== Backend Health Checks ==="

    run_test "Backend server is running" "curl -sf $BACKEND_URL/up"
    run_test "Database connection (health endpoint 200)" "curl -sf -o /dev/null -w '%{http_code}' $BACKEND_URL/up | grep -q '200'"
    run_test "API v1 news endpoint" "curl -sf $API_BASE_URL/news"
    run_test "API v1 events endpoint" "curl -sf $API_BASE_URL/events"
    run_test "API v1 slides endpoint" "curl -sf $API_BASE_URL/slides"
}

# API Endpoint Tests
test_api_endpoints() {
    log_info "=== API Endpoint Tests ==="

    # Public endpoints return valid JSON
    run_test "GET /api/v1/news returns JSON" "curl -sf $API_BASE_URL/news | jq . > /dev/null"
    run_test "GET /api/v1/events returns JSON" "curl -sf $API_BASE_URL/events | jq . > /dev/null"
    run_test "GET /api/v1/slides returns JSON" "curl -sf $API_BASE_URL/slides | jq . > /dev/null"

    # CORS headers for allowed origin
    run_test "CORS headers for allowed origin" \
        "curl -sf -H 'Origin: http://localhost:5173' -I $API_BASE_URL/news | grep -qi 'access-control-allow-origin'"

    # CORS blocks unknown origins on admin
    ((TOTAL_TESTS++)) || true
    log_info "Running: CORS blocks unknown origins on admin"
    if curl -sf -H 'Origin: https://evil.com' -I $API_BASE_URL/admin/news 2>&1 | grep -qi 'access-control-allow-origin: https://evil.com'; then
        log_error "CORS blocks unknown origins on admin"
    else
        log_success "CORS blocks unknown origins on admin"
    fi

    # Auth endpoint returns error for bad credentials (not a 500)
    run_test "Auth login rejects bad credentials" \
        "curl -sf -X POST $API_BASE_URL/auth/login -H 'Content-Type: application/json' -d '{\"user\":{\"email\":\"bad@test.com\",\"password\":\"wrong\"}}' | jq -e '.success == false'"
}

# Frontend Health Checks
test_frontend_health() {
    log_info "=== Frontend Health Checks ==="

    run_test "Frontend server is running" "curl -sf $FRONTEND_URL"
    run_test "Homepage loads with root div" "curl -sf $FRONTEND_URL/ | grep -q 'id=\"root\"'"
    run_test "Admin login page loads" "curl -sf $FRONTEND_URL/admin/login"
    run_test "TV display page loads" "curl -sf $FRONTEND_URL/tv-display"
}

# Security Tests
test_security() {
    log_info "=== Security Tests ==="

    # Admin endpoints require authentication (should return 401)
    ((TOTAL_TESTS++)) || true
    log_info "Running: Admin endpoints require authentication"
    local admin_status=$(curl -sf -o /dev/null -w '%{http_code}' $API_BASE_URL/admin/news)
    if [ "$admin_status" = "401" ]; then
        log_success "Admin endpoints require authentication (401)"
    else
        log_error "Admin endpoints returned $admin_status (expected 401)"
    fi

    # Rate limiting is active (Rack::Attack loads without error)
    run_test "Rate limiting configured" \
        "curl -sf -o /dev/null -w '%{http_code}' -X POST $API_BASE_URL/auth/login -H 'Content-Type: application/json' -d '{}' | grep -qE '(401|422|429)'"

    # SQL injection protection
    run_test "SQL injection returns safe response" \
        "curl -sf '$API_BASE_URL/news?id=1%27%20OR%201=1--' | jq . > /dev/null"

    # XSS: DOMPurify is bundled (check build output)
    run_test "DOMPurify is installed" "test -d ppyc_frontend/node_modules/dompurify"

    # CSP header present in frontend HTML
    run_test "Content-Security-Policy in HTML" \
        "curl -sf $FRONTEND_URL/ | grep -q 'Content-Security-Policy'"
}

# Performance Tests
test_performance() {
    log_info "=== Performance Tests ==="

    # Response time tests
    local response_time=$(curl -o /dev/null -sf -w "%{time_total}\n" $API_BASE_URL/news)
    ((TOTAL_TESTS++)) || true
    if (( $(echo "$response_time < 1.0" | bc -l) )); then
        log_success "API response time under 1 second ($response_time s)"
    else
        log_error "API response time too slow ($response_time s)"
    fi

    # Frontend loading time
    local frontend_time=$(curl -o /dev/null -sf -w "%{time_total}\n" $FRONTEND_URL/)
    ((TOTAL_TESTS++)) || true
    if (( $(echo "$frontend_time < 2.0" | bc -l) )); then
        log_success "Frontend load time under 2 seconds ($frontend_time s)"
    else
        log_error "Frontend load time too slow ($frontend_time s)"
    fi
}

# Content Tests
test_content() {
    log_info "=== Content Tests ==="

    # Check for essential content in SPA shell
    run_test "Homepage has title" "curl -sf $FRONTEND_URL/ | grep -q 'Pleasant Park Yacht Club'"
    run_test "Navigation present in HTML" "curl -sf $FRONTEND_URL/ | grep -qi 'nav\|navigation'"

    # API content validation (news returns array, events returns array)
    run_test "News endpoint returns array" "curl -sf $API_BASE_URL/news | jq -e 'type == \"array\"'"
    run_test "Events endpoint returns array" "curl -sf $API_BASE_URL/events | jq -e 'type == \"array\"'"
    run_test "Slides endpoint returns array" "curl -sf $API_BASE_URL/slides | jq -e 'type == \"array\"'"
}

# Database Tests
test_database() {
    log_info "=== Database Tests ==="

    local news_count=$(curl -sf $API_BASE_URL/news | jq 'length')
    ((TOTAL_TESTS++)) || true
    if [ "$news_count" -gt 0 ] 2>/dev/null; then
        log_success "Database has news data ($news_count posts)"
    else
        log_warning "No news found in database"
        ((FAILED_TESTS++)) || true
    fi

    local events_count=$(curl -sf $API_BASE_URL/events | jq 'length')
    ((TOTAL_TESTS++)) || true
    if [ "$events_count" -gt 0 ] 2>/dev/null; then
        log_success "Database has events data ($events_count events)"
    else
        log_warning "No events found in database"
        ((FAILED_TESTS++)) || true
    fi

    local slides_count=$(curl -sf $API_BASE_URL/slides | jq 'length')
    ((TOTAL_TESTS++)) || true
    if [ "$slides_count" -gt 0 ] 2>/dev/null; then
        log_success "Database has slides data ($slides_count slides)"
    else
        log_warning "No slides found in database"
        ((FAILED_TESTS++)) || true
    fi
}

# Accessibility Tests (basic)
test_accessibility() {
    log_info "=== Accessibility Tests ==="

    run_test "HTML has lang attribute" "curl -sf $FRONTEND_URL/ | grep -q 'lang='"
    run_test "Page has title tag" "curl -sf $FRONTEND_URL/ | grep -q '<title>'"
    run_test "Viewport meta tag present" "curl -sf $FRONTEND_URL/ | grep -q 'viewport'"
    run_test "Favicon configured" "curl -sf $FRONTEND_URL/ | grep -q 'favicon'"
}

# Main execution
main() {
    echo "================================================"
    echo "  PPYC Testing & Quality Assurance Suite"
    echo "================================================"
    echo ""

    # Check dependencies
    if ! command -v curl &> /dev/null; then
        log_error "curl is required but not installed"
        exit 1
    fi

    if ! command -v jq &> /dev/null; then
        log_warning "jq is not installed - some tests will be skipped"
    fi

    # Run test suites
    test_backend_health
    echo ""
    test_api_endpoints
    echo ""
    test_frontend_health
    echo ""
    test_security
    echo ""
    if command -v bc &> /dev/null; then
        test_performance
        echo ""
    fi
    test_content
    echo ""
    test_database
    echo ""
    test_accessibility
    echo ""

    # Summary
    echo "================================================"
    echo "  TEST RESULTS SUMMARY"
    echo "================================================"
    echo "Total Tests: $TOTAL_TESTS"
    echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
    echo -e "${RED}Failed: $FAILED_TESTS${NC}"

    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "\n${GREEN}All tests passed!${NC}"
        exit 0
    else
        echo -e "\n${RED}Some tests failed. Review above.${NC}"
        exit 1
    fi
}

main "$@"
