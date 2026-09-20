import type { DrawerNavigationProp } from "@react-navigation/drawer";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../components/footer";
import NoticeSheet from "../components/notice-sheet";
import ScreenHeader from "../components/screen-header";
import { Colors, FontSize, FontWeight, SITE_LABEL, Sizing, Spacing } from "../constants/design";

const INTRO =
  "Please let us know if you have any questions on our Free Retirement " +
  "Investment Calculator or our No Ads Mortgage Calculator.  Our intent is " +
  "to make these calculators simple and easy to use, so let us know if that " +
  "is not the case.  Thank you!";

export default function ContactPage() {
  const navigation = useNavigation<DrawerNavigationProp<Record<string, undefined>>>();
  const [message, setMessage] = useState("");
  const [noticeVisible, setNoticeVisible] = useState(true);

  /*
   * The notice is raised on arrival rather than on submit. There is nowhere
   * for the form to post yet, and letting someone compose a message and press
   * Submit only to be told it goes nowhere wastes their effort. Saying so up
   * front costs them one tap instead.
   *
   * useFocusEffect rather than mount: the drawer keeps screens mounted, so an
   * effect on mount would only ever fire once per session.
   */
  useFocusEffect(
    useCallback(() => {
      setNoticeVisible(true);
    }, []),
  );

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
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

          {/*
            No Submit button while there is no destination: a control that
            cannot do its job is worse than its absence. The field is left
            editable so the screen still reads as the designed form.
          */}
        </ScrollView>
      </TouchableWithoutFeedback>

      <Footer />

      <NoticeSheet
        visible={noticeVisible}
        title="Contact Us"
        message={
          "Sending messages from the app is still a work in progress, so this " +
          "form is not connected yet. In the meantime you can reach us at " +
          `${SITE_LABEL}.`
        }
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
});
