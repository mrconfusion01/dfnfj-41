
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PasswordResetFormProps {
  onSubmit: (password: string) => Promise<void>;
  isLoading: boolean;
}

export const PasswordResetForm = ({ onSubmit, isLoading }: PasswordResetFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    await onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Set new password
        </h2>
        <p className="text-sm text-gray-600">
          Please enter your new password
        </p>
      </div>

      <div className="space-y-4">
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-9 rounded-full bg-white border-gray-300 text-sm"
          required
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="h-9 rounded-full bg-white border-gray-300 text-sm"
          required
        />

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-9 rounded-full bg-primary hover:bg-primary-hover text-white text-sm"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
};
