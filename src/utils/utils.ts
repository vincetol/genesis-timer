import { ChangeEvent } from "react";

export const handleInput = (
  e: ChangeEvent<HTMLInputElement>,
  setter: React.Dispatch<React.SetStateAction<number>>
) => {
  if (!e.target) {
    return;
  }
  const { value } = e.target;
  setter(parseFloat(value));
};

export const handleToggle = (
  setter: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setter((prev) => !prev);
};

export const handleRadio = (
  e: ChangeEvent<HTMLInputElement>,
  setter: React.Dispatch<React.SetStateAction<string>>
) => {
  const { value = "" } = e?.target;
  setter(value);
};
