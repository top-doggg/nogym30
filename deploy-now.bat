@echo off
setlocal
echo.
echo Deploying No-Gym 30 landing...
echo Opening public folder: %~dp0
echo Copy this folder to Netlify, Vercel, Cloudflare Pages, or drag-drop as-is.
echo.
echo Currently included:
echo  - index.html
echo  - privacy.html
echo  - terms.html
echo  - README.md
echo.
start "" explorer.exe "%~dp0"
endlocal
