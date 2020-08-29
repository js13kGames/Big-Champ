REM Remove pervious build files
del build\*.js /q
del build\*.map /q
del build\*.zip /q

REM Concatenate all JS into single file
type tk.js utils.js player.js enemy.js enemy_SlowRun.js enemy_FastRun.js enemy_SlowBounce.js enemy_DelayedAttack.js enemy_LongJump.js main.js > build\game.js

REM Minify
call google-closure-compiler --compilation_level SIMPLE --js build\game.js --js_output_file build\game.min.js

REM ZIP
call "C:\Program Files\7-Zip\7z.exe" a -tzip build\404.zip build\index.html build\game.min.js

REM Cleanup
del build\*.map /q