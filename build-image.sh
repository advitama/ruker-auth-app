# Load environment variables from .env file (optional)
export $(grep -v '^#' .env | xargs)

# Build the Docker image
docker build \
  --build-arg NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY \
  --build-arg NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST \
  --build-arg NEXT_PUBLIC_AUTH_API_URL=$NEXT_PUBLIC_AUTH_API_URL \
  --build-arg NEXT_PUBLIC_DASHBOARD_APP_URL=$NEXT_PUBLIC_DASHBOARD_APP_URL \
  -t $DOCKER_USERNAME/$DOCKER_IMAGE .
