
/**
 * Represents a function that takes a Vector3 and returns a Vector3, typically a partially applied modifier.
 */
export type ModifierFunction = (v: Vector3) => Vector3;

export type ModifierArray<T extends keyof ModifierFactories> = {
    modifier: T;
    settings?: Parameters<ModifierFactories[T]>[0];
};

const modifierFactories = {
    Curve: (settings: CurveSettings = DEFAULT_CURVE_SETTINGS): ModifierFunction => (v) => Curve(v, settings),
    Deadzone: (settings: DeadzoneSettings = DEFAULT_DEADZONE_SETTINGS): ModifierFunction => (v) =>
        Deadzone(v, settings),
    InputSwizzle: (settings: SwizzleSettings = DEFAULT_SWIZZLE_SETTINGS): ModifierFunction => (v) => InputSwizzle(v, settings),
    MapRange: (settings: MapRangeSettings = DEFAULT_MAP_RANGE_SETTINGS): ModifierFunction => (v) => MapRange(v, settings),
    Negate: (settings: NegateSettings = DEFAULT_NEGATE_SETTINGS): ModifierFunction => (v) => Negate(v, settings),
    Normalize: (): ModifierFunction => (v) => Normalize(v),
    PositiveNegative: (settings: PositiveNegativeSettings = DEFAULT_POSITIVE_NEGATIVE_SETTINGS): ModifierFunction => (v) =>
        PositiveNegative(v, settings),
};

export type ModifierFactories = typeof modifierFactories;

export const Mods = {
    ...modifierFactories,

    Add: <T extends keyof typeof modifierFactories>(
        modifierName: T,
        settings: Parameters<typeof modifierFactories[T]>[0],
    ): ModifierFunction => {
        const modifierFactory = modifierFactories[modifierName] as (
            settings: Parameters<typeof modifierFactories[T]>[0],
        ) => ModifierFunction;
        return modifierFactory(settings);
    },

};

export type ModsBuilder = typeof Mods;
/* -------------------------------------------------------------------------- */
/*                               Curve Modifier                               */
/* -------------------------------------------------------------------------- */
const DEFAULT_CURVE_SETTINGS: CurveSettings = { curve: (t) => t, X: true, Y: true, Z: true };

export interface CurveSettings {
    /** The curve function mapping a value in the range 0-1 to a new value. */
    readonly curve: (t: number) => number;
    /** Whether to apply the curve to each axis. All default to true. */
    readonly X?: boolean;
    readonly Y?: boolean;
    readonly Z?: boolean;
}

const Curve = (input: Vector3, settings: CurveSettings): Vector3 => {
    const apply = (
        axisValue: number,
        enabled?: boolean,
    ) => (enabled === false ? axisValue : settings.curve(axisValue));

    return new Vector3(
        apply(input.X, settings.X),
        apply(input.Y, settings.Y),
        apply(input.Z, settings.Z),
    );
};

/* -------------------------------------------------------------------------- */
/*                              Deadzone Modifier                             */
/* -------------------------------------------------------------------------- */
interface DeadzoneSettings {
    /**
     * Both thresholds are treated as positive magnitudes (0-1).
     * Values with an absolute magnitude below `lowerThreshold` will be clamped to 0.
     * Values with an absolute magnitude above `upperThreshold` will be clamped to ±1.
     * Anything in-between is scaled linearly to the range 0-1 while preserving sign.
     */
    readonly lowerThreshold: number;
    readonly upperThreshold: number;
}

const DEFAULT_DEADZONE_SETTINGS: DeadzoneSettings = { lowerThreshold: 0.1, upperThreshold: 1 };

const Deadzone = (
    input: Vector3,
    settings: DeadzoneSettings = DEFAULT_DEADZONE_SETTINGS,
): Vector3 => {
    const mapAxis = (v: number) => {
        const absV = math.abs(v);
        if (absV < settings.lowerThreshold) return 0;
        const sign = v >= 0 ? 1 : -1;
        if (absV > settings.upperThreshold) return sign;
        // scale magnitude to 0-1 inside range and re-apply sign
        const scaled = (absV - settings.lowerThreshold)
            / (settings.upperThreshold - settings.lowerThreshold);
        return sign * scaled;
    };

    return new Vector3(mapAxis(input.X), mapAxis(input.Y), mapAxis(input.Z));
};

/* -------------------------------------------------------------------------- */
/*                             Input Swizzle Modifier                         */
/* -------------------------------------------------------------------------- */
type SwizzleOrder = "XYZ" | "XZY" | "YXZ" | "YZX" | "ZXY" | "ZYX";

const DEFAULT_SWIZZLE_SETTINGS: SwizzleSettings = { order: "XYZ" };

interface SwizzleSettings {
    readonly order: SwizzleOrder;
}

const InputSwizzle = (input: Vector3, settings: SwizzleSettings): Vector3 => {
    const components = {
        X: input.X,
        Y: input.Y,
        Z: input.Z,
    } as const;

    const [a, b, c] = settings.order.split("") as [
        "X" | "Y" | "Z",
        "X" | "Y" | "Z",
        "X" | "Y" | "Z",
    ];
    return new Vector3(components[a], components[b], components[c]);
};

/* -------------------------------------------------------------------------- */
/*                               Map Range Modifier                           */
/* -------------------------------------------------------------------------- */
const DEFAULT_MAP_RANGE_SETTINGS: MapRangeSettings = { inputMin: -1, inputMax: 1, outputMin: -1, outputMax: 1 };

interface MapRangeSettings {
    readonly applyClamp?: boolean;
    readonly inputMin: number;
    readonly inputMax: number;
    readonly outputMin: number;
    readonly outputMax: number;
    readonly X?: boolean;
    readonly Y?: boolean;
    readonly Z?: boolean;
}

const MapRange = (input: Vector3, s: MapRangeSettings): Vector3 => {
    const map = (v: number, enabled?: boolean) => {
        if (enabled === false) return v;
        const t = (v - s.inputMin) / (s.inputMax - s.inputMin);
        let out = t * (s.outputMax - s.outputMin) + s.outputMin;
        if (s.applyClamp) out = math.clamp(out, s.outputMin, s.outputMax);
        return out;
    };

    return new Vector3(map(input.X, s.X), map(input.Y, s.Y), map(input.Z, s.Z));
};

/* -------------------------------------------------------------------------- */
/*                                Negate Modifier                             */
/* -------------------------------------------------------------------------- */
const DEFAULT_NEGATE_SETTINGS: NegateSettings = { X: true, Y: false, Z: false };

interface NegateSettings {
    readonly X?: boolean;
    readonly Y?: boolean;
    readonly Z?: boolean;
}

const Negate = (input: Vector3, s: NegateSettings): Vector3 =>
    new Vector3(s.X ? -input.X : input.X, s.Y ? -input.Y : input.Y, s.Z ? -input.Z : input.Z);

/* -------------------------------------------------------------------------- */
/*                               Normalize Modifier                           */
/* -------------------------------------------------------------------------- */
const Normalize = (input: Vector3): Vector3 => {
    const mag = input.Magnitude;
    return mag === 0 ? input : input.div(mag);
};

/* -------------------------------------------------------------------------- */
/*                           Positive / Negative Modifier                     */
/* -------------------------------------------------------------------------- */
type RangeMode = "Positive" | "Negative";

const DEFAULT_POSITIVE_NEGATIVE_SETTINGS: PositiveNegativeSettings = { range: "Positive" };

interface PositiveNegativeSettings {
    readonly range: RangeMode;
    readonly X?: boolean;
    readonly Y?: boolean;
    readonly Z?: boolean;
}

const PositiveNegative = (input: Vector3, s: PositiveNegativeSettings): Vector3 => {
    const process = (v: number, enabled?: boolean): number => {
        if (enabled === false) return v;
        if (s.range === "Positive") {
            return v < 0 ? 0 : v;
        } else {
            // Negative range
            return v > 0 ? 0 : v;
        }
    };

    return new Vector3(process(input.X, s.X), process(input.Y, s.Y), process(input.Z, s.Z));
};

/* -------------------------------------------------------------------------- */
/*                         Helper – Composition Function                      */
/* -------------------------------------------------------------------------- */
// To make chaining easy we expose a simple compose function.  Usage:
//     const output = compose(
//         (v) => Curve(v, { curve: t => t * t }),
//         (v) => Negate(v, { X: true }),
//     )(new Vector3(1,0,0));
export const compose = (...mods: Array<ModifierFunction>) => (initial: Vector3) =>
    mods.reduce((acc, fn) => fn(acc), initial);



export function AddModifiers(...modifiers: ModifierArray<keyof ModifierFactories>[]): ModifierFunction[] {
    const modifiersArray = [];
    for (const modifier of modifiers) {
        modifiersArray.push(Mods.Add(modifier.modifier, modifier.settings));
    }
    return modifiersArray;
}
