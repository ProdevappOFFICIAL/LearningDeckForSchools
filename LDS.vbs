Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & "C:\Users\USER\Desktop\start-servers.bat" & chr(34), 0
Set WshShell = Nothing