@echo off
echo ========================================
echo Configurando Git para WebyAPIs
echo ========================================

REM Configurar usuario (CAMBIAR ESTOS DATOS)
git config --global user.name "Tu Nombre Completo"
git config --global user.email "tu-email@example.com"

REM Inicializar Git
git init

REM Agregar todos los archivos
git add .

REM Crear commit
git commit -m "Primer commit: Proyecto WebyAPIs"

REM Agregar remote (CAMBIAR ESTA URL)
git remote add origin https://github.com/tu-usuario/proyecto-cloud.git

REM Hacer push
git push -u origin master

echo ========================================
echo ¡Proceso completado!
echo ========================================
pause