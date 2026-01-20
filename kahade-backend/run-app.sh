#!/bin/bash
export PORT=5000
export NODE_ENV=development
export REDIS_ENABLED=false
cd kahade-backend
npx ts-node -r tsconfig-paths/register --transpile-only src/main.ts
