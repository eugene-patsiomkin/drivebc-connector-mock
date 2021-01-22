# Command
param (
    [string] $CMD,
    [bool] $content = $false,
    [bool] $integration = $false,
    [bool] $metrics = $false,
    [bool] $all = $false
)

$dockerFiles = @('.\docker-compose.yml')

if (($content -eq $true) -or ($all -eq $true)) {
    $dockerFiles += '.\docker-compose\cms\docker-compose.yml';
}

if (($metrics -eq $true) -or ($all -eq $true)) {
    $dockerFiles += '.\docker-compose\zipkin\docker-compose-elasticsearch.yml';
}

if (($metrics -eq $true) -or ($all -eq $true)) {
    $dockerFiles += '.\docker-compose\integration\docker-compose.yml';
}

function BuildCommand {
    param (
        [array] $fileList
    )
    $command = "docker-compose"

    foreach ($fileName in $fileList) {
        $command += " -f " + $fileName
    }

    return $command
}

$command = BuildCommand($dockerFiles)


switch ($CMD) {
    'up' {
        $command += " up --build"
    }
    'kill' {
        $command += " kill"
    }
    'down' {
        $command += " down"
    }
    Default {
        "No command provided."
        exit
    }
}

Invoke-Expression $command