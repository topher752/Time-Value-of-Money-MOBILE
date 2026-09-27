import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, FontSize, FontWeight, Sizing, Spacing } from "../constants/design";
import Button from "./button";

type NoticeSheetProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

/**
 * A short modal notice, styled to match the help card. Used where a screen is
 * designed but not yet wired to a backend, so it says so plainly rather than
 * failing silently or pretending to have worked.
 */
export default function NoticeSheet({
  visible,
  title,
  message,
  onClose,
}: NoticeSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Dismiss">
        {/* Swallow taps so the card itself does not dismiss. */}
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Button label="Got it" variant="action" onPress={onClose} />
          </View>
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
  message: {
    fontSize: FontSize.body,
    color: Colors.text,
  },
  actions: {
    alignItems: "flex-end",
    marginTop: Spacing.rowStack,
  },
});
