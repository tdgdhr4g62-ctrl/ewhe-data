import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
  Platform,
  ActivityIndicator,
} from "react-native";

const DATA_URL =
  "https://raw.githubusercontent.com/tdgdhr4g62-ctrl/ewhe-data/main/data.json";

const FALLBACK = {
  EW73: {
    motto: "Dein Europa: Recht, Respekt – Realität?!",
    runde: "73. Europäischer Wettbewerb",
    landesjury: "09.02.2026 – 13.02.2026",
    einsendezeitraum: "26.01.2026 – 04.02.2026",
    bundessiegerehrung:
      "18.06.2026 · Fulda – Hessentag – Stadtschloss – Marmorsaal",
  },
  EW74: {
    motto: "Europa gerecht gestalten – was kostet die Zukunft?",
    thema: "Rund um das Thema Wirtschaft",
    landesjury: "01.02.2027 – 05.02.2027",
    einsendezeitraum: "20.01.2027 – 27.01.2027",
    bundessiegerehrung: "20.05.2027 · Kasseler Rathaus – Bürgersaal",
    neu: "Auch rein digitale Einsendung möglich",
  },
};

const PREISE = [
  {
    kuerzel: "BP",
    titel: "Bundessieger",
    icon: "🏆",
    farbe: "#FFD700",
    desc: "Reisepreise nach Berlin, Straßburg oder Brüssel, Jugendbegegnungen, Geld- und Sachpreise, Bücher, GEOlino/ZEIT Leo/Katapult-Abos, Powerbanks, vom Bundeskanzler signierte Bücher.",
  },
  {
    kuerzel: "LP1",
    titel: "Landespreis 1",
    icon: "🥇",
    farbe: "#C0C0C0",
    desc: "Gut auf hessischer Ebene. Qualifiziert sich für Bundesebene. Sachpreise & Gutscheine. Lehrende erhalten eine Urkunde.",
  },
  {
    kuerzel: "LP2",
    titel: "Landespreis 2",
    icon: "🥈",
    farbe: "#CD7F32",
    desc: "Gutes Ergebnis auf Landesebene. Sachpreise & Gutscheine. Regionale Siegerehrung.",
  },
  {
    kuerzel: "A",
    titel: "Anerkennung",
    icon: "🎖️",
    farbe: "#4d79ff",
    desc: "TA = Text, KA = Kunst, MA = Medien. Einsehbar nach Landesjury über anmeldung-ew.de.",
  },
  {
    kuerzel: "TU",
    titel: "Teilnahmeurkunde",
    icon: "📜",
    farbe: "#00cc55",
    desc: "Alle können ihre Urkunde selbst ausdrucken unter anmeldung-ew.de/admin/. Auch für Lehrkräfte.",
  },
];

const TIMELINE_73_STATIC = [
  {
    datum: "26.01. – 04.02.2026",
    label: "Einsendezeitraum 73. EW",
    icon: "📦",
    info: "Schulnummer auf Paket. Rücksendeaufkleber beilegen. Keine Briefmarken für Pakete!",
    start: new Date(2026, 0, 26),
    end: new Date(2026, 1, 4),
  },
  {
    datum: "09. – 13.02.2026",
    label: "Landesjury Hessen",
    icon: "⚖️",
    info: "Jurywoche. Landespreise & Anerkennungen werden ermittelt.",
    start: new Date(2026, 1, 9),
    end: new Date(2026, 1, 13),
  },
  {
    datum: "März 2026",
    label: "Preise einsehbar",
    icon: "🔎",
    info: "LP1, LP2, Anerkennung über anmeldung-ew.de abrufbar.",
    start: new Date(2026, 2, 1),
    end: new Date(2026, 2, 31),
  },
  {
    datum: "Nach Osterferien",
    label: "Bundespreise bekannt",
    icon: "🇩🇪",
    info: "Bekanntgabe auf europaeischer-wettbewerb.de & PDF-Download.",
    start: new Date(2026, 3, 1),
    end: new Date(2026, 4, 31),
  },
  {
    datum: "18.06.2026",
    label: "Bundessiegerehrung",
    icon: "🌟",
    info: "Fulda – Hessentag – Stadtschloss – Marmorsaal. Erstmals mit Wanderausstellung!",
    start: new Date(2026, 5, 18),
    end: new Date(2026, 5, 18),
  },
];

const TIMELINE_74_STATIC = [
  {
    datum: "Nach Sommerferien 2026",
    label: "Neue Themen & Plakat",
    icon: "📋",
    info: "Plakat kommt per Post über Schulamt oder regionalen Ansprechpartner.",
    start: new Date(2026, 7, 1),
    end: new Date(2026, 8, 30),
  },
  {
    datum: "20. – 27.01.2027",
    label: "Einsendezeitraum 74. EW",
    icon: "📦",
    info: "NEU: Auch rein digitale Einsendung möglich!",
    start: new Date(2027, 0, 20),
    end: new Date(2027, 0, 27),
  },
  {
    datum: "01. – 05.02.2027",
    label: "Landesjury 2027",
    icon: "⚖️",
    info: "Jury bewertet alle hessischen Beiträge.",
    start: new Date(2027, 1, 1),
    end: new Date(2027, 1, 5),
  },
  {
    datum: "20.05.2027",
    label: "Bundessiegerehrung 2027",
    icon: "🌟",
    info: "Kasseler Rathaus – Bürgersaal. Kooperation mit RP KasselNordOst.",
    start: new Date(2027, 4, 20),
    end: new Date(2027, 4, 20),
  },
];

// Berechnet automatisch den aktuell relevanten Schritt anhand des heutigen Datums
function getActiveIndex(steps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < steps.length; i++) {
    const { start, end } = steps[i];
    if (!start || !end) continue;
    // Laufender Schritt
    if (today >= start && today <= end) return i;
    // Nächster bevorstehender Schritt
    if (today < start) return i;
  }
  // Alles vorbei → letzten Schritt markieren
  return steps.length - 1;
}

const FAQ_ITEMS = [
  {
    frage: "A · Liste mit Preisen herunterladen",
    antwort:
      "1. Anmelden unter anmeldung-ew.de\n2. Blauen Button 'Arbeiten verwalten' klicken\n3. Unten auf 'Dokumente erstellen' klicken\n4. Dann auf 'Teilnehmerliste mit Preisen'\n5. Die Datei wird heruntergeladen.\n\nBundespreise werden automatisch nach den Osterferien auf europaeischer-wettbewerb.de veröffentlicht. Bundessiegerinnen und Bundessieger werden automatisch zur Bundessiegerehrung eingeladen.",
  },
  {
    frage: "B · Fragen zur Wanderausstellung",
    antwort:
      "1. Ab wann ist die Ausstellung möglich? → Termine auf der Homepage (Frankfurt, Groß Gerau, Fulda). Abholtermin mit dem Voraussteller vereinbaren.\n\n2. Müssen es immer 14 Tage sein? → Nein, kann auch länger sein. Zeitraum und Angaben schriftlich an den Landesbeauftragten.\n\n3. Letzte mögliche Wochen? → Abhängig vom letzten Aussteller – theoretisch bis zum 74. EW. Rückgabe mit Landesbeauftragtem vereinbaren.\n\n4. Welche Transportgröße? → 5 Kisten, ca. 50 Bilderrahmen (50x70 cm). Maße im Übergabeprotokoll auf der Homepage.\n\n5. Versicherung? → Für die Bilder selbst wird keine Versicherung benötigt.",
  },
  {
    frage: "C · Kontaktdaten ändern",
    antwort:
      "1. Anmelden unter anmeldung-ew.de\n2. Zu den Profileinstellungen navigieren\n3. Bereich 'Kontaktdaten' wählen\n4. Gewünschte Änderungen vornehmen\n5. Speichern\n\nHinweis: Die Verwaltung der Kontaktdaten liegt in Ihrer eigenen Verantwortung. Nur Sie können diese nach der Anmeldung ändern.",
  },
  {
    frage: "D · Paket einsenden",
    antwort:
      "Bitte Schulnummer deutlich auf dem Paket sichtbar machen!\n\nFür die Rücksendung: selbstklebenden Rücksendeaufkleber und Rücksendeetikett beilegen.\n\nWichtig: Briefe dürfen mit Briefmarken frankiert werden – Päckchen und Pakete nicht!\n\nFür Päckchen/Pakete bitte wählen:\n1. Online-Etikett\n2. Paketmarke\n3. Bargeld\n\nDetails auf der Homepage.",
  },
  {
    frage: "E · Beteiligungszahlen eingeben",
    antwort:
      "Nach der Anmeldung oben rechts auf 'Beteiligungszahlen' klicken.\n\nDort die Anzahl aller SuS eingeben, die am Wettbewerb mitgemacht haben – auch diejenigen, die nichts eingereicht haben.\n\nDanach: Speichern drücken! (zweimal bestätigen)",
  },
  {
    frage: "F · Bilder auf Bundesebene (LP1) – Was beachten?",
    antwort:
      "Bilder, die zur Bundesjury weitergeleitet werden, können Sie zur Bundessiegerehrung abholen oder mit Ihrem regionalen Ansprechpartner der Landesjury eine Mitnahme abstimmen.\n\nSie erhalten hierzu gesondert eine Information – bitte abwarten.\n\nAlle anderen Bilder erhalten Sie nach der Landesjury automatisch per Post, wenn Sie die Einsendungsbedingungen beachtet haben.",
  },
  {
    frage: "G · Teilnahmeurkunden drucken",
    antwort:
      "Anmelden unter anmeldung-ew.de/admin/\n\nDann:\n1. Lernende auswählen\n2. Auf 'Drucken' klicken\n3. 'Teilnahmebescheinigung der TN' wählen\n\nJede Schülerin und jeder Schüler kann die eigene Urkunde ausdrucken. Auch Lehrende können pro SuS die Teilnahmebescheinigung drucken.\n\nHinweis: Für Gruppen gibt es keine Teilnahmeurkunden.",
  },
  {
    frage: "H · Lehrerbescheinigung drucken",
    antwort:
      "Anmelden unter anmeldung-ew.de/admin/\n\nDann:\n1. Lernende auswählen\n2. Auf 'Drucken' klicken\n3. 'Lehrerbescheinigung der TN' wählen",
  },
  {
    frage: "I · Teilnehmerliste drucken",
    antwort:
      "Anmelden unter anmeldung-ew.de/admin/\n\nDann:\n1. Lernende auswählen\n2. Auf 'Drucken' klicken\n3. 'Teilnehmerliste' wählen",
  },
  {
    frage: "J · Anmeldeformular drucken",
    antwort:
      "Anmelden unter anmeldung-ew.de/admin/\n\nDann:\n1. Lernende auswählen\n2. Auf 'Drucken' klicken\n3. 'Anmeldeformular' wählen",
  },
  {
    frage: "K · Erhalten alle Lehrenden eine Urkunde?",
    antwort:
      "Nein.\n\nUrkunden erhalten nur Lehrerinnen und Lehrer, deren Schülerinnen und Schüler die Bundesebene (LP1) erreicht haben.\n\nAlle Lehrenden können jedoch eine Teilnahmebescheinigung selbst ausdrucken unter anmeldung-ew.de/admin/",
  },
  {
    frage: "L · Wer ist mein Ansprechpartner vor Ort?",
    antwort:
      "Ihren regionalen Ansprechpartner finden Sie in der Datei auf der Homepage.\n\nRegionale Ansprechpartner können sein: Europa Union oder Kolleginnen und Kollegen einer Schule.\n\nTypische Fragen an den AP:\n• Wann und wo findet die Siegerehrung statt?\n• Fragen zu den Urkunden\n• Wann erhalte ich die Einladung zur Siegerehrung?\n• Weitere regionale Fragen",
  },
  {
    frage: "M · Erklärung der Preise",
    antwort:
      "BP – Bundessieger: Erhalten Reisepreise, Sachpreise, Powerbank usw. Übergabe auf der Bundessiegerehrung. BP erhalten nur eine BP-Urkunde (keine LP1-Urkunde). Bundessieger und betreuende Lehrende werden automatisch eingeladen – bitte E-Mails und Spam-Ordner prüfen.\n\nLP1 – Landespreis 1: Gut auf hessischer Ebene. Ging auf Bundesebene, wurde aber kein Bundessieger.\n\nLP2 – Landespreis 2: Gutes Ergebnis auf Landesebene.\n\nAnerkennung (A): TA = Text, KA = Kunst, MA = Medien.\n\nTeilnahmeurkunde: Jede Schülerin/jeder Schüler kann selbst ausdrucken. Gruppenurkunde: nur eine pro Gruppe – bitte Gruppenname bei Anmeldung eingeben.",
  },
  {
    frage: "N · Weitere FAQ",
    antwort:
      "Weitere Antworten auf häufige Fragen findest du auf:\n\neuropaeischer-wettbewerb.de/faq/",
  },
];

const KONTAKT_LINKS = [
  { label: "Website", value: "www.ewhe.de", url: "https://www.ewhe.de", icon: "🌐" },
  { label: "Anmeldung", value: "anmeldung-ew.de", url: "https://anmeldung-ew.de", icon: "📝" },
  { label: "E-Mail", value: "wettbewerb@ewhe.de", url: "mailto:wettbewerb@ewhe.de", icon: "✉️" },
  {
    label: "Instagram",
    value: "@europaeischerwettbewerbhessen",
    url: "https://www.instagram.com/europaeischerwettbewerbhessen/",
    icon: "📸",
  },
  { label: "Landesbeauftragter", value: "Roland Gawinski", url: null, icon: "👤" },
];

const STATS = [
  { n: "Seit 1953", l: "Ältester Schülerwettbewerb Deutschlands", i: "📜" },
  { n: "80.000+", l: "Teilnehmer/Jahr bundesweit", i: "👩‍🎓" },
  { n: "70.000+", l: "Teilnehmer/Jahr in Hessen", i: "🏛️" },
  { n: "~600", l: "Bundespreise jährlich", i: "🏅" },
];

const NAV_TABS = [
  { id: "start",     label: "Start",     icon: "🏠" },
  { id: "themen",    label: "Themen",    icon: "✏️" },
  { id: "ablauf",    label: "Ablauf",    icon: "📅" },
  { id: "preise",    label: "Preise",    icon: "🏆" },
  { id: "aktuelles", label: "Aktuelles", icon: "📰" },
  { id: "anmeldung", label: "Anmeldung", icon: "📝" },
  { id: "einsenden", label: "Einsenden", icon: "📤" },
  { id: "faq",       label: "FAQ",       icon: "❓" },
];

const C = {
  bg: "#060e22",
  bg2: "#0b1a3e",
  gold: "#FFCC00",
  white: "#e8eaf2",
  muted: "#8892b0",
  blue: "#003399",
  blueLight: "#0052cc",
  cardBg: "rgba(255,255,255,0.05)",
  cardBorder: "rgba(255,255,255,0.09)",
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,204,0,0.18)",
    backgroundColor: C.bg,
  },
  headerEmoji: { fontSize: 38, marginBottom: 4 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.gold,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  headerSub: {
    fontSize: 10,
    color: C.gold,
    letterSpacing: 3,
    textTransform: "uppercase",
    opacity: 0.8,
    marginTop: 2,
  },
  nav: {
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,204,0,0.1)",
  },
  navBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  navBtnActive: { backgroundColor: C.blue },
  navBtnLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginTop: 2,
  },
  navBtnLabelActive: { color: C.gold },
  navBtnIcon: { fontSize: 15 },
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 14, paddingTop: 16, paddingBottom: 80 },
  cardBlue: {
    backgroundColor: "rgba(0,51,153,0.4)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,204,0,0.25)",
  },
  card: {
    backgroundColor: C.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.cardBorder,
  },
  cardGreen: {
    backgroundColor: "rgba(0,80,30,0.25)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,204,85,0.22)",
  },
  label: {
    fontSize: 10,
    color: C.gold,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  labelGreen: {
    fontSize: 10,
    color: "#00cc55",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  h2: {
    fontSize: 20,
    fontWeight: "700",
    color: C.gold,
    marginBottom: 14,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: C.white,
    marginBottom: 8,
    lineHeight: 26,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  titleSm: {
    fontSize: 15,
    fontWeight: "600",
    color: C.white,
    marginBottom: 6,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  body: { fontSize: 13, color: "#c8d0e8", lineHeight: 20 },
  bodySm: { fontSize: 12, color: "#c8d0e8", lineHeight: 18 },
  tag: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 2,
    marginBottom: 6,
  },
  tagText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  gridItem: {
    width: "47%",
    backgroundColor: C.cardBg,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.cardBorder,
  },
  gridNum: {
    fontSize: 20,
    fontWeight: "700",
    color: C.gold,
    lineHeight: 24,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  gridLabel: {
    fontSize: 10,
    color: C.muted,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 14,
  },
  timelineRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  timelineDot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineDotActive: { backgroundColor: C.blue, borderColor: C.gold },
  timelineDotIcon: { fontSize: 20 },
  timelineContent: { flex: 1, paddingTop: 3 },
  timelineDatum: {
    fontSize: 10,
    color: C.muted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  timelineDatumActive: { color: C.gold },
  timelineLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#c8d0e8",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  timelineLabelActive: { color: C.white },
  timelineInfo: { fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 17 },
  faqRow: {
    borderRadius: 14,
    marginBottom: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.cardBorder,
    backgroundColor: C.cardBg,
  },
  faqRowActive: {
    backgroundColor: "rgba(0,51,153,0.25)",
    borderColor: "rgba(255,204,0,0.25)",
  },
  faqHeader: { flexDirection: "row", alignItems: "center", gap: 10, padding: 13 },
  faqArrow: { fontSize: 14, color: C.gold, width: 14 },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#c8d0e8",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  faqQuestionActive: { color: C.white },
  faqAnswer: { paddingHorizontal: 14, paddingBottom: 14 },
  preisRow: {
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
  },
  preisHeader: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  preisIcon: { fontSize: 26 },
  preisTitel: {
    fontSize: 15,
    fontWeight: "600",
    color: C.white,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  preisArrow: { fontSize: 18, marginLeft: "auto" },
  preisDesc: { paddingHorizontal: 14, paddingBottom: 14 },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  linkIcon: { fontSize: 18, width: 26 },
  linkLabel: {
    fontSize: 10,
    color: C.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 1,
  },
  linkValue: { fontSize: 12, color: C.gold },
  toggleRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  toggleBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  toggleBtnActive: { backgroundColor: C.blue },
  toggleBtnText: { fontSize: 12, fontWeight: "700", color: C.muted },
  toggleBtnTextActive: { color: C.gold },
  newsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,204,0,0.12)",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255,204,0,0.25)",
    gap: 8,
  },
  tlLine: {
    position: "absolute",
    left: 25,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "rgba(255,204,0,0.3)",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.bg,
  },
  loadingText: { color: C.muted, marginTop: 12, fontSize: 13 },
  updateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,204,85,0.1)",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,204,85,0.2)",
    gap: 6,
  },
  updateText: { fontSize: 11, color: "#00cc55" },
});

function TabShell({ children }) {
  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      {children}
    </ScrollView>
  );
}

function SectionCard({ title, titleGreen, children, style, variant = "default" }) {
  const cardStyle =
    variant === "blue" ? s.cardBlue : variant === "green" ? s.cardGreen : s.card;
  const labelStyle = titleGreen ? s.labelGreen : s.label;
  const labelText = title || titleGreen;
  return (
    <View style={[cardStyle, style]}>
      {labelText ? <Text style={labelStyle}>{labelText}</Text> : null}
      {children}
    </View>
  );
}

function Tag({ text, color, bg }) {
  return (
    <View style={[s.tag, { backgroundColor: bg }]}>
      <Text style={[s.tagText, { color }]}>{text}</Text>
    </View>
  );
}

function NewsBadge({ children }) {
  return <View style={s.newsBadge}>{children}</View>;
}

function FAQItem({ item, open, onPress }) {
  return (
    <TouchableOpacity
      style={[s.faqRow, open && s.faqRowActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={s.faqHeader}>
        <Text style={s.faqArrow}>{open ? "▼" : "›"}</Text>
        <Text style={[s.faqQuestion, open && s.faqQuestionActive]}>{item.frage}</Text>
      </View>
      {open && (
        <View style={s.faqAnswer}>
          <Text style={s.body}>{item.antwort}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function PreisItem({ item, open, onPress }) {
  return (
    <TouchableOpacity
      style={[s.preisRow, { borderColor: item.farbe + "44", backgroundColor: item.farbe + "11" }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={s.preisHeader}>
        <Text style={s.preisIcon}>{item.icon}</Text>
        <View style={{ flex: 1 }}>
          <Tag text={item.kuerzel} color={item.farbe} bg={item.farbe + "22"} />
          <Text style={s.preisTitel}>{item.titel}</Text>
        </View>
        <Text style={[s.preisArrow, { color: item.farbe }]}>{open ? "▼" : "›"}</Text>
      </View>
      {open && (
        <View style={s.preisDesc}>
          <Text style={s.body}>{item.desc}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function TimelineItem({ step }) {
  return (
    <View style={s.timelineRow}>
      <View style={[s.timelineDot, step.active && s.timelineDotActive]}>
        <Text style={s.timelineDotIcon}>{step.icon}</Text>
      </View>
      <View style={s.timelineContent}>
        <Text style={[s.timelineDatum, step.active && s.timelineDatumActive]}>
          {step.datum}
        </Text>
        <Text style={[s.timelineLabel, step.active && s.timelineLabelActive]}>
          {step.label}
        </Text>
        <Text style={s.timelineInfo}>{step.info}</Text>
      </View>
    </View>
  );
}

function KontaktLink({ item, onPress, last }) {
  return (
    <TouchableOpacity
      style={[s.linkRow, last && { borderBottomWidth: 0 }]}
      onPress={() => onPress(item.url)}
      activeOpacity={item.url ? 0.7 : 1}
    >
      <Text style={s.linkIcon}>{item.icon}</Text>
      <View>
        <Text style={s.linkLabel}>{item.label}</Text>
        <Text style={[s.linkValue, !item.url && { color: C.white }]}>{item.value}</Text>
      </View>
    </TouchableOpacity>
  );
}

function StatGrid() {
  return (
    <View style={s.grid}>
      {STATS.map((f, i) => (
        <View key={i} style={s.gridItem}>
          <Text style={{ fontSize: 22 }}>{f.i}</Text>
          <Text style={s.gridNum}>{f.n}</Text>
          <Text style={s.gridLabel}>{f.l}</Text>
        </View>
      ))}
    </View>
  );
}

function TogglePicker({ value, onChange, options }) {
  return (
    <View style={s.toggleRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[s.toggleBtn, value === opt.value && s.toggleBtnActive]}
          onPress={() => onChange(opt.value)}
        >
          <Text style={[s.toggleBtnText, value === opt.value && s.toggleBtnTextActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TabStart({ EW73, EW74, lastUpdated, openURL }) {
  return (
    <TabShell>
      {lastUpdated && (
        <View style={s.updateBadge}>
          <Text style={{ fontSize: 12 }}>🔄</Text>
          <Text style={s.updateText}>Zuletzt aktualisiert: {lastUpdated}</Text>
        </View>
      )}
      <SectionCard variant="blue" title="Aktuell · 73. Wettbewerb">
        <Text style={s.title}>"{EW73.motto}"</Text>
        <Text style={s.body}>
          📦 <Text style={{ fontWeight: "600", color: C.white }}>Einsendung:</Text>{" "}
          {EW73.einsendezeitraum}
        </Text>
        <Text style={[s.body, { marginTop: 5 }]}>
          ⚖️ <Text style={{ fontWeight: "600", color: C.white }}>Landesjury:</Text>{" "}
          {EW73.landesjury}
        </Text>
        <Text style={[s.body, { marginTop: 5 }]}>
          🌟 <Text style={{ fontWeight: "600", color: C.white }}>Bundessiegerehrung:</Text>
          {"\n"}
          {EW73.bundessiegerehrung}
        </Text>
        <NewsBadge>
          <Tag text="NEU" color={C.gold} bg="rgba(255,204,0,0.2)" />
          <Text style={[s.bodySm, { flex: 1 }]}>Erstmalig Wanderausstellung in Hessen!</Text>
        </NewsBadge>
      </SectionCard>
      <SectionCard variant="green" titleGreen="Vorschau · 74. Wettbewerb">
        <Text style={[s.titleSm, { marginBottom: 8 }]}>"{EW74.motto}"</Text>
        <Text style={s.body}>
          📋 Thema: <Text style={{ fontStyle: "italic" }}>{EW74.thema}</Text>
        </Text>
        <Text style={[s.body, { marginTop: 4 }]}>📦 {EW74.einsendezeitraum}</Text>
        <Text style={[s.body, { marginTop: 4 }]}>⚖️ {EW74.landesjury}</Text>
        <Text style={[s.body, { marginTop: 4 }]}>🌟 {EW74.bundessiegerehrung}</Text>
        <Text style={[s.body, { marginTop: 8, color: "#00cc55", fontWeight: "600" }]}>
          ✦ {EW74.neu}
        </Text>
      </SectionCard>
      <StatGrid />
      <SectionCard title="Kontakt & Links">
        {KONTAKT_LINKS.map((c, i) => (
          <KontaktLink
            key={i}
            item={c}
            onPress={openURL}
            last={i === KONTAKT_LINKS.length - 1}
          />
        ))}
      </SectionCard>
    </TabShell>
  );
}

function TabThemen({ EW73, EW74 }) {
  return (
    <TabShell>
      <Text style={s.h2}>Wettbewerbsthemen</Text>
      <SectionCard variant="blue" title="73. Europäischer Wettbewerb · 2025/26">
        <Text style={s.title}>"{EW73.motto}"</Text>
        <Text style={s.body}>
          Das Plakat mit den altersgerechten Modulen wurde bereits an hessische Schulen versandt.
          Die Ausstellung zum 73. EW zeigt Arbeiten hessischer Schülerinnen und Schüler und ist
          als Wanderausstellung verfügbar.
        </Text>
      </SectionCard>
      <SectionCard variant="green" titleGreen="74. Europäischer Wettbewerb · 2026/27">
        <Text style={[s.titleSm, { marginBottom: 4 }]}>"{EW74.motto}"</Text>
        <Tag text={EW74.thema} color="#00cc55" bg="rgba(0,204,85,0.15)" />
        <Text style={s.body}>
          Das Plakat mit den neuen Themen wird ca. 1-2 Wochen nach den Sommerferien 2026 per Post
          verteilt.
        </Text>
        <NewsBadge>
          <Text style={[s.bodySm, { color: "#00cc55", fontWeight: "600" }]}>NEU: </Text>
          <Text style={[s.bodySm, { flex: 1 }]}>{EW74.neu}</Text>
        </NewsBadge>
      </SectionCard>
    </TabShell>
  );
}

function TabAblauf({ timeline73, timeline74 }) {
  const [tlView, setTlView] = useState("73");
  const baseTimeline = tlView === "73" ? timeline73 : timeline74;

  // Aktiven Schritt automatisch anhand des heutigen Datums berechnen
  const activeIdx = getActiveIndex(baseTimeline);
  const tl = baseTimeline.map((step, i) => ({ ...step, active: i === activeIdx }));

  return (
    <TabShell>
      <Text style={s.h2}>Wettbewerbsablauf</Text>
      <TogglePicker
        value={tlView}
        onChange={setTlView}
        options={[
          { value: "73", label: "73. EW (2025/26)" },
          { value: "74", label: "74. EW (2026/27)" },
        ]}
      />
      <View style={{ position: "relative" }}>
        <View style={s.tlLine} />
        {tl.map((step, i) => (
          <TimelineItem key={i} step={step} />
        ))}
      </View>
    </TabShell>
  );
}

function TabPreise() {
  const [openPreis, setOpenPreis] = useState(null);
  return (
    <TabShell>
      <Text style={s.h2}>Preise & Auszeichnungen</Text>
      <Text style={[s.body, { marginBottom: 14 }]}>
        Zuerst bewertet die{" "}
        <Text style={{ color: C.white, fontWeight: "600" }}>Landesjury Hessen</Text>, dann
        ausgewählte Beiträge an die{" "}
        <Text style={{ color: C.white, fontWeight: "600" }}>Bundesjury</Text>.
      </Text>
      {PREISE.map((p, i) => (
        <PreisItem
          key={i}
          item={p}
          open={openPreis === i}
          onPress={() => setOpenPreis(openPreis === i ? null : i)}
        />
      ))}
    </TabShell>
  );
}

function TabAktuelles({ openURL }) {
  return (
    <TabShell>
      <Text style={s.h2}>Aktuelles</Text>
      <SectionCard>
        <Text style={s.body}>
          Aktuelle Neuigkeiten zum Europäischen Wettbewerb Hessen findest du auf der Website.
        </Text>
        <TouchableOpacity
          style={s.tag}
          onPress={() => openURL("https://www.ewhe.de/aktuelles/")}
        >
          <Text style={[s.tagText, { color: C.gold }]}>ewhe.de/aktuelles</Text>
        </TouchableOpacity>
      </SectionCard>
    </TabShell>
  );
}

function TabAnmeldung({ openURL }) {
  return (
    <TabShell>
      <Text style={s.h2}>Anmeldung</Text>
      <SectionCard variant="blue" title="Jetzt anmelden">
        <Text style={s.body}>
          Die Anmeldung zum Europäischen Wettbewerb erfolgt online über die Website.
        </Text>
        <TouchableOpacity
          style={s.tag}
          onPress={() => openURL("https://anmeldung-ew.de/")}
        >
          <Text style={[s.tagText, { color: C.gold }]}>Zur Anmeldung</Text>
        </TouchableOpacity>
      </SectionCard>
    </TabShell>
  );
}

function TabEinsenden({ openURL }) {
  return (
    <TabShell>
      <Text style={s.h2}>Einsenden</Text>
      <SectionCard variant="blue" title="Arbeiten einreichen">
        <Text style={s.body}>Reiche deine Wettbewerbsarbeit online ein.</Text>
        <TouchableOpacity
          style={s.tag}
          onPress={() => openURL("https://www.ewhe.de/einsenden/")}
        >
          <Text style={[s.tagText, { color: C.gold }]}>Zur Einsendung</Text>
        </TouchableOpacity>
      </SectionCard>
    </TabShell>
  );
}

function TabFaq({ openURL }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <TabShell>
      <Text style={s.h2}>Häufige Fragen</Text>
      {FAQ_ITEMS.map((f, i) => (
        <FAQItem
          key={i}
          item={f}
          open={openFaq === i}
          onPress={() => setOpenFaq(openFaq === i ? null : i)}
        />
      ))}
      <SectionCard style={{ alignItems: "center", marginTop: 8 }}>
        <Text style={{ fontSize: 26, marginBottom: 6 }}>💬</Text>
        <Text style={[s.titleSm, { textAlign: "center", marginBottom: 4 }]}>
          Noch mehr Fragen?
        </Text>
        <TouchableOpacity
          onPress={() => openURL("https://www.europaeischer-wettbewerb.de/faq/#faq")}
        >
          <Text style={[s.bodySm, { textAlign: "center", color: C.gold }]}>
            europaeischer-wettbewerb.de/faq
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openURL("mailto:wettbewerb@ewhe.de")}>
          <Text style={[s.bodySm, { textAlign: "center", marginTop: 4 }]}>
            Mail: <Text style={{ color: C.gold }}>wettbewerb@ewhe.de</Text>
          </Text>
        </TouchableOpacity>
      </SectionCard>
    </TabShell>
  );
}

export default function App() {
  const [tab, setTab] = useState("start");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch(DATA_URL + "?t=" + Date.now());
      const json = await response.json();
      setData(json);
      setLastUpdated(new Date().toLocaleDateString("de-DE"));
    } catch {
      setData(FALLBACK);
    } finally {
      setLoading(false);
    }
  }

  function openURL(url) {
    if (url) Linking.openURL(url).catch(() => {});
  }

  if (loading) {
    return (
      <View style={s.loadingContainer}>
        <Text style={{ fontSize: 38 }}>🇪🇺</Text>
        <ActivityIndicator color={C.gold} size="large" style={{ marginTop: 16 }} />
        <Text style={s.loadingText}>Daten werden geladen…</Text>
      </View>
    );
  }

  const { EW73, EW74 } = data;
  const timeline73 = data.timeline73 || TIMELINE_73_STATIC;
  const timeline74 = data.timeline74 || TIMELINE_74_STATIC;

  const sharedProps = { EW73, EW74, openURL, lastUpdated };

  const SCREENS = {
    start:     <TabStart {...sharedProps} />,
    themen:    <TabThemen EW73={EW73} EW74={EW74} />,
    ablauf:    <TabAblauf timeline73={timeline73} timeline74={timeline74} />,
    preise:    <TabPreise />,
    aktuelles: <TabAktuelles openURL={openURL} />,
    anmeldung: <TabAnmeldung openURL={openURL} />,
    einsenden: <TabEinsenden openURL={openURL} />,
    faq:       <TabFaq openURL={openURL} />,
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={s.header}>
        <Text style={s.headerEmoji}>🇪🇺</Text>
        <Text style={s.headerTitle}>Europäischer Wettbewerb</Text>
        <Text style={s.headerSub}>Hessen · ewhe.de</Text>
      </View>
      <View style={s.nav}>
        {NAV_TABS.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[s.navBtn, tab === t.id && s.navBtnActive]}
            onPress={() => setTab(t.id)}
            activeOpacity={0.8}
          >
            <Text style={s.navBtnIcon}>{t.icon}</Text>
            <Text style={[s.navBtnLabel, tab === t.id && s.navBtnLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {SCREENS[tab]}
    </SafeAreaView>
  );
}
