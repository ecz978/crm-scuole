package app.lettorepdf;

import android.app.Activity;
import android.content.Context;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Insets;
import android.os.Build;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;

/** Piccoli helper per edge-to-edge e barre di sistema, con i percorsi per le API < 30. */
final class Ui {

    private Ui() {
    }

    static int dp(Context c, float v) {
        return Math.round(v * c.getResources().getDisplayMetrics().density);
    }

    static boolean isSystemNight(Context c) {
        int mode = c.getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
        return mode == Configuration.UI_MODE_NIGHT_YES;
    }

    /** Da chiamare prima di setContentView. */
    @SuppressWarnings("deprecation")
    static void edgeToEdge(Activity a) {
        Window w = a.getWindow();
        if (Build.VERSION.SDK_INT >= 30) w.setDecorFitsSystemWindows(false);
        w.setStatusBarColor(Color.TRANSPARENT);
        w.setNavigationBarColor(Color.TRANSPARENT);
        if (Build.VERSION.SDK_INT >= 29) w.setNavigationBarContrastEnforced(false);
    }

    /**
     * Imposta aspetto e visibilità delle barre di sistema.
     *
     * @param lightBars icone scure (per sfondi chiari)
     * @param hidden    modalità a tutto schermo
     */
    @SuppressWarnings("deprecation")
    static void systemBars(Activity a, boolean lightBars, boolean hidden) {
        Window w = a.getWindow();
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController c = w.getInsetsController();
            if (c == null) return;
            int mask = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
                    | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
            c.setSystemBarsAppearance(lightBars ? mask : 0, mask);
            if (hidden) {
                c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                c.hide(WindowInsets.Type.systemBars());
            } else {
                c.show(WindowInsets.Type.systemBars());
            }
        } else {
            int f = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
            if (lightBars) {
                f |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            }
            if (hidden) {
                f |= View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
            }
            w.getDecorView().setSystemUiVisibility(f);
        }
    }

    /** @return {sinistra, alto, destra, basso} in px */
    @SuppressWarnings("deprecation")
    static int[] insets(WindowInsets in) {
        if (Build.VERSION.SDK_INT >= 30) {
            Insets i = in.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
            return new int[]{i.left, i.top, i.right, i.bottom};
        }
        return new int[]{in.getSystemWindowInsetLeft(), in.getSystemWindowInsetTop(),
                in.getSystemWindowInsetRight(), in.getSystemWindowInsetBottom()};
    }
}
