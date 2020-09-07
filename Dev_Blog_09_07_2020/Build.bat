REM Remove pervious build files
del build\*.js /q
del build\*.map /q
del build\*.zip /q
copy ZzFX.js build\ZzFX.js
copy ZzFXm.min.js build\ZzFXm.min.js

REM Concatenate all JS into single file
type tk.js utils.js player.js enemy.js enemy_SlowRun.js enemy_FastRun.js enemy_SlowBounce.js enemy_DelayedAttack.js enemy_LongJump.js main.js > build\game.js

REM Minify
call google-closure-compiler --compilation_level SIMPLE --js build\game.js --js_output_file build\game.min.js

REM Remove non-minifiled file and intermediate file
del build\game.js /q
del build\*.map /q

REM ZIP
call "C:\Program Files\7-Zip\7z.exe" a -tzip build\404.zip .\build\*

REM Wait for user input
pause