package com.threedfly.common.util;

public class StoreUtils {
    public static String coalesce(String a, String b) {
        return a != null && !a.isBlank() ? a : b;
    }
}
