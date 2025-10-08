declare module 'react-rotary-knob' {
  import * as React from 'react';

  export interface KnobSkin {
    svg: string;
    knobX: number;
    knobY: number;
    updateAttributes: Array<unknown>;
  }

  export interface KnobProps {
    min?: number;
    max?: number;
    value?: number;
    defaultValue?: number;
    unlockDistance?: number;
    preciseMode?: boolean;
    clampMin?: number;
    clampMax?: number;
    rotateDegrees?: number;
    step?: number;
    skin?: KnobSkin;
    onChange?: (value: number) => void;
    onStart?: () => void;
    onEnd?: () => void;
    style?: React.CSSProperties;
  }

  export const Knob: React.FC<KnobProps>;
}
