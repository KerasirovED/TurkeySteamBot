
$projectDir = (get-item $PSScriptRoot).parent.FullName

if (!(Test-Path -Path $projectDir\.build)) {
    New-Item -Path $projectDir -Name .build -ItemType directory
}

if (Test-Path -Path $projectDir\.build\bot.zip) {
    Remove-Item -Path $projectDir\.build\bot.zip
}

$ignore = Get-Content $projectDir\.gitignore
$ignore += (
    "index.mjs",
    "LICENSE",
    "package.json",
    "README.md",
    "secrets.example.mjs",
    "powershell",
    ".gitignore"
)

$ignore = $ignore.Where{ $_ -ne "secrets.mjs" }

$filesToBeArchived = Get-ChildItem $projectDir -Exclude $ignore

Compress-Archive -Path $filesToBeArchived -DestinationPath $projectDir\.build\bot.zip