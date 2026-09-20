import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

export interface KeyboardState {
  visible: boolean;
  /** Height of the keyboard in points, 0 when hidden. */
  height: number;
}

/**
 * Tracks keyboard visibility and height.
 *
 * iOS fires the "will" events before the show/hide animation, so anything
 * positioned against the keyboard travels with it rather than snapping into
 * place afterwards. Android only emits the "did" variants.
 */
export function useKeyboard(): KeyboardState {
  const [state, setState] = useState<KeyboardState>({ visible: false, height: 0 });

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const show = Keyboard.addListener(showEvent, (event) => {
      setState({ visible: true, height: event.endCoordinates.height });
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      setState({ visible: false, height: 0 });
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return state;
}
