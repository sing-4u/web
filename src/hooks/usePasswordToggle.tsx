import { useState } from "react";
import eyeOn from "../../src/assets/icons_pw_on.svg";
import eyeOff from "../../src/assets/icons_pw_off.svg";

interface PasswordState {
    value: string;
    type: "password" | "text";
}

const usePasswordToggle = () => {
    const [passwordState, setPasswordState] = useState<PasswordState>({
        type: "password",
        value: ""
    });

    const handleToggle = () => {
        setPasswordState((prevState) => ({
            ...prevState,
            type: prevState.type === "password" ? "text" : "password"
        }));
    };

    const handleEyeIconToggle = () =>
        passwordState.type === "password" ? eyeOn : eyeOff;

    return {
        passwordState,

        handleToggle,
        handleEyeIconToggle
    };
};

export default usePasswordToggle;
