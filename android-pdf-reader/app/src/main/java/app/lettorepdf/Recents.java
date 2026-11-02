package app.lettorepdf;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;

/** File aperti di recente con ultima posizione di lettura. Salvati in SharedPreferences come JSON. */
final class Recents {

    static final class Item {
        final String uri;
        String name;
        int page;
        int count;
        float frac;
        long time;

        Item(String uri) {
            this.uri = uri;
        }
    }

    private static final String PREFS = "recents";
    private static final String KEY = "items";
    private static final int MAX = 40;

    private Recents() {
    }

    static List<Item> load(Context c) {
        List<Item> out = new ArrayList<>();
        String raw = prefs(c).getString(KEY, null);
        if (raw == null) return out;
        try {
            JSONArray a = new JSONArray(raw);
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.getJSONObject(i);
                Item it = new Item(o.getString("u"));
                it.name = o.optString("n", "PDF");
                it.page = o.optInt("p", 0);
                it.count = o.optInt("c", 0);
                it.frac = (float) o.optDouble("f", 0);
                it.time = o.optLong("t", 0);
                out.add(it);
            }
        } catch (JSONException ignored) {
            // Dati rovinati: si riparte da una lista vuota.
        }
        return out;
    }

    static Item find(Context c, String uri) {
        for (Item it : load(c)) {
            if (it.uri.equals(uri)) return it;
        }
        return null;
    }

    /** Inserisce o aggiorna il file e lo porta in cima alla lista. */
    static void save(Context c, String uri, String name, int page, float frac, int count) {
        List<Item> items = load(c);
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).uri.equals(uri)) {
                items.remove(i);
                break;
            }
        }
        Item it = new Item(uri);
        it.name = name;
        it.page = page;
        it.frac = frac;
        it.count = count;
        it.time = System.currentTimeMillis();
        items.add(0, it);
        while (items.size() > MAX) {
            Item dropped = items.remove(items.size() - 1);
            //noinspection ResultOfMethodCallIgnored
            thumb(c, dropped.uri).delete();
        }
        write(c, items);
    }

    static void remove(Context c, String uri) {
        List<Item> items = load(c);
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).uri.equals(uri)) {
                items.remove(i);
                break;
            }
        }
        //noinspection ResultOfMethodCallIgnored
        thumb(c, uri).delete();
        write(c, items);
    }

    /** Miniatura della prima pagina (può non esistere). */
    static File thumb(Context c, String uri) {
        String name;
        try {
            byte[] d = MessageDigest.getInstance("SHA-1").digest(uri.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 8; i++) sb.append(String.format("%02x", d[i]));
            name = sb.toString();
        } catch (Exception e) {
            name = Integer.toHexString(uri.hashCode());
        }
        return new File(new File(c.getFilesDir(), "thumbs"), name + ".jpg");
    }

    private static void write(Context c, List<Item> items) {
        JSONArray a = new JSONArray();
        try {
            for (Item it : items) {
                JSONObject o = new JSONObject();
                o.put("u", it.uri);
                o.put("n", it.name);
                o.put("p", it.page);
                o.put("c", it.count);
                o.put("f", it.frac);
                o.put("t", it.time);
                a.put(o);
            }
        } catch (JSONException e) {
            return;
        }
        prefs(c).edit().putString(KEY, a.toString()).apply();
    }

    private static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }
}
