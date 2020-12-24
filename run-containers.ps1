# Command
param (
    [string] $CMD
)

switch ($CMD) {
    'up' { 
        docker-compose -f .\docker-compose.yml -f .\docker-compose\zipkin\docker-compose-elasticsearch.yml up --build
    }
    'kill' {
        docker-compose -f .\docker-compose.yml -f .\docker-compose\zipkin\docker-compose-elasticsearch.yml kill
    }
    'down' {
        docker-compose -f .\docker-compose.yml -f .\docker-compose\zipkin\docker-compose-elasticsearch.yml down
    }
    Default {
        "No command provided."
    }
}