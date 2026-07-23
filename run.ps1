Write-Host "=== Pushing database schema ===" -ForegroundColor Cyan
npm run db:push
if ($?) {
    Write-Host "=== Seeding database ===" -ForegroundColor Cyan
    npm run db:seed
}
if ($?) {
    Write-Host "=== Starting dev server ===" -ForegroundColor Cyan
    npm run dev
} else {
    Write-Host "Database setup failed. Aborting." -ForegroundColor Red
    exit 1
}
