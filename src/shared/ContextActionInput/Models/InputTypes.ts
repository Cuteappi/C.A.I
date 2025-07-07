
export const AllKeysCategorized = {
    Buttons: {
        JoyButtons: {
            ButtonA: Enum.KeyCode.ButtonA, // X
            ButtonB: Enum.KeyCode.ButtonB, // Circle
            ButtonL1: Enum.KeyCode.ButtonL1,
            ButtonL2: Enum.KeyCode.ButtonL2,
            ButtonL3: Enum.KeyCode.ButtonL3,
            ButtonR1: Enum.KeyCode.ButtonR1,
            ButtonR2: Enum.KeyCode.ButtonR2,
            ButtonR3: Enum.KeyCode.ButtonR3,
            ButtonX: Enum.KeyCode.ButtonX, // Square
            ButtonY: Enum.KeyCode.ButtonY, // Triangle
            ButtonSelect: Enum.KeyCode.ButtonSelect, // Share
            DPadDown: Enum.KeyCode.DPadDown,
            DPadLeft: Enum.KeyCode.DPadLeft,
            DPadRight: Enum.KeyCode.DPadRight,
            DPadUp: Enum.KeyCode.DPadUp,
        },
        MouseButtons: {
            MouseButton1: Enum.UserInputType.MouseButton1,
            MouseButton2: Enum.UserInputType.MouseButton2,
            MouseButton3: Enum.UserInputType.MouseButton3,
        },
        KeyboardButtons: {
            A: Enum.KeyCode.A,
            B: Enum.KeyCode.B,
            C: Enum.KeyCode.C,
            D: Enum.KeyCode.D,
            E: Enum.KeyCode.E,
            F: Enum.KeyCode.F,
            G: Enum.KeyCode.G,
            H: Enum.KeyCode.H,
            I: Enum.KeyCode.I,
            J: Enum.KeyCode.J,
            K: Enum.KeyCode.K,
            L: Enum.KeyCode.L,
            M: Enum.KeyCode.M,
            N: Enum.KeyCode.N,
            O: Enum.KeyCode.O,
            P: Enum.KeyCode.P,
            Q: Enum.KeyCode.Q,
            R: Enum.KeyCode.R,
            S: Enum.KeyCode.S,
            T: Enum.KeyCode.T,
            U: Enum.KeyCode.U,
            V: Enum.KeyCode.V,
            W: Enum.KeyCode.W,
            X: Enum.KeyCode.X,
            Y: Enum.KeyCode.Y,
            Z: Enum.KeyCode.Z,
            Zero: Enum.KeyCode.Zero,
            One: Enum.KeyCode.One,
            Two: Enum.KeyCode.Two,
            Three: Enum.KeyCode.Three,
            Four: Enum.KeyCode.Four,
            Five: Enum.KeyCode.Five,
            Six: Enum.KeyCode.Six,
            Seven: Enum.KeyCode.Seven,
            Eight: Enum.KeyCode.Eight,
            Nine: Enum.KeyCode.Nine,
            F1: Enum.KeyCode.F1,
            F2: Enum.KeyCode.F2,
            F3: Enum.KeyCode.F3,
            F4: Enum.KeyCode.F4,
            F5: Enum.KeyCode.F5,
            F6: Enum.KeyCode.F6,
            F7: Enum.KeyCode.F7,
            F8: Enum.KeyCode.F8,
            F9: Enum.KeyCode.F9,
            F10: Enum.KeyCode.F10,
            F11: Enum.KeyCode.F11,
            F12: Enum.KeyCode.F12,
            Asterisk: Enum.KeyCode.Asterisk,
            Backspace: Enum.KeyCode.Backspace,
            CapsLock: Enum.KeyCode.CapsLock,
            Delete: Enum.KeyCode.Delete,
            Down: Enum.KeyCode.Down,
            End: Enum.KeyCode.End,
            Escape: Enum.KeyCode.Escape,
            GreaterThan: Enum.KeyCode.GreaterThan,
            Home: Enum.KeyCode.Home,
            Left: Enum.KeyCode.Left,
            LeftBracket: Enum.KeyCode.LeftBracket,
            LeftControl: Enum.KeyCode.LeftControl,
            LeftShift: Enum.KeyCode.LeftShift,
            LessThan: Enum.KeyCode.LessThan,
            Minus: Enum.KeyCode.Minus,
            NumLock: Enum.KeyCode.NumLock,
            PageDown: Enum.KeyCode.PageDown,
            PageUp: Enum.KeyCode.PageUp,
            Plus: Enum.KeyCode.Plus,
            Print: Enum.KeyCode.Print,
            Question: Enum.KeyCode.Question,
            QuotedDouble: Enum.KeyCode.QuotedDouble,
            Return: Enum.KeyCode.Return,
            Right: Enum.KeyCode.Right,
            RightAlt: Enum.KeyCode.RightAlt,
            RightBracket: Enum.KeyCode.RightBracket,
            RightShift: Enum.KeyCode.RightShift,
            Semicolon: Enum.KeyCode.Semicolon,
            Slash: Enum.KeyCode.Slash,
            Space: Enum.KeyCode.Space,
            Tab: Enum.KeyCode.Tab,
            Tilde: Enum.KeyCode.Tilde,
            Up: Enum.KeyCode.Up,
            Insert: Enum.KeyCode.Insert,
            KeypadEnter: Enum.KeyCode.KeypadEnter,
            KeypadPlus: Enum.KeyCode.KeypadPlus,
            KeypadMinus: Enum.KeyCode.KeypadMinus,
            KeypadMultiply: Enum.KeyCode.KeypadMultiply,
            KeypadDivide: Enum.KeyCode.KeypadDivide,
            Keypad0: Enum.KeyCode.KeypadZero,
            Keypad1: Enum.KeyCode.KeypadOne,
            Keypad2: Enum.KeyCode.KeypadTwo,
            Keypad3: Enum.KeyCode.KeypadThree,
            Keypad4: Enum.KeyCode.KeypadFour,
            Keypad5: Enum.KeyCode.KeypadFive,
            Keypad6: Enum.KeyCode.KeypadSix,
            Keypad7: Enum.KeyCode.KeypadSeven,
            Keypad8: Enum.KeyCode.KeypadEight,
            Keypad9: Enum.KeyCode.KeypadNine,
        },
    },
    Axis1D: {
        JoySticks: {
            Thumbstick1: Enum.KeyCode.Thumbstick1,
            Thumbstick2: Enum.KeyCode.Thumbstick2,
        },
        MouseActions: {
            MouseWheel: Enum.UserInputType.MouseWheel,
            MouseMovement: Enum.UserInputType.MouseMovement,
        }
    },
    Axis2D: {
        JoySticks: {
            Thumbstick1: Enum.KeyCode.Thumbstick1,
            Thumbstick2: Enum.KeyCode.Thumbstick2,
        },
        MouseActions: {
            MouseMovement: Enum.UserInputType.MouseMovement,
        }
    },
};



export type JoyButtons = typeof AllKeysCategorized.Buttons.JoyButtons;
export type MouseButtons = typeof AllKeysCategorized.Buttons.MouseButtons;
export type KeyboardButtons = typeof AllKeysCategorized.Buttons.KeyboardButtons;
export type JoySticks = typeof AllKeysCategorized.Axis1D.JoySticks;
export type MouseActions = typeof AllKeysCategorized.Axis1D.MouseActions;

export type GamepadKeys = JoyButtons & JoySticks;
export type KeyboardMouseKeys = KeyboardButtons & MouseActions & MouseButtons;
// no 2D because they're included in 1D


export type TAllKeysCategorized = JoyButtons & MouseButtons & KeyboardButtons & JoySticks & MouseActions;
export type TAllKeysCategorizedValues = TAllKeysCategorized[keyof TAllKeysCategorized];

