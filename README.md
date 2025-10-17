# PRF-2025C2-YA-C-3

Pasos para iniciar y ejecutar

1- yarn add react-native@0.77.2

2- yarn install

3- Buildear el archivo de app a lanzar por cada cambio:
yarn react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

4- yarn android (funciona con el celular conectado por USB de momento)

# Posibles errores

1- react-native/metor-config
Al buildear app, error "error `@react-native/metro-config` does not have the expected API. Ensure it matches your React Native version."

Cómo resolver:
Posibelmente porque se instaló antes react-native en su última versión en vez de 0.77.2, así que recomendamos hacer lo siguiente:

1.1: yarn remove react-native
1.2: yarn add react-native@0.77.2

2 - error Failed to install the app. Command failed with exit code 1: gradlew.bat app:installDebug

Error al lanzar yarn android: "error Failed to install the app. Command failed with exit code 1: gradlew.bat app:installDebug -PreactNativeDevServerPort=8081"

2.1: where.exe java

2.2: $env:JAVA_HOME #Esto setea el $env JAVA_HOME al proyecto

2.3: if (Test-Path "C:\Program Files\Java") { Get-ChildItem "C:\Program Files\Java" -Directory | Select-Object Name } #esto testea si existe el common Java paths

2.4: "C:\Program Files\Java\jre1.8.0_421\bin\keytool.exe" -genkey -v -keystore "[DIRECCION DE UBICACION DE LA CARPETA QUE TIENE AL REPOSITORIO]\PRF-2025C2-YA-C-3\android\app\debug.keystore" -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"  #FIJARSE PONER BIEN LA DIRECCION DESPUÉS DE "-keystore"

2.5: cd [REPOSITORIO DEL PROYECTO] #A la raíz de proyecto. FIJARSE PONER BIEN LA DIRECCION

2.6: ejecutar yarn android

3 - ERROR AL EJECUTAR 2.6 (mismo error):

Es posiblemente porque ya está instalada la app con parámetros diferentes pero mismo nombre.

En este caso deinstalarla, desde celular o ejecutando los pasos

3.1: adb uninstall com.example.reactnativezoomsdk

3.2: yarn android #Lo instala ahora con sus parámetros correspondientes