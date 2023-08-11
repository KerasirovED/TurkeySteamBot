
$Token = Read-Host "Bot token"
$Uri = "https://api.telegram.org/bot$Token/deleteWebhook?drop_pending_updates=True"
Invoke-WebRequest -Uri $Uri -Method Post