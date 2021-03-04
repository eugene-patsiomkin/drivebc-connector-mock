$Integrations = @(
    "\camel-integrations\quarkus\cms-integration"
    , "\camel-integrations\quarkus\events-wrapper-with-push"
    , "\camel-integrations\quarkus\weather-canada"
)

Set-Variable -Name "CurrentLocation"  -Value (Get-Location)
$Integrations | ForEach-Object {
    Set-Location "$PSScriptRoot$_"
    .\mvnw clean package
}


Set-Location $CurrentLocation
Get-Location