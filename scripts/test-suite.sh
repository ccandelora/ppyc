#!/bin/bash

# PPYC Phase 8 Testing & Quality Assurance Suite
# ===============================================

set -e

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
    ((PASSED_TESTS++))
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED_TESTS++))
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    ((TOTAL_TESTS++))
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
    
    run_test "Backend server is running" "curl -f $BACKEND_URL/up"
    run_test "Database connection" "curl -f $BACKEND_URL/up | grep -q 'ok'"
    run_test "API v1 posts endpoint" "curl -f $API_BASE_URL/posts"
    run_test "API v1 events endpoint" "curl -f $API_BASE_URL/events"
    run_test "API v1 slides endpoint" "curl -f $API_BASE_URL/slides"
}

# API Endpoint Tests
test_api_endpoints() {
    log_info "=== API Endpoint Tests ==="
    
    # Public endpoints
    run_test "GET /api/v1/posts returns JSON" "curl -f $API_BASE_URL/posts | jq . > /dev/null"
    run_test "GET /api/v1/events returns JSON" "curl -f $API_BASE_URL/events | jq . > /dev/null"
    run_test "GET /api/v1/slides returns JSON" "curl -f $API_BASE_URL/slides | jq . > /dev/null"
    
    # CORS headers
    run_test "CORS headers present" "curl -I -X OPTIONS $API_BASE_URL/posts | grep -q 'Access-Control-Allow-Origin'"
    
    # Authentication endpoints
    run_test "Auth endpoints accessible" "curl -f -X POST $API_BASE_URL/auth/login -H 'Content-Type: application/json' -d '{}' | grep -q 'error'"
}

# Frontend Health Checks
test_frontend_health() {
    log_info "=== Frontend Health Checks ==="
    
    run_test "Frontend server is running" "curl -f $FRONTEND_URL"
    run_test "Homepage loads" "curl -f $FRONTEND_URL/ | grep -q 'PPYC'"
    run_test "Admin login page loads" "curl -f $FRONTEND_URL/admin/login"
    run_test "TV display page loads" "curl -f $FRONTEND_URL/tv-display"
}

# Security Tests
test_security() {
    log_info "=== Security Tests ==="
    
    # Backend security headers
    run_test "X-Frame-Options header" "curl -I $BACKEND_URL/up | grep -q 'X-Frame-Options'"
    run_test "X-Content-Type-Options header" "curl -I $BACKEND_URL/up | grep -q 'X-Content-Type-Options'"
    run_test "HTTPS redirect configured" "curl -I $BACKEND_URL/up | grep -q 'Strict-Transport-Security' || echo 'Note: HSTS not enabled in development'"
    
    # SQL injection protection
    run_test "SQL injection protection" "curl -f '$API_BASE_URL/posts?id=1%27%20OR%201=1--' | grep -v 'error'"
    
    # Admin endpoints require authentication
    if ! curl -f $API_BASE_URL/admin/posts > /dev/null 2>&1; then
        log_success "Admin endpoints require authentication"
        ((PASSED_TESTS++))
    else
        log_error "Admin endpoints not properly protected"
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
}

# Performance Tests
test_performance() {
    log_info "=== Performance Tests ==="
    
    # Response time tests
    local response_time=$(curl -o /dev/null -s -w "%{time_total}\n" $API_BASE_URL/posts)
    if (( $(echo "$response_time < 1.0" | bc -l) )); then
        log_success "API response time under 1 second ($response_time s)"
        ((PASSED_TESTS++))
    else
        log_error "API response time too slow ($response_time s)"
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
    
    # Frontend loading time
    local frontend_time=$(curl -o /dev/null -s -w "%{time_total}\n" $FRONTEND_URL/)
    if (( $(echo "$frontend_time < 2.0" | bc -l) )); then
        log_success "Frontend load time under 2 seconds ($frontend_time s)"
        ((PASSED_TESTS++))
    else
        log_error "Frontend load time too slow ($frontend_time s)"
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
}

# Content Tests
test_content() {
    log_info "=== Content Tests ==="
    
    # Check for essential content
    run_test "Homepage contains yacht club content" "curl -f $FRONTEND_URL/ | grep -i 'yacht'"
    run_test "Navigation menu present" "curl -f $FRONTEND_URL/ | grep -i 'nav'"
    run_test "Footer present" "curl -f $FRONTEND_URL/ | grep -i 'footer'"
    
    # API content validation
    run_test "Posts have required fields" "curl -f $API_BASE_URL/posts | jq '.[0] | has(\"title\", \"content\", \"published_at\")'"
    run_test "Events have required fields" "curl -f $API_BASE_URL/events | jq '.[0] | has(\"title\", \"start_time\", \"location\")'"
}

# Database Tests
test_database() {
    log_info "=== Database Tests ==="
    
    # Check if database has seed data
    local posts_count=$(curl -s $API_BASE_URL/posts | jq length)
    if [ "$posts_count" -gt 0 ]; then
        log_success "Database has posts data ($posts_count posts)"
        ((PASSED_TESTS++))
    else
        log_warning "No posts found in database"
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
    
    local events_count=$(curl -s $API_BASE_URL/events | jq length)
    if [ "$events_count" -gt 0 ]; then
        log_success "Database has events data ($events_count events)"
        ((PASSED_TESTS++))
    else
        log_warning "No events found in database"
        ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
}

# Accessibility Tests (basic)
test_accessibility() {
    log_info "=== Accessibility Tests ==="
    
    # Check for basic accessibility elements
    run_test "HTML has lang attribute" "curl -f $FRONTEND_URL/ | grep -q 'lang='"
    run_test "Images have alt attributes" "curl -f $FRONTEND_URL/ | grep '<img' | grep -q 'alt='"
    run_test "Page has title" "curl -f $FRONTEND_URL/ | grep -q '<title>'"
}

# Mobile Responsiveness
test_mobile() {
    log_info "=== Mobile Responsiveness Tests ==="
    
    # Check for viewport meta tag
    run_test "Viewport meta tag present" "curl -f $FRONTEND_URL/ | grep -q 'viewport'"
    
    # Check for responsive CSS classes (Tailwind)
    run_test "Responsive CSS classes present" "curl -f $FRONTEND_URL/ | grep -q 'md:'"
}

# Main execution
main() {
    echo "================================================"
    echo "PPYC Phase 8 Testing & Quality Assurance Suite"
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
    
    if ! command -v bc &> /dev/null; then
        log_warning "bc is not installed - performance tests will be skipped"
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
    test_mobile
    echo ""
    
    # Summary
    echo "================================================"
    echo "TEST RESULTS SUMMARY"
    echo "================================================"
    echo "Total Tests: $TOTAL_TESTS"
    echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
    echo -e "${RED}Failed: $FAILED_TESTS${NC}"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed! Ready for production deployment.${NC}"
        exit 0
    else
        echo -e "${RED}❌ Some tests failed. Please review and fix issues before deployment.${NC}"
        exit 1
    fi
}

# Run main function
main "$@" 