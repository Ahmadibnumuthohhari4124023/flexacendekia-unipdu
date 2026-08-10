$dirs = Get-ChildItem -Directory -Path .
foreach ($dir in $dirs) {
    $htmlFiles = Get-ChildItem -Path $dir.FullName -Filter "*.html"
    foreach ($file in $htmlFiles) {
        $content = Get-Content -Path $file.FullName -Raw
        
        # Regex to match <script id="tailwind-config"> ... </script>
        $regex = [regex]::new('(?s)<script id="tailwind-config">.*?</script>')
        
        if ($content -match $regex) {
            $newContent = $regex.Replace($content, '<script src="../tailwind-config.js"></script>')
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "Replaced in $($file.FullName)"
        }
    }
}
