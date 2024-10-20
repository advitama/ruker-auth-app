export $(grep -v '^#' .env | xargs)

TAG=${2:-latest}

docker build \
  --build-arg NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH \
  --build-arg NEXT_PUBLIC_BASE_DOMAIN=$NEXT_PUBLIC_BASE_DOMAIN \
  --build-arg NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY \
  --build-arg NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST \
  --build-arg NEXT_PUBLIC_AUTH_API_URL=$NEXT_PUBLIC_AUTH_API_URL \
  --build-arg NEXT_PUBLIC_DASHBOARD_APP_URL=$NEXT_PUBLIC_DASHBOARD_APP_URL \
  -t $DOCKER_USERNAME/$DOCKER_IMAGE:$TAG .