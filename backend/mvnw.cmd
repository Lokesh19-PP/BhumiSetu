@REM Maven wrapper script for Windows
@echo off
setlocal
set "DIR=%~dp0"
if exist "%HOME%\maven\apache-maven-3.9.6\bin\mvn.cmd" (
    "%HOME%\maven\apache-maven-3.9.6\bin\mvn.cmd" %*
) else (
    mvn %*
)
