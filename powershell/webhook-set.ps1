
$Token = Read-Host "Bot token"
$WebhookUrl = Read-Host "Webhook url"
$Uri = "https://api.telegram.org/bot$Token/setWebhook?url=$WebhookUrl"

Invoke-WebRequest -Uri $Uri -Method Post