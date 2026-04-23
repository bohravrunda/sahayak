# Minimum CMake version
cmake_minimum_required(VERSION 3.4.1)

# Example: build a native library (required even if empty)
add_library(
        native-lib
        SHARED
        src/main/cpp/native-lib.cpp  # dummy file (can be empty)
)

# Link Android log library
find_library(
        log-lib
        log
)

target_link_libraries(
        native-lib
        ${log-lib}
)
