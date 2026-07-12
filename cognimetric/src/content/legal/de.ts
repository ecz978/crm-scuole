import type { LegalContent } from "./types";

const content: LegalContent = {
  privacy: {
    updated: "Zuletzt aktualisiert: 12. Juli 2026",
    sections: [
      {
        heading: "Verantwortlicher",
        body: "Verantwortlicher für CogniMetric ist [Firmenname — vor dem Launch zu ergänzen], erreichbar unter privacy@cognimetric.example. Dieser Abschnitt muss vor dem Livegang der Website mit der tatsächlichen rechtlichen Identität des Betreibers, dem Sitz und gegebenenfalls der USt-IdNr. vervollständigt werden.",
      },
      {
        heading: "Daten, die wir erheben",
        body: "Für den Betrieb von CogniMetric erheben wir: (a) Ihre Antworten und Antwortzeiten während des Tests; (b) technische Daten wie eine gehashte IP-Adresse und den Browser-User-Agent, ausschließlich zur grundlegenden Sicherheit und Betrugsprävention; (c) Ihre E-Mail-Adresse, nur wenn Sie diese zur Zusendung einer Kopie Ihres Berichts angeben; (d) Zahlungsmetadaten unserer Zahlungsdienstleister (Stripe und PayPal) — wir sehen oder speichern niemals Ihre Karten- oder PayPal-Kontodaten; (e) Ihre Cookie-Einwilligungen.",
      },
      {
        heading: "Zweck und Rechtsgrundlage",
        body: "Wir verarbeiten Ihre Testantworten und Zahlungsdaten zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO): zur Erstellung Ihres Berichts über die kognitive Leistungsfähigkeit und zur Abwicklung Ihrer einmaligen Zahlung.\n\nIhre E-Mail-Adresse und optionale Analyse-Cookies verarbeiten wir nur mit Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit widerrufen können.\n\nGehashte IP-Adressen und technische Protokolle verarbeiten wir auf Grundlage unseres berechtigten Interesses an der Missbrauchsprävention und Absicherung des Dienstes (Art. 6 Abs. 1 lit. f DSGVO).",
      },
      {
        heading: "Speicherdauer",
        body: "Testantworten und -ergebnisse werden 24 Monate ab dem Testdatum gespeichert und danach gelöscht, sofern Sie keine frühere Löschung beantragen. Zahlungsdaten werden für den nach geltendem Steuer- und Handelsrecht erforderlichen Zeitraum (bis zu 10 Jahre) aufbewahrt und von unseren Zahlungsdienstleistern gehalten. Gehashte IP-Adressen werden 30 Tage gespeichert. Aufzeichnungen zur Cookie-Einwilligung werden 12 Monate gespeichert.",
      },
      {
        heading: "Empfänger und internationale Übermittlungen",
        body: "Wir geben Daten nur an die für den Betrieb von CogniMetric zwingend erforderlichen Auftragsverarbeiter weiter: unseren Hosting- und Datenbankanbieter sowie unsere Zahlungsdienstleister Stripe und PayPal. Einige dieser Anbieter verarbeiten Daten möglicherweise außerhalb des Europäischen Wirtschaftsraums; in diesem Fall stützen wir uns auf geeignete Garantien wie die Standardvertragsklauseln der Europäischen Kommission.",
      },
      {
        heading: "Ihre Rechte",
        body: "Nach der DSGVO haben Sie das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung und Widerspruch gegen die Verarbeitung Ihrer Daten sowie auf Datenübertragbarkeit. Sie können diese Rechte ausüben, indem Sie eine E-Mail an privacy@cognimetric.example senden. Sie haben zudem das Recht, sich bei Ihrer nationalen Datenschutzaufsichtsbehörde zu beschweren.",
      },
      {
        heading: "Sicherheit",
        body: "Wir wenden Datenminimierung von Anfang an an: Wir speichern niemals unverschlüsselte IP-Adressen, Kartennummern oder PayPal-Zugangsdaten, und der gesamte Datenverkehr wird verschlüsselt übertragen (HTTPS). Der Zugriff auf die Datenbank ist eingeschränkt, und Zahlungen werden vollständig von PCI-DSS-konformen Anbietern abgewickelt.",
      },
      {
        heading: "Altersanforderung",
        body: "CogniMetric richtet sich an Nutzer ab 16 Jahren. Wir erheben wissentlich keine Daten von Kindern unter 16 Jahren.",
      },
      {
        heading: "Änderungen dieser Erklärung",
        body: "Wir können diese Erklärung von Zeit zu Zeit aktualisieren; das oben genannte Datum der 'letzten Aktualisierung' spiegelt die neueste Fassung wider. Wesentliche Änderungen werden auf dieser Seite hervorgehoben.",
      },
    ],
  },
  cookies: {
    updated: "Zuletzt aktualisiert: 12. Juli 2026",
    sections: [
      {
        heading: "Was Cookies sind",
        body: "Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden und Websites helfen zu funktionieren und optional deren Nutzung zu verstehen.",
      },
      {
        heading: "Von uns verwendete Cookies",
        body: "Unbedingt erforderlich: cm_locale (merkt sich Ihre Sprache), ein Design-Cookie (merkt sich den hellen/dunklen Modus), cm_consent (merkt sich Ihre Cookie-Einstellungen) sowie eine Sitzungskennung, die Ihre Antworten mit Ihrem Testversuch und Ihrer Zahlung verknüpft. Diese sind immer aktiv, da die Website ohne sie nicht funktionieren kann.\n\nAnalyse: nur mit Ihrer Zustimmung über das Cookie-Banner verwendet, um die aggregierte Nutzung zu verstehen und die Website zu verbessern. Es wird keines gesetzt, bevor Sie zustimmen.\n\nMarketing: derzeit auf dieser Website nicht verwendet.",
      },
      {
        heading: "Cookies von Drittanbietern",
        body: "Wenn Sie sich für eine Zahlung entscheiden, können Stripe oder PayPal auf ihren gehosteten Zahlungsseiten eigene Cookies setzen, die ihren jeweiligen Datenschutz- und Cookie-Richtlinien unterliegen.",
      },
      {
        heading: "Verwaltung Ihrer Einstellungen",
        body: "Sie können Ihre Cookie-Einstellungen jederzeit ändern, indem Sie die Cookies Ihres Browsers für diese Website löschen — dadurch wird das Einwilligungsbanner erneut angezeigt — oder über die Einstellungen Ihres Browsers.",
      },
    ],
  },
  terms: {
    updated: "Zuletzt aktualisiert: 12. Juli 2026",
    sections: [
      {
        heading: "Der Dienst",
        body: "CogniMetric bietet eine selbst durchgeführte Online-Bewertung der kognitiven Leistungsfähigkeit in sechs Bereichen zu Informations- und Unterhaltungszwecken. Es handelt sich nicht um ein klinisches oder diagnostisches Instrument.",
      },
      {
        heading: "Teilnahmevoraussetzungen",
        body: "Sie müssen mindestens 16 Jahre alt sein, um CogniMetric eigenständig zu nutzen. Mit der Durchführung des Tests bestätigen Sie, diese Voraussetzung zu erfüllen.",
      },
      {
        heading: "Preis und Zahlung",
        body: "Der vollständige Bericht kostet einmalig 1,00 € (oder den beim Bezahlvorgang angezeigten Gegenwert), zahlbar per Karte, Apple Pay, Google Pay oder PayPal über unsere Zahlungsdienstleister Stripe und PayPal. Da es sich beim Bericht um digitale Inhalte handelt, die sofort nach der Zahlung bereitgestellt werden, erkennen Sie an, dass Sie Ihr gesetzliches Widerrufsrecht verlieren, sobald der Bericht freigeschaltet ist, gemäß dem geltenden EU-Verbraucherschutzrecht.",
      },
      {
        heading: "Rückerstattungen",
        body: "Da der Bericht sofort bereitgestellt wird, sind Zahlungen nach Freischaltung des Berichts grundsätzlich nicht erstattungsfähig, außer soweit zwingendes Verbraucherschutzrecht dies vorschreibt oder im Falle eines uns zurechenbaren technischen Fehlers. Kontaktieren Sie uns, wenn Sie glauben, fälschlicherweise belastet worden zu sein.",
      },
      {
        heading: "Zulässige Nutzung",
        body: "Sie verpflichten sich, nicht zu versuchen, das Zahlungssystem zu umgehen, Testversuche zu automatisieren oder massenhaft zu erzeugen oder den Dienst für rechtswidrige Zwecke zu nutzen.",
      },
      {
        heading: "Geistiges Eigentum",
        body: "Alle Testaufgaben, die Auswertungsmethodik, Texte und das Design sind Eigentum von CogniMetric oder seiner Lizenzgeber und dürfen ohne Genehmigung nicht kopiert oder weiterverbreitet werden.",
      },
      {
        heading: "Haftungsausschluss und Haftungsbeschränkung",
        body: "Der Dienst wird 'wie besehen' ohne jegliche Gewährleistung bereitgestellt. Der CogniMetric-Wert ist eine statistische Schätzung und darf nicht für klinische, schulische, berufliche oder rechtliche Entscheidungen herangezogen werden. Soweit gesetzlich zulässig, ist unsere Haftung auf den für den Bericht gezahlten Betrag beschränkt.",
      },
      {
        heading: "Anwendbares Recht",
        body: "Diese Bedingungen unterliegen italienischem Recht, unbeschadet zwingender verbraucherschutzrechtlicher Rechte, die Ihnen nach dem Recht Ihres Wohnsitzlandes zustehen können.",
      },
      {
        heading: "Kontakt",
        body: "Fragen zu diesen Bedingungen können an privacy@cognimetric.example gerichtet werden.",
      },
    ],
  },
};

export default content;
