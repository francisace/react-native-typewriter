import React, { Children, useState, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  hidden: { color: 'transparent' },
});

export default function hideSubstring(component, fixed, start, end) {
  let index = 0;
  let endIndex;
  let startIndex;

  const [blinkAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  if (start > end) {
    endIndex = start;
    startIndex = end;
  } else {
    endIndex = end;
    startIndex = start || 0;
  }

  function cloneWithHiddenSubstrings(element) {
    const { children } = element.props;

    /* eslint-disable-next-line no-use-before-define */
    return React.cloneElement(element, {}, Children.map(children, hide));
  }

  function hide(child) {
    if (typeof child !== 'string') {
      return cloneWithHiddenSubstrings(child);
    }

    const strEnd = child.length + index;
    let newChild = null;

    if (strEnd > startIndex && (!endIndex || index < endIndex)) {
      const relStartIndex = startIndex - index;
      const relEndIndex = endIndex ? (endIndex - index) : strEnd;
      const leftString = child.substring(0, relStartIndex);
      const rightString = child.substring(relEndIndex, strEnd);

      if (!fixed) {
        newChild = [leftString, rightString];
      } else {
        const styledString = (
          <Text style={styles.hidden}>
            {child.substring(relStartIndex, relEndIndex)}
          </Text>
        );

        newChild = [leftString, styledString, rightString];
      }
    }

    index = strEnd;

    return newChild || child;
  }

  return (
    <>
      {cloneWithHiddenSubstrings(component)}
      <Animated.Text style={{ opacity: blinkAnim }}>|</Animated.Text>
    </>
  );
}
