@echo off
echo ============================================
echo Clearing Git Credentials
echo ============================================
echo.
echo This will remove saved GitHub credentials
echo You'll need to enter your Laibtech username and token
echo.
pause

cmdkey /list | findstr git
echo.
echo Deleting git credentials...
cmdkey /delete:LegacyGeneric:target=git:https://github.com
echo.
echo Done! Now you can push with Laibtech credentials
echo.
pause
