import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/button";
import Footer from "../components/footer";
import NoticeSheet from "../components/notice-sheet";
import ScreenHeader from "../components/screen-header";
import { Colors, FontSize, FontWeight, Sizing, Spacing } from "../constants/design";

const INTRO =
  "Please let us know if you have any questions on our Free Retirement " +
  "Investment Calculator or our No Ads Mortgage Calculator.  Our intent is " +
  "to make these calculators simple and easy to use, so let us know if that " +
  "is not the case.  Thank you!";

export default function ContactPage() {
  const navigation = useNavigation<DrawerNavigationProp<Record<string, undefined>>>();
  const [message, setMessage] = useState("");
  const [noticeVisible, setNoticeVisible] = useState(false);

  /* The design specifies the form but not where it posts. The message stays
   * in the field so nothing the user wrote is thrown away. */
  const submit = () => setNoticeVisible(true);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <ScreenHeader title="Contact Us" onMenuPress={() => navigation.openDrawer()} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Escape the Rate Race!</Text>
          <Text style={styles.intro}>{INTRO}</Text>

          <Text style={styles.label}>Message</Text>
          <TextInput
            accessibilityLabel="Message"
            style={[styles.input, message === "" && styles.inputEmpty]}
            value={message}
            onChangeText={setMessage}
            placeholder="Leave your message here"
            placeholderTextColor={Colors.textMuted}
            multiline
            textAlignVertical="top"
          />

          <Button label="Submit Message" onPress={submit} style={styles.submit} />
        </ScrollView>
      </TouchableWithoutFeedback>

      <Footer />

      <NoticeSheet
        visible={noticeVisible}
        title="Contact Us"
        message="Message sending is still a work in progress. Check back soon."
        onClose={() => setNoticeVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.screen,
    paddingBottom: Spacing.screen * 2,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: "center",
    marginBottom: Spacing.rowStack,
  },
  intro: {
    fontSize: FontSize.body,
    color: Colors.text,
    marginBottom: Spacing.rowStack * 2,
  },
  label: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.labelGap,
  },
  input: {
    height: 166,
    padding: Sizing.inputPaddingH,
    borderWidth: Sizing.inputBorderWidth,
    borderColor: Colors.inputBorder,
    borderRadius: Sizing.inputRadius,
    backgroundColor: Colors.surface,
    fontSize: FontSize.button,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  inputEmpty: {
    fontStyle: "italic",
  },
  submit: {
    alignSelf: "flex-end",
    marginTop: Spacing.rowStack,
  },
});
