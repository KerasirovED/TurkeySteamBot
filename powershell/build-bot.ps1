
$projectDir = (get-item $PSScriptRoot).parent.FullName

if (!(Test-Path -Path $projectDir\.build)) {
    New-Item -Path $projectDir -Name .build -ItemType directory
}

if (Test-Path -Path $projectDir\.build\bot.zip) {
    Remove-Item -Path $projectDir\.build\bot.zip
}

$archivedFiles = (
    "Bot.mjs",
    "lambda.mjs",
    "LICENSE",
    "package.json",
    "readme.md",
    "secrets.mjs",
    "SteamApi.mjs",
    "TelegramApi.mjs"
)

$archivedPaths = $archivedFiles | % {join-path $projectDir $_}

Compress-Archive -Path $archivedPaths -DestinationPath $projectDir\.build\bot.zip