package app.lettorepdf;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.text.format.DateUtils;
import android.util.LruCache;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/** Schermata iniziale: file recenti e pulsante per aprirne uno nuovo. */
public class HomeActivity extends Activity {

    private static final int REQ_OPEN = 1;

    private ListView list;
    private View empty;
    private RecentAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Ui.edgeToEdge(this);
        setContentView(R.layout.activity_home);
        Ui.systemBars(this, !Ui.isSystemNight(this), false);

        final View header = findViewById(R.id.header);
        final View fab = findViewById(R.id.fab);
        list = findViewById(R.id.list);
        empty = findViewById(R.id.empty);
        adapter = new RecentAdapter();
        list.setAdapter(adapter);

        fab.setOnClickListener(v -> pickFile());
        list.setOnItemClickListener((p, v, pos, id) -> {
            Recents.Item it = adapter.getItem(pos);
            startActivity(new Intent(this, ReaderActivity.class).setData(Uri.parse(it.uri)));
        });
        list.setOnItemLongClickListener((p, v, pos, id) -> {
            confirmRemove(adapter.getItem(pos));
            return true;
        });

        findViewById(R.id.root).setOnApplyWindowInsetsListener((v, in) -> {
            int[] i = Ui.insets(in);
            header.setPadding(Ui.dp(this, 24) + i[0], Ui.dp(this, 20) + i[1], Ui.dp(this, 24) + i[2], Ui.dp(this, 8));
            list.setPadding(i[0], 0, i[2], i[3] + Ui.dp(this, 104));
            empty.setPadding(i[0], 0, i[2], i[3] + Ui.dp(this, 80));
            FrameLayout.LayoutParams lp = (FrameLayout.LayoutParams) fab.getLayoutParams();
            lp.bottomMargin = i[3] + Ui.dp(this, 20);
            lp.setMarginEnd(i[2] + Ui.dp(this, 20));
            fab.setLayoutParams(lp);
            return in;
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        reload();
    }

    private void reload() {
        adapter.set(Recents.load(this));
        empty.setVisibility(adapter.getCount() == 0 ? View.VISIBLE : View.GONE);
    }

    private void pickFile() {
        Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT)
                .addCategory(Intent.CATEGORY_OPENABLE)
                .setType("application/pdf");
        startActivityForResult(i, REQ_OPEN);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQ_OPEN || resultCode != RESULT_OK || data == null || data.getData() == null) return;
        Uri uri = data.getData();
        try {
            // Serve per riaprire il file dai recenti anche dopo il riavvio.
            getContentResolver().takePersistableUriPermission(uri, Intent.FLAG_GRANT_READ_URI_PERMISSION);
        } catch (RuntimeException ignored) {
            // Il provider non offre permessi persistenti: il file si apre comunque questa volta.
        }
        startActivity(new Intent(this, ReaderActivity.class)
                .setData(uri)
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION));
    }

    private void confirmRemove(final Recents.Item item) {
        new AlertDialog.Builder(this)
                .setTitle(item.name)
                .setItems(new CharSequence[]{getString(R.string.remove_recent)}, (d, which) -> {
                    Recents.remove(this, item.uri);
                    reload();
                })
                .show();
    }

    private final class RecentAdapter extends BaseAdapter {
        private List<Recents.Item> items = new ArrayList<>();
        private final LruCache<String, Bitmap> thumbs = new LruCache<>(48);

        void set(List<Recents.Item> list) {
            items = list;
            notifyDataSetChanged();
        }

        @Override
        public int getCount() {
            return items.size();
        }

        @Override
        public Recents.Item getItem(int position) {
            return items.get(position);
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            if (convertView == null) {
                convertView = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_recent, parent, false);
            }
            Recents.Item it = items.get(position);
            ImageView thumb = convertView.findViewById(R.id.thumb);
            TextView name = convertView.findViewById(R.id.name);
            TextView meta = convertView.findViewById(R.id.meta);
            ProgressBar bar = convertView.findViewById(R.id.bar);

            name.setText(it.name);
            Bitmap bmp = thumbFor(it);
            if (bmp != null) {
                thumb.setScaleType(ImageView.ScaleType.CENTER_CROP);
                thumb.setImageTintList(null);
                thumb.setImageBitmap(bmp);
            } else {
                thumb.setScaleType(ImageView.ScaleType.CENTER);
                thumb.setImageTintList(ColorStateList.valueOf(getColor(R.color.text2)));
                thumb.setImageResource(R.drawable.ic_doc);
            }

            long now = System.currentTimeMillis();
            CharSequence when = now - it.time < DateUtils.MINUTE_IN_MILLIS
                    ? getString(R.string.just_now)
                    : DateUtils.getRelativeTimeSpanString(it.time, now,
                            DateUtils.MINUTE_IN_MILLIS, DateUtils.FORMAT_ABBREV_RELATIVE);
            if (it.count > 0) {
                meta.setText(getString(R.string.page_of, it.page + 1, it.count) + " · " + when);
                bar.setVisibility(View.VISIBLE);
                bar.setMax(1000);
                bar.setProgress(Math.round(1000f * Math.min(1f, (it.page + it.frac) / it.count)));
            } else {
                meta.setText(when);
                bar.setVisibility(View.GONE);
            }
            return convertView;
        }

        private Bitmap thumbFor(Recents.Item it) {
            File f = Recents.thumb(HomeActivity.this, it.uri);
            if (!f.exists()) return null;
            String key = f.getPath() + f.lastModified();
            Bitmap b = thumbs.get(key);
            if (b == null) {
                b = BitmapFactory.decodeFile(f.getPath());
                if (b != null) thumbs.put(key, b);
            }
            return b;
        }
    }
}
