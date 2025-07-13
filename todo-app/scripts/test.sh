#!/bin/bash

# Todo App Test Runner Script
# Provides convenient commands for running different types of tests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}🧪 Todo App Test Suite${NC}"
    echo -e "${BLUE}========================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the todo-app directory"
    exit 1
fi

# Help function
show_help() {
    print_header
    echo "Usage: ./scripts/test.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  all              Run all tests with coverage"
    echo "  unit             Run unit tests only"
    echo "  integration      Run integration tests only"
    echo "  performance      Run performance tests only"
    echo "  components       Run component tests only"
    echo "  hooks            Run hook tests only"
    echo "  watch            Run tests in watch mode"
    echo "  coverage         Run tests with coverage report"
    echo "  coverage-html    Generate HTML coverage report"
    echo "  lint             Run ESLint"
    echo "  clean            Clean test cache and coverage"
    echo "  setup            Install dependencies and setup"
    echo "  help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./scripts/test.sh all"
    echo "  ./scripts/test.sh unit --watch"
    echo "  ./scripts/test.sh coverage --verbose"
}

# Main command handling
case "${1:-help}" in
    "all")
        print_header
        print_info "Running all tests with coverage..."
        npm run test:coverage -- --watchAll=false
        print_success "All tests completed!"
        ;;
        
    "unit")
        print_header
        print_info "Running unit tests..."
        npm test -- --testPathPattern="(lib|hooks)" --watchAll=false ${@:2}
        print_success "Unit tests completed!"
        ;;
        
    "integration")
        print_header
        print_info "Running integration tests..."
        npm test -- --testPathPattern="integration" --watchAll=false ${@:2}
        print_success "Integration tests completed!"
        ;;
        
    "performance")
        print_header
        print_info "Running performance tests..."
        npm test -- --testPathPattern="performance" --watchAll=false ${@:2}
        print_success "Performance tests completed!"
        ;;
        
    "components")
        print_header
        print_info "Running component tests..."
        npm test -- --testPathPattern="components" --watchAll=false ${@:2}
        print_success "Component tests completed!"
        ;;
        
    "hooks")
        print_header
        print_info "Running hook tests..."
        npm test -- --testPathPattern="hooks" --watchAll=false ${@:2}
        print_success "Hook tests completed!"
        ;;
        
    "watch")
        print_header
        print_info "Running tests in watch mode..."
        npm run test:watch
        ;;
        
    "coverage")
        print_header
        print_info "Running tests with coverage..."
        npm run test:coverage -- --watchAll=false ${@:2}
        print_success "Coverage report generated!"
        ;;
        
    "coverage-html")
        print_header
        print_info "Generating HTML coverage report..."
        npm run test:coverage -- --watchAll=false --coverageReporters=html
        print_success "HTML coverage report generated in coverage/lcov-report/"
        ;;
        
    "lint")
        print_header
        print_info "Running ESLint..."
        npm run lint
        print_success "Linting completed!"
        ;;
        
    "clean")
        print_header
        print_info "Cleaning test cache and coverage..."
        rm -rf coverage/
        npm test -- --clearCache
        print_success "Cache and coverage cleaned!"
        ;;
        
    "setup")
        print_header
        print_info "Setting up dependencies..."
        npm install --legacy-peer-deps
        print_success "Dependencies installed!"
        print_info "Running initial test to verify setup..."
        npm test -- --passWithNoTests --watchAll=false
        print_success "Setup completed successfully!"
        ;;
        
    "benchmark")
        print_header
        print_info "Running performance benchmarks..."
        npm test -- --testPathPattern="performance" --verbose --watchAll=false
        print_success "Benchmarks completed!"
        ;;
        
    "debug")
        print_header
        print_info "Running tests in debug mode..."
        npm test -- --verbose --no-cache --watchAll=false ${@:2}
        ;;
        
    "ci")
        print_header
        print_info "Running CI test suite..."
        
        # Run linting
        print_info "Step 1/4: Running ESLint..."
        npm run lint
        
        # Run tests with coverage
        print_info "Step 2/4: Running tests with coverage..."
        npm run test:coverage -- --watchAll=false
        
        # Check coverage thresholds
        print_info "Step 3/4: Checking coverage thresholds..."
        npm test -- --coverage --passWithNoTests --watchAll=false --coverageReporters=text-summary
        
        # Run build to ensure everything compiles
        print_info "Step 4/4: Testing build..."
        npm run build
        
        print_success "CI test suite completed successfully!"
        ;;
        
    "specific")
        if [ -z "$2" ]; then
            print_error "Please specify a test file or pattern"
            echo "Example: ./scripts/test.sh specific utils.test.ts"
            exit 1
        fi
        print_header
        print_info "Running specific test: $2"
        npm test -- --testNamePattern="$2" --watchAll=false ${@:3}
        ;;
        
    "help")
        show_help
        ;;
        
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac