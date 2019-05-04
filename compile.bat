@ECHO OFF

@rem --display-modules -p  

IF "%1"=="" (
	cls
	ECHO start compile
	webpack --progress -p
	@rem npm run build
)

IF "%1"=="arhive" (
	"C:\Program Files\7-Zip\7z.exe" a -tzip -ssw -mx0 -r0 -mmt2 app_v1.0.4.zip @listfile.txt
)
