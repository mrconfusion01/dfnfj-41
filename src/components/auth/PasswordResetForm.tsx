
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordResetFormProps {
  onSubmit: (password: string) => Promise<void>;
  isLoading: boolean;
}

export const PasswordResetForm = ({ onSubmit, isLoading }: PasswordResetFormProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
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

      <Input
        id="password"
        name="password"
        type="password"
        placeholder="New password"
        className="h-9 rounded-full bg-white border-gray-300 text-sm"
        required
      />

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
