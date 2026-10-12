$ErrorActionPreference = 'Stop'
$workspace = [IO.Path]::GetFullPath((Split-Path $PSScriptRoot -Parent))
$dist = Join-Path $workspace 'dist'
$stage = [IO.Path]::GetFullPath((Join-Path $workspace '.tools\aruba-release'))
$zip = [IO.Path]::GetFullPath((Join-Path $workspace '.tools\portfolio-aruba.zip'))
if (-not (Test-Path (Join-Path $dist 'index.php'))) { throw 'Eseguire npm run build prima del pacchetto.' }
if (-not $stage.StartsWith($workspace + [IO.Path]::DirectorySeparatorChar) -or (Split-Path $stage -Leaf) -ne 'aruba-release') { throw 'Percorso temporaneo non valido.' }
if (Test-Path -LiteralPath $stage) { Remove-Item -LiteralPath $stage -Recurse -Force }
New-Item -ItemType Directory -Force -Path $stage | Out-Null
Get-ChildItem -LiteralPath $dist -File -Recurse -Force | ForEach-Object {
    $relative = $_.FullName.Substring($dist.Length + 1)
    if ($relative -notmatch '^api[\\/](config\.local\.php|storage|uploads)([\\/]|$)' -and $relative -notmatch '\.log$') {
        $target = Join-Path $stage $relative
        New-Item -ItemType Directory -Force -Path (Split-Path $target -Parent) | Out-Null
        Copy-Item -LiteralPath $_.FullName -Destination $target
    }
}
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
if (Test-Path -LiteralPath $zip) { Remove-Item -LiteralPath $zip -Force }
$archive = [IO.Compression.ZipFile]::Open($zip,[IO.Compression.ZipArchiveMode]::Create)
try {
    Get-ChildItem -LiteralPath $stage -File -Recurse -Force | ForEach-Object {
        $entry = $_.FullName.Substring($stage.Length + 1).Replace('\','/')
        [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive,$_.FullName,$entry,[IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
} finally { $archive.Dispose() }
Write-Output "Pacchetto senza credenziali e upload locali: $zip"
