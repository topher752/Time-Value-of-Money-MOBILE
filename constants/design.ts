/**
 * Design tokens from the Figma file "TimeValueMockups".
 *
 * The file defines no Figma variables, so these are lifted from raw values in
 * the frames. Frames are 430pt wide, which is where the pixel measurements
 * come from; layout turns them into flexible rules, not absolute positions.
 */

export const Colors = {
  background: "#F0F0F0",
  /** Input fields and the help card. */
  surface: "#FFFFFF",
  inputBorder: "#599BD9",

  text: "#212121",
  /** Placeholders and the uncomputed headline. */
  textMuted: "rgba(33, 33, 33, 0.5)",
  /** The "(Years and Months)" hint. */
  textHint: "#AAAAAA",

  /** Compute buttons and the computed-field pill. */
  accent: "#9AFF9D",
  /** Reset and View Amortization. */
  action: "#98A6FF",
  /** The computed headline, once a result exists. */
  computed: "#874BFF",

  /** Header separator and footer background. */
  divider: "#D9D9D9",
  link: "#3853FF",
  helpIcon: "#73B0FF",
  /** Behind the help card. */
  scrim: "rgba(0, 0, 0, 0.85)",
} as const;

export const FontSize = {
  /** Computed value headline. */
  display: 40,
  /** "Escape the Rate Race!" on the contact screen. */
  title: 36,
  /** Screen header and help card heading. */
  heading: 24,
  input: 22,
  button: 18,
  /** Field labels, body copy, footer. */
  body: 16,
  pill: 14,
} as const;

/**
 * The design is set in Roboto; platform defaults are used rather than
 * bundling it. Swap in expo-font here if exact parity matters.
 */
export const FontFamily = {
  regular: undefined,
  bold: undefined,
} as const;

export const FontWeight = {
  regular: "400",
  bold: "700",
} as const;

export const Spacing = {
  /** Left and right screen margin. */
  screen: 20,
  /** Between an input and its Compute button. */
  rowGap: 15,
  /** Between input rows. */
  rowStack: 25,
  /** Inset on the inflation adjustment field. */
  indent: 23,
  labelGap: 6,
} as const;

export const Sizing = {
  headerHeight: 61,
  dividerHeight: 5,
  footerHeight: 53,

  inputHeight: 46,
  inputRadius: 5,
  inputBorderWidth: 1,
  inputPaddingH: 10,

  /** Years and months boxes. */
  narrowInputWidth: 110,
  /** Inflation adjustment field. */
  mediumInputWidth: 148,

  buttonRadius: 38,
  buttonPaddingH: 25,
  buttonPaddingV: 10,

  pillRadius: 38,
  pillPaddingH: 15,
  pillPaddingV: 3,

  menuIcon: 41,
  helpIcon: 30,

  helpCardRadius: 10,
  helpCardPadding: 20,
} as const;

/** Footer link target. */
export const SITE_URL = "https://escapetheraterace.com";
export const SITE_LABEL = "escapetheraterace.com";
