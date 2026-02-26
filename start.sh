#!/bin/sh
npx prisma db push --accept-data-loss
npx next start
