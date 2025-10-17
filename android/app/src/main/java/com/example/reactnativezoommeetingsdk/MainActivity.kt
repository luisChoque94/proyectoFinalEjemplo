package com.example.reactnativezoomsdk;

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.concurrentReactEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.content.Intent;
import android.app.Activity
import android.os.Build
import android.os.Bundle


class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "ZoomMeetingSDKExample"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
  }
  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
//  override fun createReactActivityDelegate(): ReactActivityDelegate =
//      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun createReactActivityDelegate(): ReactActivityDelegate? {
    return DefaultReactActivityDelegate(
            this,
            getMainComponentName(),
            fabricEnabled,  // fabricEnabled
            concurrentReactEnabled // concurrentRootEnabled
    )
  }

  /**
   * Users need to add below to their own project to use sharing.
   */
  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    if (requestCode == 0 && resultCode == Activity.RESULT_OK) {
      val intent = Intent(this, NotificationService::class.java)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        startForegroundService(intent)
      } else {
        startService(intent)
      }
    }
  }
}
