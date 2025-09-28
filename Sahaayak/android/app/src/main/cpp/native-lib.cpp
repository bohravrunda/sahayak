#include <jni.h>

// This function is required by CMake to compile the library
extern "C" 
JNIEXPORT jstring JNICALL
Java_com_sahaayak_MainActivity_stringFromJNI(
    JNIEnv* env, 
    jobject /* this */) {
    return env->NewStringUTF("Hello from C++");
}
