import type { MethodologyContent } from "./types";

const content: MethodologyContent = [
  {
    heading: "Überblick",
    body: "CogniMetric misst sechs kognitive Bereiche — logisches, numerisches, verbales und räumliches Denken, Arbeitsgedächtnis und Verarbeitungsgeschwindigkeit — anhand von Originalaufgaben, die meist bei jedem Versuch algorithmisch neu generiert werden. Die Antworten werden zu einer schwierigkeitsgewichteten Fähigkeitsschätzung je Bereich zusammengeführt, mittels eines logistischen Ein-Parameter-Modells (im Stil von Rasch), und in einen standardisierten Wert mit Mittelwert 100 und Standardabweichung 15 umgerechnet — dieselbe Skalenkonvention, die die meisten veröffentlichten Intelligenztests verwenden.",
  },
  {
    heading: "Die sechs Bereiche",
    body: "Logisches Denken nutzt abstrakte Musterergänzungssequenzen aus Formen, deren Rotation, Anzahl und Füllung nach einer oder mehreren gleichzeitig geltenden Regeln variieren.\n\nNumerisches Denken nutzt Zahlenfolgen, die arithmetischen, geometrischen, alternierenden, quadratischen oder Fibonacci-ähnlichen Regeln folgen.\n\nVerbales Denken nutzt Analogien und Aufgaben zur Identifikation des Außenseiters aus einer sprachspezifischen, kuratierten Aufgabensammlung, da sich verbale Beziehungen nicht direkt zwischen Sprachen übersetzen lassen.\n\nRäumliches Denken nutzt Aufgaben zur mentalen Rotation, die aus chiralen (asymmetrischen) Polyominoformen bestehen, wobei Spiegelbilder als klassischer Distraktor dienen.\n\nDas Arbeitsgedächtnis nutzt eine Zahlenspanne-Aufgabe mit über die Durchgänge zunehmender Sequenzlänge.\n\nDie Verarbeitungsgeschwindigkeit nutzt schnelle Gleich/Verschieden-Symbolvergleichsaufgaben innerhalb eines festen Zeitbudgets.",
  },
  {
    heading: "Aufgabengenerierung und Schwierigkeit",
    body: "Die meisten Aufgaben werden bei Bedarf aus einem versuchsspezifischen Zufalls-Seed generiert, statt aus einem festen, wiederverwendbaren Pool entnommen zu werden. Dies begrenzt Memorierungseffekte bei wiederholten Versuchen und ermöglicht es uns, die Aufgabenvielfalt zu skalieren, ohne Tausende von Aufgaben manuell zu erstellen.\n\nJede Aufgabe trägt einen nach Entwurf zugewiesenen Schwierigkeitsparameter — zum Beispiel die Anzahl gleichzeitig variierender Regeln bei einer Logikaufgabe, den Rotationswinkel bei einer räumlichen Aufgabe oder die Sequenzlänge bei einer Gedächtnisaufgabe — statt eines empirisch aus einer großen Vortest-Stichprobe geschätzten Werts. Dies ist ein wichtiger Unterschied zu professionell normierten Instrumenten, den wir hier in voller Transparenz offenlegen.",
  },
  {
    heading: "Auswertungsmodell",
    body: "Für logische, numerische, verbale, räumliche und Gedächtnisaufgaben schätzen wir Ihre Fähigkeit (Theta) mit einem logistischen Ein-Parameter-Modell: P(richtig) = 1 / (1 + e^-(Theta − b)), wobei b die Schwierigkeit der Aufgabe ist. Theta wird über ein kurzes Maximum-Likelihood-Verfahren (Newton-Raphson) geschätzt und als 100 + 15 × Theta in einen Standardwert umgerechnet.\n\nIhr Gesamtwert mittelt die Theta-Schätzungen über alle sechs Bereiche vor der Umrechnung, und Ihr Perzentil ergibt sich aus der Verteilungsfunktion der Standardnormalverteilung, angewandt auf diesen Mittelwert.",
  },
  {
    heading: "Auswertung der Verarbeitungsgeschwindigkeit",
    body: "Der Bereich Verarbeitungsgeschwindigkeit misst den Durchsatz unter Zeitdruck statt der Aufgabenschwierigkeit (jeder Durchgang hat konzeptionell eine ähnlich geringe Schwierigkeit) und wird daher anders bewertet: Die Netto-Anzahl richtiger Antworten (richtig minus falsch) wird gegen einen von uns selbst festgelegten Referenzmittelwert und eine Referenzstandardabweichung standardisiert, die nicht aus einer klinischen Normierungsstichprobe stammen. Dies wird ausdrücklich offengelegt, da es maßgeblich beeinflusst, wie dieser Teilwert zu interpretieren ist.",
  },
  {
    heading: "Zuverlässigkeitsprüfungen",
    body: "Jeder Bericht enthält eine grundlegende Zuverlässigkeitskennzeichnung. Wenn mehr als 30 % Ihrer Multiple-Choice-Antworten in weniger als 900 Millisekunden gegeben wurden — deutlich schneller, als echtes Lesen und Nachdenken in der Regel zulassen —, wird Ihr Bericht entsprechend markiert, da ein solches Muster häufig auf überstürztes oder unaufmerksames Antworten statt auf eine echte Fähigkeitsschätzung hindeutet.",
  },
  {
    heading: "Was dieser Test ist — und was nicht",
    body: "CogniMetric ist ein selbst durchgeführtes, selbstkalibriertes Instrument. Es wurde nicht gegen etablierte, professionell normierte Testbatterien (wie die Wechsler-Skalen oder die Raven-Matrizen) validiert und war nicht Gegenstand veröffentlichter Zuverlässigkeits- oder Validitätsstudien an einer repräsentativen Bevölkerungsstichprobe.\n\nAus diesem Grund sollte Ihr Wert als informative, unterhaltende Schätzung betrachtet werden — nicht als klinische, diagnostische oder rechtlich verwertbare Messung. Er darf nicht als Grundlage für schulische, berufliche, klinische oder rechtliche Entscheidungen dienen. Falls Sie für einen dieser Zwecke eine validierte Beurteilung benötigen, wenden Sie sich an einen approbierten Psychologen.",
  },
  {
    heading: "Daten- und Aufgabensicherheit",
    body: "Aufgabeninhalte und richtige Antworten werden deterministisch aus einem mit Ihrem Versuch gespeicherten Seed generiert und bei der Einreichung serverseitig neu berechnet, um Ihre Antworten zu bewerten. Das bedeutet, dass der Lösungsschlüssel niemals an Ihren Browser gesendet wird und Aufgabeninhalte nicht dauerhaft gespeichert werden müssen — nur Ihr Seed, Ihre Antworten und Ihre Antwortzeiten werden gespeichert.",
  },
];

export default content;
