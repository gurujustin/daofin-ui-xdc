import {
  Box,
  IconProps,
  createIcon,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { FC } from "react";

export const BiCubeX = createIcon({
  displayName: "UpDownIcon",
  viewBox: "0 0 16 16",
  d: "M14.2706 4.05718L8.27065 1.39051C8.18533 1.3526 8.09301 1.33301 7.99965 1.33301C7.90629 1.33301 7.81396 1.3526 7.72865 1.39051L1.72865 4.05718C1.71531 4.06318 1.70598 4.07318 1.69265 4.08051C1.67398 4.08984 1.65398 4.09584 1.63665 4.10718C1.62198 4.11718 1.61065 4.12984 1.59665 4.14051C1.54791 4.17673 1.50517 4.22037 1.46998 4.26984C1.45665 4.28851 1.44265 4.30518 1.43065 4.32384C1.4108 4.35908 1.39386 4.39587 1.37998 4.43384C1.37398 4.45184 1.36465 4.46851 1.35931 4.48651C1.34257 4.54506 1.33382 4.60561 1.33331 4.66651V11.3332C1.33331 11.5972 1.48798 11.8352 1.72931 11.9425L7.72931 14.6092C7.81598 14.6478 7.90798 14.6665 7.99998 14.6665C8.0928 14.6641 8.1841 14.6423 8.26798 14.6025L8.27065 14.6092L14.2706 11.9425C14.3886 11.8902 14.4888 11.8048 14.5591 11.6966C14.6294 11.5884 14.6667 11.4622 14.6666 11.3332V4.66651C14.6667 4.5375 14.6294 4.41124 14.5591 4.30307C14.4888 4.1949 14.3886 4.10948 14.2706 4.05718ZM7.99998 2.72984L12.3586 4.66651L7.99998 6.60318L7.12798 6.21584L3.64198 4.66651L7.99998 2.72984ZM2.66665 10.9005V5.69251L7.33331 7.76651V12.9738L2.66665 10.9005ZM8.66665 12.9738V7.76651L13.3333 5.69251V10.9005L8.66665 12.9738Z",
});
const BiCube: FC<IconProps> = ({ w, h }) => {
  return <BiCubeX w={w} h={h} color={useColorModeValue("black", "white")} />;
};

export default BiCube;
