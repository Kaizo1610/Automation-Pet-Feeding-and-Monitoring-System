/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  PRIMARY:'#F2982F',
  SECONDARY:'#FDF5E6',
  WHITE:'#FFFFFF',
  BLACK:'#000000',
  GREEN:'#07932E',
  BLUE:'#1437B1',
  GRAY:'#808080',
  PEACH:'#FEF7EF',
  LIGHTGRAY:'#D3D3D3',
  BROWN:'#964B00',
  RED:'#FF0000',
  LIGHTRED: '#FF474C',
  
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
