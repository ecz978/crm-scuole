# Pubblicare ECZ PDF reader su F-Droid

F-Droid è gratuito, non ha account sviluppatore e **costruisce l'app dai sorgenti** con la propria firma. La revisione è manuale e richiede da alcuni giorni a settimane. Le regole cambiano: verifica sempre la [guida ufficiale](https://f-droid.org/docs/Inclusion_Policy/) e la [checklist](https://gitlab.com/fdroid/fdroiddata/-/blob/master/CONTRIBUTING.md).

## Già pronto in questo repo

| Requisito F-Droid | Dove |
|---|---|
| Licenza libera (GPL-3.0-or-later) | `LICENSE`, `README.md` |
| Nessuna libreria di terzi, nessun servizio Google, nessuna rete, nessun tracciamento | codice: solo framework Android |
| Nessun metadato firmato da Google nell'APK e nessun hash del commit (build riproducibile) | `app/build.gradle` (`dependenciesInfo`, `vcsInfo`) |
| Titolo, descrizioni, novità e immagini della scheda (it, en) | `fastlane/metadata/android/` |
| Bozza dei metadati da inviare a F-Droid | `fdroid/io.github.ecz978.pdfreader.yml` |
| Nome del pacchetto `io.github.ecz978.pdfreader` (namespace GitHub che possiedi davvero) | `app/build.gradle` |

Nessun "anti-feature" da dichiarare: niente pubblicità, niente tracciamento, niente servizi di rete, niente dipendenze non libere.

## Cosa devi fare tu

1. **Unire la PR #6 con `main`**, così il codice con licenza e metadati è nel ramo principale.
2. **Pubblicare la release `lettore-pdf-v1.4`** (versione 1.4, `versionCode` 5): F-Droid costruisce da un *tag* e la bozza dei metadati punta a questo. Dimmi quando e la preparo io.
3. **Creare un account gratuito su GitLab**, fare il fork di [`fdroid/fdroiddata`](https://gitlab.com/fdroid/fdroiddata), copiare `fdroid/io.github.ecz978.pdfreader.yml` in `metadata/` e aprire una **Merge Request**.
   In alternativa, aprire una "Request for Packaging" nel loro tracker e lasciar fare ai volontari (più lento, senza garanzie).
4. **Rispondere ai revisori** e aggiustare quello che chiedono.

## Cosa potrebbero chiedere

- **Repo dedicato.** Il codice vive dentro `crm-scuole` insieme al CRM: funziona (c'è `subdir`), ma un repository solo per l'app è più pulito per loro e per te. Se lo crei, lo trasferisco.
- **Versioni degli strumenti.** L'app usa `compileSdk 36`, Android Gradle Plugin 8.13 e Gradle 8.14.3: se il loro server di build non li ha, chiederanno versioni più basse.
- **Gradle wrapper.** Il file `gradle/wrapper/gradle-wrapper.jar` è quello ufficiale; se il controllo lo segnala, va tolto e F-Droid usa il suo Gradle.
- **Firma.** Con F-Droid l'APK è firmato da F-Droid: chi lo installa da lì non può aggiornare con gli APK di GitHub, e viceversa. Con un file di firma stabile e build riproducibili si può far pubblicare a F-Droid il *tuo* APK firmato, ma richiede la chiave di firma e verifiche in più.

## Aggiornamenti futuri

Con `UpdateCheckMode: Tags`, ogni nuovo tag `lettore-pdf-vX.Y` con `versionCode` aumentato viene rilevato da F-Droid in automatico. Per ogni versione: alzare `versionCode` e `versionName` in `app/build.gradle`, aggiungere `fastlane/metadata/android/*/changelogs/<versionCode>.txt` e creare il tag.
