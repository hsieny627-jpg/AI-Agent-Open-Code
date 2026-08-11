@echo off
title Super Fun 3 英語遊戲伺服器
chcp 65001 >nul
cd /d "%~dp0"
"..\..\.venv\Scripts\python.exe" server.py
pause
