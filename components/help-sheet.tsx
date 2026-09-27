import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors, FontSize, FontWeight, Sizing, Spacing } from "../constants/design";
import type { HelpContent } from "../lib/calculators";

type HelpSheetProps = {
  visible: boolean;
  content: HelpContent;
  onClose: () => void;
};

/**
 * The header "?" overlay: a white card on a dark scrim, per the help frames.
 * Tapping the scrim dismisses; the body scrolls, since the card runs long on
 * devices shorter than the 430x932 it was drawn at.
 */
export default function HelpSheet({ visible, content, onClose }: HelpSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close help">
        {/* Swallow taps so the card itself does not dismiss. */}
        <Pressable style={styles.card} onPress={() => {}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.intro}>{content.intro}</Text>

            {content.items.map((item, index) => (
              <View key={item.term} style={styles.item}>
                <Text style={styles.itemNumber}>{`${index + 1}.`}</Text>
                <Text style={styles.itemBody}>
                  <Text style={styles.itemTerm}>{item.term}</Text>
                  {` - ${item.description}`}
                </Text>
              </View>
            ))}

            <Text style={styles.closing}>{content.closing}</Text>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: Colors.scrim,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  card: {
    maxHeight: "80%",
    backgroundColor: Colors.surface,
    borderRadius: Sizing.helpCardRadius,
    padding: Sizing.helpCardPadding,
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.labelGap * 2,
  },
  intro: {
    fontSize: FontSize.body,
    color: Colors.text,
    marginBottom: Spacing.labelGap * 2,
  },
  item: {
    flexDirection: "row",
    marginBottom: 4,
  },
  itemNumber: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    width: 24,
  },
  itemBody: {
    flex: 1,
    fontSize: FontSize.body,
    color: Colors.text,
  },
  itemTerm: {
    fontWeight: FontWeight.bold,
  },
  closing: {
    fontSize: FontSize.body,
    color: Colors.text,
    marginTop: Spacing.labelGap * 2,
  },
});
