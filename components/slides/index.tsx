export { default as Slide00 } from "./Slide00Title";
export { default as Slide01 } from "./Slide01Web1";
export { default as Slide02 } from "./Slide02Web2";
export { default as Slide03 } from "./Slide03Web2Problem";
export { default as Slide04 } from "./Slide04Web3";
export { default as Slide05 } from "./Slide05Architecture";
export { default as Slide06 } from "./Slide06DLT";
export { default as Slide07 } from "./Slide07Hashing";
export { default as Slide08 } from "./Slide08Signatures";
export { default as Slide09 } from "./Slide09SupplyChain";
export { default as Slide10 } from "./Slide10DIDs";
export { default as Slide11 } from "./Slide11VCs";
export { default as Slide12 } from "./Slide12Session2";
export { default as Slide13 } from "./Slide13ConsensusProblem";
export { default as Slide14 } from "./Slide14PoW";
export { default as Slide15 } from "./Slide15PoS";
export { default as Slide16 } from "./Slide16HashgraphDAG";
export { default as Slide17 } from "./Slide17Gossip";
export { default as Slide18 } from "./Slide18VirtualVoting";
export { default as Slide19 } from "./Slide19aBFTSecurity";
export { default as Slide20 } from "./Slide20HCS";
export { default as Slide21 } from "./Slide21HCSIoT";
export { default as Slide22 } from "./Slide22SmartContracts";
export { default as Slide23 } from "./Slide23ConsensusVsMirror";
export { default as Slide24 } from "./Slide24Governance";
export { default as Slide25 } from "./Slide25Stability";
export { default as Slide26 } from "./Slide26DevStack";
export { default as Slide27 } from "./Slide27QA";

import { ReactNode } from "react";

export function PlaceholderSlide({ children }: { children?: ReactNode }) {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#165D9E" />
      {children}
    </mesh>
  );
}
