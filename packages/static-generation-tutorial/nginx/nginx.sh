SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE_PATH="$SCRIPT_DIR/default.conf"
STATIC_ROOT_PATH="$(cd "$SCRIPT_DIR/.." && pwd)/dist"
CONTAINER_ID=$(docker ps -a -q -f "name=nginx")

if [ -n "$CONTAINER_ID" ]; then
  docker rm -f "$CONTAINER_ID"
fi

docker run -d \
  --name nginx \
  -p 3000:3000 \
  -v $CONFIG_FILE_PATH:/etc/nginx/conf.d/default.conf \
  -v $STATIC_ROOT_PATH:/usr/share/nginx/html \
  nginx:latest
