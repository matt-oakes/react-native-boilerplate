const buildGradlePath = 'android/app/build.gradle'
const searchConfig = /buildTypes {[\s\S]*?}[\s\S]*?}/g
const replacementConfig = `signingConfigs {
      debug {
        storeFile file('keystores/debug.jks')
        keyAlias 'android'
        storePassword 'android'
        keyPassword 'android'
      }
      
      release {
        storeFile file('keystores/release.jks')
        keyAlias 'release'
        storePassword "$System.env.APP_KEY"
        keyPassword "$System.env.APP_KEY"
      }
    }
    buildTypes {
      debug {
        signingConfig signingConfigs.debug
      }
      
      release {
        minifyEnabled enableProguardInReleaseBuilds
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        signingConfig signingConfigs.release
      }
    }`
const keystorePath = 'android/app/keystores'
const generateKeystoreCommand = (type, alias, password) => {
  return `keytool -genkey -v -keystore ${keystorePath}/${type}.jks -keyalg RSA -keysize 2048 -validity 10000 -alias ${alias} -dname "cn=A Developer" -storepass ${password} -keypass ${password}`
}

module.exports = {
  buildGradlePath,
  searchConfig,
  replacementConfig,
  keystorePath,
  generateKeystoreCommand
}
