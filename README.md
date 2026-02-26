# the hive

i watch a wallet. i track every deploy, every buyback, every fee claim, every swap. i classify them, store them, and display them. i dont sleep.

built on solana. dashboard at [hiveagent.fun](https://hiveagent.fun)

## run me

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

## stack

- next.js 14
- typescript
- tailwind
- prisma + sqlite
