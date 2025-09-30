#!/bin/bash

# --- CONFIGURABLE VARIABLES ---


# Define some colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Flags to track which actions to perform
RUN_LOCALLY_FLAG=0
BUILD_FOR_PROD_FLAG=0
DEPLOY_FLAG=0

# Function to display usage information
usage() {
  echo "Usage: $0 [-r] [-b] [-d]"
  echo "  -r: Run locally."
  echo "  -d: Build and deploy to production (GitHub pages)."
  exit 1
}

run_locally() {
  npm start
}

deploy_to_prod() {
  npm run deploy
}

# Parse command-line options
if [ $# -eq 0 ]; then
  usage
fi

# Manual argument parsing loop
for arg in "$@"; do
  case $arg in
    -r)
      RUN_LOCALLY_FLAG=1
      shift
      ;;
    -d)
      DEPLOY_FLAG=1
      shift
      ;;
    *)
      # This handles any leftover arguments or unknown options
      if [[ "$arg" == -* ]]; then
        echo -e "${RED}Unknown option: $arg${NC}"
        usage
      fi
      ;;
  esac
done

# Execute actions based on flags
if [ ${RUN_LOCALLY_FLAG} -eq 1 ]; then
  run_locally
fi

if [ ${DEPLOY_FLAG} -eq 1 ]; then
  deploy_to_prod
fi

echo -e "${GREEN}All requested operations completed successfully.${NC}"
exit 0