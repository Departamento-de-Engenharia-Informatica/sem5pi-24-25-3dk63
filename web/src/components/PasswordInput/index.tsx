import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { ClipboardIcon, RepeatIcon } from "@/styles/Icons";

import Input from "../Input";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
  function handleCopyToClipboard() {
    navigator.clipboard.writeText(value);
    toast.success("Password copied to clipboard!", {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 2000,
    });
  }

  function handleGeneratePassword() {
    const LENGTH = 10;
    const MIN_CHARS = 1;
    const MIN_NUMBERS = 1;
    const MIN_SYMBOLS = 1;

    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*_-+=";

    let password = "";

    for (let i = 0; i < MIN_CHARS; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    for (let i = 0; i < MIN_NUMBERS; i++) {
      password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    for (let i = 0; i < MIN_SYMBOLS; i++) {
      password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }

    for (let i = password.length; i < LENGTH; i++) {
      const random = Math.floor(
        Math.random() * [chars, numbers, symbols].length
      );
      password += [chars, numbers, symbols][random].charAt(random);
    }

    onChange(password);

    toast.success("Password generated!", {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 2000,
    });
  }

  return (
    <div className="relative h-full">
      <Input
        placeholder="Password"
        type="password"
        autoComplete="new-password"
        value={value}
        onChange={onChange}
      />
      <button
        onClick={handleGeneratePassword}
        title="Generate new password"
        className="absolute right-6 top-1/2 translate-y-1"
      >
        <RepeatIcon className="h-6 w-6" />
      </button>
      <button
        onClick={handleCopyToClipboard}
        title="Copy password to clipboard"
        className="absolute right-[4rem] top-1/2 translate-y-1"
      >
        <ClipboardIcon className="h-6 w-6" />
      </button>
      <ToastContainer />
    </div>
  );
};

export default PasswordInput;
